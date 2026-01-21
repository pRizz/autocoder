/**
 * Projects API routes
 *
 * Handles CRUD operations for projects via REST API.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  ProjectRepository,
  getDatabase,
  initializeTables,
  logger,
  ProjectNotFoundError,
  ValidationError,
  isOpenAutocoderError,
} from "@open-autocoder/core";
import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Zod schemas for request validation
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  path: z.string().min(1),
  model: z.string().optional(),
  provider: z.string().optional(),
  concurrency: z.number().int().min(1).max(5).optional(),
  yoloMode: z.boolean().optional(),
  testingAgentRatio: z.number().int().min(0).max(3).optional(),
});

const updateProjectSchema = z.object({
  model: z.string().optional(),
  provider: z.string().optional(),
  concurrency: z.number().int().min(1).max(5).optional(),
  yoloMode: z.boolean().optional(),
  testingAgentRatio: z.number().int().min(0).max(3).optional(),
});

type CreateProjectBody = z.infer<typeof createProjectSchema>;
type UpdateProjectBody = z.infer<typeof updateProjectSchema>;

// Get registry database path
function getRegistryDbPath(): string {
  const homeDir = homedir();
  const registryDir = join(homeDir, ".open-autocoder");

  // Ensure directory exists
  if (!existsSync(registryDir)) {
    mkdirSync(registryDir, { recursive: true });
  }

  return join(registryDir, "registry.db");
}

// Lazy-loaded project repository
let projectRepo: ProjectRepository | null = null;

function getProjectRepository(): ProjectRepository {
  if (!projectRepo) {
    const dbPath = getRegistryDbPath();
    const db = getDatabase(dbPath);
    initializeTables(db);
    projectRepo = new ProjectRepository(db);
  }
  return projectRepo;
}

/**
 * Handle errors and return appropriate HTTP responses
 */
function handleError(
  error: unknown,
  reply: FastifyReply
): FastifyReply {
  if (error instanceof ProjectNotFoundError) {
    return reply.status(404).send({
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
  logger.error("Unexpected error in projects API", { error: message });
  return reply.status(500).send({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

/**
 * Get the file path for a project by name
 */
export async function getProjectPath(projectName: string): Promise<string> {
  const repo = getProjectRepository();
  const project = await repo.getByName(projectName);
  return project.path;
}

/**
 * Check if a project exists by name
 * Returns true if project exists, false otherwise
 */
export async function projectExists(projectName: string): Promise<boolean> {
  try {
    const repo = getProjectRepository();
    await repo.getByName(projectName);
    return true;
  } catch (error) {
    if (error instanceof ProjectNotFoundError) {
      return false;
    }
    throw error;
  }
}

/**
 * Register all project routes on the Fastify instance
 */
export async function registerProjectRoutes(
  fastify: FastifyInstance
): Promise<void> {
  /**
   * GET /api/projects - List all projects
   */
  fastify.get("/api/projects", async (_request, reply) => {
    try {
      const repo = getProjectRepository();
      const projects = await repo.list();
      return reply.send(projects);
    } catch (error) {
      return handleError(error, reply);
    }
  });

  /**
   * POST /api/projects - Create a new project
   */
  fastify.post(
    "/api/projects",
    async (
      request: FastifyRequest<{ Body: CreateProjectBody }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = createProjectSchema.safeParse(request.body);
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
        const repo = getProjectRepository();

        // Build create data, only including defined optional fields
        const createData: {
          name: string;
          path: string;
          model?: string;
          provider?: string;
          concurrency?: number;
          yoloMode?: boolean;
          testingAgentRatio?: number;
        } = {
          name: body.name,
          path: body.path,
        };

        if (body.model !== undefined) createData.model = body.model;
        if (body.provider !== undefined) createData.provider = body.provider;
        if (body.concurrency !== undefined) createData.concurrency = body.concurrency;
        if (body.yoloMode !== undefined) createData.yoloMode = body.yoloMode;
        if (body.testingAgentRatio !== undefined) createData.testingAgentRatio = body.testingAgentRatio;

        const project = await repo.create(createData);

        logger.info("Project created via API", { projectName: project.name });
        return reply.status(201).send(project);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name - Get project by name
   */
  fastify.get(
    "/api/projects/:name",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProjectRepository();
        const project = await repo.getByName(request.params.name);
        return reply.send(project);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * PUT /api/projects/:name - Update project settings
   */
  fastify.put(
    "/api/projects/:name",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Body: UpdateProjectBody;
      }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = updateProjectSchema.safeParse(request.body);
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
        const repo = getProjectRepository();

        // Build update data, only including defined optional fields
        const updateData: {
          model?: string;
          provider?: string;
          concurrency?: number;
          yoloMode?: boolean;
          testingAgentRatio?: number;
        } = {};

        if (body.model !== undefined) updateData.model = body.model;
        if (body.provider !== undefined) updateData.provider = body.provider;
        if (body.concurrency !== undefined) updateData.concurrency = body.concurrency;
        if (body.yoloMode !== undefined) updateData.yoloMode = body.yoloMode;
        if (body.testingAgentRatio !== undefined) updateData.testingAgentRatio = body.testingAgentRatio;

        const project = await repo.update(request.params.name, updateData);

        logger.info("Project updated via API", { projectName: project.name });
        return reply.send(project);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * DELETE /api/projects/:name - Delete a project
   */
  fastify.delete(
    "/api/projects/:name",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProjectRepository();
        await repo.delete(request.params.name);

        logger.info("Project deleted via API", {
          projectName: request.params.name,
        });
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name/stats - Get project statistics
   */
  fastify.get(
    "/api/projects/:name/stats",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProjectRepository();
        // Ensure project exists
        await repo.getByName(request.params.name);

        // For now, return basic stats (can be extended later)
        return reply.send({
          projectName: request.params.name,
          featuresComplete: 0,
          featuresTotal: 0,
          completionPercentage: 0,
          timeSpentMinutes: 0,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
