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
  ValidationError,
  isOpenAutocoderError,
} from "@open-autocoder/core";
import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

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

// Encryption key - in production, use a proper key management system
const ENCRYPTION_KEY =
  process.env.OPEN_AUTOCODER_ENCRYPTION_KEY || "open-autocoder-default-key-32";
const ALGORITHM = "aes-256-gcm";

/**
 * Encrypt an API key for storage
 */
function encryptApiKey(apiKey: string): string {
  const key = scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Store iv + authTag + encrypted data as hex
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt an API key from storage
 * Exported for potential future use (testing provider connection)
 */
export function decryptApiKey(encryptedData: string): string {
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const ivHex = parts[0];
  const authTagHex = parts[1];
  const encrypted = parts[2];

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid encrypted data format: missing parts");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const key = scryptSync(ENCRYPTION_KEY, "salt", 32);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
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
   * POST /api/providers - Create a new AI provider
   *
   * Request body:
   *   - id: string (required) - Unique identifier (e.g., "openai", "anthropic")
   *   - name: string (required) - Display name
   *   - apiKey: string (required) - API key (will be encrypted)
   *   - baseUrl: string (optional) - Custom API endpoint
   *   - isDefault: boolean (optional) - Set as default provider
   */
  fastify.post(
    "/api/providers",
    async (
      request: FastifyRequest<{
        Body: {
          id: string;
          name: string;
          apiKey: string;
          baseUrl?: string;
          isDefault?: boolean;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { id, name, apiKey, baseUrl, isDefault } = request.body;

        // Validate required fields
        if (!id || typeof id !== "string" || id.trim() === "") {
          throw new ValidationError("Provider ID is required", "id");
        }
        if (!name || typeof name !== "string" || name.trim() === "") {
          throw new ValidationError("Provider name is required", "name");
        }
        if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
          throw new ValidationError("API key is required", "apiKey");
        }

        // Encrypt the API key before storing
        const apiKeyEncrypted = encryptApiKey(apiKey);

        const repo = getProviderRepository();
        const trimmedBaseUrl = baseUrl?.trim();
        const provider = await repo.create({
          id: id.trim(),
          name: name.trim(),
          apiKeyEncrypted,
          ...(trimmedBaseUrl ? { baseUrl: trimmedBaseUrl } : {}),
          isDefault: isDefault ?? false,
        });

        logger.info("Provider created via API", { providerId: provider.id });

        // Return the created provider with masked API key
        const { apiKeyEncrypted: _encrypted, ...rest } = provider;
        return reply.status(201).send({
          ...rest,
          apiKeyMasked: maskApiKey(apiKey),
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

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
