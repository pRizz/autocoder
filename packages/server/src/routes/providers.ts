/**
 * Providers API routes
 *
 * Handles CRUD operations for AI providers via REST API.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  ProviderRepository,
  getDatabase,
  initializeTables,
  logger,
  ProviderNotFoundError,
  isOpenAutocoderError,
} from "@open-autocoder/core";
import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

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

// Lazy-loaded provider repository
let providerRepo: ProviderRepository | null = null;

function getProviderRepository(): ProviderRepository {
  if (!providerRepo) {
    const dbPath = getRegistryDbPath();
    const db = getDatabase(dbPath);
    initializeTables(db);
    providerRepo = new ProviderRepository(db);
  }
  return providerRepo;
}

/**
 * Handle errors and return appropriate HTTP responses
 */
function handleError(error: unknown, reply: FastifyReply): FastifyReply {
  if (error instanceof ProviderNotFoundError) {
    return reply.status(404).send({
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
  logger.error("Unexpected error in providers API", { error: message });
  return reply.status(500).send({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

/**
 * Register all provider routes on the Fastify instance
 */
export async function registerProviderRoutes(
  fastify: FastifyInstance
): Promise<void> {
  /**
   * GET /api/providers - List all providers with masked API keys
   */
  fastify.get("/api/providers", async (_request, reply) => {
    try {
      const repo = getProviderRepository();
      const providers = await repo.listWithMaskedKeys();
      return reply.send(providers);
    } catch (error) {
      return handleError(error, reply);
    }
  });

  /**
   * GET /api/providers/:id - Get provider by ID with masked API key
   */
  fastify.get(
    "/api/providers/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProviderRepository();
        const provider = await repo.getById(request.params.id);

        // Mask the API key before returning
        const { apiKeyEncrypted, ...rest } = provider;
        const apiKeyMasked = apiKeyEncrypted
          ? maskApiKey(apiKeyEncrypted)
          : "";

        return reply.send({
          ...rest,
          apiKeyMasked,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}

/**
 * Mask an API key for display
 */
function maskApiKey(key: string): string {
  if (key.length <= 8) {
    return "***";
  }
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}
