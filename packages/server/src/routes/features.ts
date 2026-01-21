/**
 * Features API routes
 *
 * Handles CRUD and search operations for features via REST API.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  FeatureRepository,
  getDatabase,
  initializeTables,
  logger,
  FeatureNotFoundError,
  FeatureAlreadyClaimedError,
  ProjectNotFoundError,
  ValidationError,
  isOpenAutocoderError,
} from "@open-autocoder/core";
import { join } from "path";
import { existsSync } from "fs";

// Zod schemas for request validation
const searchQuerySchema = z.object({
  q: z.string().optional(),
  passes: z.enum(["true", "false"]).optional().transform(val => val === "true" ? true : val === "false" ? false : undefined),
  inProgress: z.enum(["true", "false"]).optional().transform(val => val === "true" ? true : val === "false" ? false : undefined),
  category: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
});

const createFeatureSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  steps: z.array(z.string()).min(1, "At least one step is required"),
  dependencies: z.array(z.number().int().positive()).optional(),
});

const bulkCreateFeatureItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  steps: z.array(z.string()).min(1, "At least one step is required"),
  depends_on_indices: z.array(z.number().int().min(0)).optional(),
});

const bulkCreateFeaturesSchema = z.object({
  features: z.array(bulkCreateFeatureItemSchema).min(1, "At least one feature is required"),
});

type SearchQuery = z.input<typeof searchQuerySchema>;
type CreateFeatureBody = z.infer<typeof createFeatureSchema>;
type BulkCreateFeaturesBody = z.infer<typeof bulkCreateFeaturesSchema>;

// Feature database cache per project
const featureRepos = new Map<string, FeatureRepository>();

function getFeatureRepository(projectPath: string): FeatureRepository {
  const cacheKey = projectPath;
  let repo = featureRepos.get(cacheKey);

  if (!repo) {
    const dbPath = join(projectPath, "features.db");
    if (!existsSync(projectPath)) {
      throw new ValidationError(`Project path does not exist: ${projectPath}`);
    }
    const db = getDatabase(dbPath);
    initializeTables(db);
    repo = new FeatureRepository(db);
    featureRepos.set(cacheKey, repo);
  }

  return repo;
}

/**
 * Handle errors and return appropriate HTTP responses
 */
