/**
 * Authentication API routes
 *
 * Handles user authentication via REST API.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  UserRepository,
  getDatabase,
  initializeTables,
  logger,
  UserNotFoundError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  ValidationError,
  isOpenAutocoderError,
} from "@open-autocoder/core";
import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Zod schemas for request validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email().optional(),
});

type LoginBody = z.infer<typeof loginSchema>;
type RegisterBody = z.infer<typeof registerSchema>;

// Get auth database path
function getAuthDbPath(): string {
  const homeDir = homedir();
  const registryDir = join(homeDir, ".open-autocoder");

  // Ensure directory exists
  if (!existsSync(registryDir)) {
    mkdirSync(registryDir, { recursive: true });
  }

  return join(registryDir, "registry.db");
}

// Lazy-loaded user repository
let userRepo: UserRepository | null = null;

function getUserRepository(): UserRepository {
  if (!userRepo) {
    const dbPath = getAuthDbPath();
    const db = getDatabase(dbPath);
    initializeTables(db);
    userRepo = new UserRepository(db);
  }
  return userRepo;
}

/**
 * Handle errors and return appropriate HTTP responses
 */
function handleError(error: unknown, reply: FastifyReply): FastifyReply {
  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof UserNotFoundError) {
    return reply.status(404).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof UserAlreadyExistsError) {
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
  logger.error("Unexpected error in auth API", { error: message });
  return reply.status(500).send({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

/**
 * Register all authentication routes on the Fastify instance
 */
export async function registerAuthRoutes(
  fastify: FastifyInstance
): Promise<void> {
  /**
   * POST /api/auth/login - User login
   *
   * Request body:
   *   - username: string (required)
   *   - password: string (required)
   *
   * Response:
   *   - Success (200): { user: { id, username, email, role, createdAt, updatedAt }, token: string }
   *   - Invalid credentials (401): { error, code, suggestedAction }
   *   - Validation error (400): { error, code, suggestedAction }
   */
  fastify.post(
    "/api/auth/login",
    async (
      request: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = loginSchema.safeParse(request.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const { username, password } = parseResult.data;
        const repo = getUserRepository();

        // Attempt login
        const result = await repo.login(username, password);

        logger.info("User logged in via API", { username });
        return reply.send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/auth/register - User registration
   *
   * Request body:
   *   - username: string (required, 3-50 chars)
   *   - password: string (required, min 6 chars)
   *   - email: string (optional, valid email)
   *
   * Response:
   *   - Success (201): { id, username, email, role, createdAt, updatedAt }
   *   - User exists (409): { error, code, suggestedAction }
   *   - Validation error (400): { error, code, suggestedAction }
   */
  fastify.post(
    "/api/auth/register",
    async (
      request: FastifyRequest<{ Body: RegisterBody }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate request body
        const parseResult = registerSchema.safeParse(request.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const { username, password, email } = parseResult.data;
        const repo = getUserRepository();

        // Create user - only pass email if defined
        const createInput: { username: string; password: string; email?: string } = {
          username,
          password,
        };
        if (email !== undefined) {
          createInput.email = email;
        }
        const user = await repo.create(createInput);

        logger.info("User registered via API", { username });
        return reply.status(201).send(user);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/auth/me - Get current user (requires token in header)
   *
   * Headers:
   *   - Authorization: Bearer <token>
   *
   * Response:
   *   - Success (200): { id, username, email, role, createdAt, updatedAt }
   *   - Unauthorized (401): { error, code }
   *
   * Note: This is a placeholder. Token validation would require
   * a session/token store which is beyond the scope of this feature.
   */
  fastify.get("/api/auth/me", async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({
        error: "Authorization header required",
        code: "UNAUTHORIZED",
        suggestedAction: "Include 'Authorization: Bearer <token>' header",
      });
    }

    // For now, return a message indicating token validation is not implemented
    // In a full implementation, we would:
    // 1. Extract the token from the header
    // 2. Validate the token against a session store
    // 3. Return the associated user
    return reply.status(501).send({
      error: "Token validation not yet implemented",
      code: "NOT_IMPLEMENTED",
      suggestedAction: "Use login endpoint to authenticate",
    });
  });
}