function handleError(
  error: unknown,
  reply: FastifyReply
): FastifyReply {
  if (error instanceof FeatureNotFoundError) {
    return reply.status(404).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof ProjectNotFoundError) {
    return reply.status(404).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof FeatureAlreadyClaimedError) {
    return reply.status(409).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof ValidationError) {
    return reply.status(400).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (isOpenAutocoderError(error)) {
    return reply.status(500).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  // Unknown error
  const message = error instanceof Error ? error.message : String(error);
  logger.error("Unexpected error in features API", { error: message });
  return reply.status(500).send({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

/**
 * Register all feature routes on the Fastify instance
 */
export async function registerFeatureRoutes(
  fastify: FastifyInstance,
  getProjectPath: (projectName: string) => Promise<string>
): Promise<void> {
  /**
   * GET /api/projects/:name/features - List/search features
   * Query params:
   * - q: search query string (searches by name)
   * - passes: filter by passes status (true/false)
   * - inProgress: filter by in_progress status (true/false)
   * - category: filter by category
   * - limit: max results
   * - offset: pagination offset
   */
  fastify.get(
    "/api/projects/:name/features",
    async (
      request: FastifyRequest<{ Params: { name: string }; Querystring: SearchQuery }>,
      reply: FastifyReply
    ) => {
      try {
        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);

        // Parse and validate query parameters
        const parseResult = searchQuerySchema.safeParse(request.query);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const query = parseResult.data;

        // Build options object, only including defined values
        const options: {
          passes?: boolean;
          inProgress?: boolean;
          category?: string;
          limit?: number;
          offset?: number;
        } = {};
        if (query.passes !== undefined) options.passes = query.passes;
        if (query.inProgress !== undefined) options.inProgress = query.inProgress;
        if (query.category !== undefined) options.category = query.category;
        if (query.limit !== undefined) options.limit = query.limit;
        if (query.offset !== undefined) options.offset = query.offset;

        // If search query is provided, use search method
        if (query.q && query.q.trim().length > 0) {
          const features = await repo.search(query.q.trim(), options);
          return reply.send({
            features,
            count: features.length,
            searchQuery: query.q,
          });
        }

        // Otherwise, list all features with filters
        const features = await repo.list(options);
        return reply.send({
          features,
          count: features.length,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name/features/search - Search features by name
   * Query params:
   * - q: search query string (required)
   * - limit: max results (default: 50)
   */
  fastify.get(
    "/api/projects/:name/features/search",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Querystring: { q?: string; limit?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { q, limit } = request.query;

        if (!q || q.trim().length === 0) {
          return reply.status(400).send({
            error: "Search query 'q' is required",
            code: "VALIDATION_ERROR",
          });
        }

        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);

        const maxResults = limit ? parseInt(limit, 10) : 50;
        const features = await repo.search(q.trim(), {
          limit: maxResults,
        });

        return reply.send({
          features,
          count: features.length,
          searchQuery: q,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name/features/:id - Get feature by ID
   */
  fastify.get(
    "/api/projects/:name/features/:id",
    async (
      request: FastifyRequest<{ Params: { name: string; id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const featureId = parseInt(request.params.id, 10);
        if (isNaN(featureId)) {
          return reply.status(400).send({
            error: "Invalid feature ID",
            code: "VALIDATION_ERROR",
          });
        }

        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);
        const feature = await repo.getById(featureId);

        return reply.send(feature);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name/features/stats - Get feature statistics
   */
  fastify.get(
    "/api/projects/:name/features/stats",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);
        const stats = await repo.getStats();

        return reply.send(stats);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/features - Create a single feature
   */
  fastify.post(
    "/api/projects/:name/features",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Body: CreateFeatureBody;
      }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = createFeatureSchema.safeParse(request.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const body = parseResult.data;
        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);

        const createParams: {
          category: string;
          name: string;
          description: string;
          steps: string[];
          dependencies?: number[];
        } = {
          category: body.category,
          name: body.name,
          description: body.description,
          steps: body.steps,
        };
        if (body.dependencies !== undefined) {
          createParams.dependencies = body.dependencies;
        }

        const feature = await repo.create(createParams);

        logger.info("Feature created via API", {
          featureId: feature.id,
          projectName: request.params.name,
        });

        return reply.status(201).send(feature);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/features/bulk - Create features in bulk
   * Body: { features: Array<{ category, name, description, steps, depends_on_indices? }> }
   *
   * depends_on_indices uses 0-based array indices to reference features within the same batch,
   * allowing dependencies to be specified before IDs are known.
   */
  fastify.post(
    "/api/projects/:name/features/bulk",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Body: BulkCreateFeaturesBody;
      }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = bulkCreateFeaturesSchema.safeParse(request.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const body = parseResult.data;
        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);

        // Map features to repository format, filtering out undefined depends_on_indices
        const featuresToCreate = body.features.map((f) => ({
          category: f.category,
          name: f.name,
          description: f.description,
          steps: f.steps,
          ...(f.depends_on_indices !== undefined && { depends_on_indices: f.depends_on_indices }),
        }));

        const result = await repo.createBulk(featuresToCreate);

        logger.info("Features created in bulk via API", {
          created: result.created,
          withDependencies: result.withDependencies,
          projectName: request.params.name,
        });

        return reply.status(201).send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/features/:id/pass - Mark feature as passing
   * Sets passes=true and clears in_progress flag.
   * Returns the updated feature.
   */
  fastify.post(
    "/api/projects/:name/features/:id/pass",
    async (
      request: FastifyRequest<{ Params: { name: string; id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const featureId = parseInt(request.params.id, 10);
        if (isNaN(featureId)) {
          return reply.status(400).send({
            error: "Invalid feature ID",
            code: "VALIDATION_ERROR",
          });
        }

        const projectPath = await getProjectPath(request.params.name);
        const repo = getFeatureRepository(projectPath);
        const feature = await repo.markPassing(featureId);

        logger.info("Feature marked as passing via API", {
          featureId: feature.id,
          projectName: request.params.name,
        });

        return reply.send(feature);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
