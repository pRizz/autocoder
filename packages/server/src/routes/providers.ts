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

  /**
   * DELETE /api/providers/:id - Delete a provider
   *
   * Permanently removes a provider from the database.
   */
  fastify.delete(
    "/api/providers/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProviderRepository();
        await repo.delete(request.params.id);
        logger.info("Provider deleted via API", { providerId: request.params.id });
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/providers/:id/test - Test provider connection
   *
   * Tests the provider's API key by making a simple API call.
   * Returns actionable error messages for different failure types.
   */
  fastify.post(
    "/api/providers/:id/test",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const repo = getProviderRepository();
        const provider = await repo.getById(request.params.id);

        if (!provider.apiKeyEncrypted) {
          return reply.status(400).send({
            success: false,
            error: "No API key configured for this provider",
            code: "MISSING_API_KEY",
            suggestedAction: "Add an API key to the provider configuration",
          });
        }

        // Decrypt the API key for testing
        let apiKey: string;
        try {
          apiKey = decryptApiKey(provider.apiKeyEncrypted);
        } catch {
          return reply.status(400).send({
            success: false,
            error: "Failed to decrypt API key",
            code: "DECRYPTION_FAILED",
            suggestedAction: "Re-enter the API key in provider settings",
          });
        }

        // Test the connection based on provider type
        const testResult = await testProviderConnection(
          provider.id,
          apiKey,
          provider.baseUrl ?? undefined
        );

        if (testResult.success) {
          logger.info("Provider connection test passed", { providerId: provider.id });
          return reply.send({
            success: true,
            message: testResult.message,
            model: testResult.model,
          });
        } else {
          logger.warn("Provider connection test failed", {
            providerId: provider.id,
            error: testResult.error,
          });
          return reply.status(400).send({
            success: false,
            error: testResult.error,
            code: testResult.code,
            suggestedAction: testResult.suggestedAction,
          });
        }
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}

/**
 * Test connection result interface
 */
interface TestConnectionResult {
  success: boolean;
  message?: string;
  model?: string | undefined;
  error?: string;
  code?: string;
  suggestedAction?: string;
}

/**
 * Test a provider connection by making a simple API call
 *
 * Currently supports:
 * - OpenAI (and compatible APIs like OpenRouter)
 * - Anthropic
 *
 * Returns actionable error messages for common issues.
 */
async function testProviderConnection(
  providerId: string,
  apiKey: string,
  baseUrl?: string
): Promise<TestConnectionResult> {
  const providerLower = providerId.toLowerCase();

  try {
    // Determine the API to test based on provider ID
    if (providerLower === "openai" || providerLower.includes("openai")) {
      return await testOpenAIConnection(apiKey, baseUrl);
    } else if (providerLower === "anthropic" || providerLower.includes("anthropic") || providerLower.includes("claude")) {
      return await testAnthropicConnection(apiKey, baseUrl);
    } else if (providerLower.includes("openrouter")) {
      return await testOpenRouterConnection(apiKey, baseUrl);
    } else if (providerLower.includes("gemini") || providerLower.includes("google")) {
      return await testGeminiConnection(apiKey, baseUrl);
    } else {
      // Default to OpenAI-compatible API test
      return await testOpenAIConnection(apiKey, baseUrl);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Connection failed: ${message}`,
      code: "CONNECTION_ERROR",
      suggestedAction: "Check your internet connection and try again",
    };
  }
}

/**
 * Test OpenAI API connection
 */
async function testOpenAIConnection(
  apiKey: string,
  baseUrl?: string
): Promise<TestConnectionResult> {
  const endpoint = baseUrl || "https://api.openai.com/v1";
  const url = `${endpoint.replace(/\/$/, "")}/models`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { data?: Array<{ id?: string }> };
      const modelCount = data.data?.length ?? 0;
      return {
        success: true,
        message: `Connection successful! Found ${modelCount} available models.`,
        model: data.data?.[0]?.id,
      };
    }

    // Handle specific error codes
    const status = response.status;
    const errorBody = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    const errorMessage = errorBody.error?.message || response.statusText;

    if (status === 401) {
      return {
        success: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
        suggestedAction: "Verify your API key is correct. Check for typos or extra spaces. You can find your API key at https://platform.openai.com/api-keys",
      };
    }

    if (status === 403) {
      return {
        success: false,
        error: "Access forbidden",
        code: "ACCESS_FORBIDDEN",
        suggestedAction: "Your API key doesn't have permission to access this resource. Check that your OpenAI account is active and has billing set up.",
      };
    }

    if (status === 429) {
      return {
        success: false,
        error: "Rate limited",
        code: "RATE_LIMITED",
        suggestedAction: "You've exceeded the rate limit. Wait a few minutes and try again. Check your usage at https://platform.openai.com/usage",
      };
    }

    if (status === 500 || status === 502 || status === 503) {
      return {
        success: false,
        error: "OpenAI service unavailable",
        code: "SERVICE_UNAVAILABLE",
        suggestedAction: "OpenAI's API is experiencing issues. Check https://status.openai.com for updates and try again later.",
      };
    }

    return {
      success: false,
      error: errorMessage,
      code: `HTTP_${status}`,
      suggestedAction: "Check the error message above and verify your provider configuration.",
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error - unable to reach OpenAI API",
        code: "NETWORK_ERROR",
        suggestedAction: "Check your internet connection. If using a proxy or VPN, ensure it's configured correctly.",
      };
    }
    throw error;
  }
}

/**
 * Test Anthropic API connection
 */
async function testAnthropicConnection(
  apiKey: string,
  baseUrl?: string
): Promise<TestConnectionResult> {
  const endpoint = baseUrl || "https://api.anthropic.com/v1";
  const url = `${endpoint.replace(/\/$/, "")}/messages`;

  try {
    // Anthropic requires a POST to /messages - use a minimal request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "test" }],
      }),
    });

    // A successful request (200) or "insufficient credits" (402) means the key is valid
    if (response.ok || response.status === 402) {
      return {
        success: true,
        message: "Connection successful! API key is valid.",
        model: "claude-3-haiku-20240307",
      };
    }

    const status = response.status;
    const errorBody = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    const errorMessage = errorBody.error?.message || response.statusText;

    if (status === 401) {
      return {
        success: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
        suggestedAction: "Verify your API key is correct. Check for typos or extra spaces. You can find your API key at https://console.anthropic.com/settings/keys",
      };
    }

    if (status === 403) {
      return {
        success: false,
        error: "Access forbidden",
        code: "ACCESS_FORBIDDEN",
        suggestedAction: "Your API key doesn't have permission. Check that your Anthropic account is active and verified.",
      };
    }

    if (status === 429) {
      return {
        success: false,
        error: "Rate limited",
        code: "RATE_LIMITED",
        suggestedAction: "You've exceeded the rate limit. Wait a few minutes and try again.",
      };
    }

    if (status === 529) {
      return {
        success: false,
        error: "Anthropic API overloaded",
        code: "API_OVERLOADED",
        suggestedAction: "Anthropic's API is currently overloaded. Try again in a few minutes.",
      };
    }

    return {
      success: false,
      error: errorMessage,
      code: `HTTP_${status}`,
      suggestedAction: "Check the error message above and verify your provider configuration.",
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error - unable to reach Anthropic API",
        code: "NETWORK_ERROR",
        suggestedAction: "Check your internet connection. If using a proxy or VPN, ensure it's configured correctly.",
      };
    }
    throw error;
  }
}

/**
 * Test OpenRouter API connection
 */
async function testOpenRouterConnection(
  apiKey: string,
  baseUrl?: string
): Promise<TestConnectionResult> {
  const endpoint = baseUrl || "https://openrouter.ai/api/v1";
  const url = `${endpoint.replace(/\/$/, "")}/models`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { data?: Array<{ id?: string }> };
      const modelCount = data.data?.length ?? 0;
      return {
        success: true,
        message: `Connection successful! Found ${modelCount} available models.`,
        model: data.data?.[0]?.id,
      };
    }

    const status = response.status;

    if (status === 401) {
      return {
        success: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
        suggestedAction: "Verify your OpenRouter API key is correct. You can find it at https://openrouter.ai/keys",
      };
    }

    return {
      success: false,
      error: `HTTP ${status}: ${response.statusText}`,
      code: `HTTP_${status}`,
      suggestedAction: "Check your OpenRouter account and API key configuration.",
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error - unable to reach OpenRouter API",
        code: "NETWORK_ERROR",
        suggestedAction: "Check your internet connection.",
      };
    }
    throw error;
  }
}

/**
 * Test Google Gemini API connection
 */
async function testGeminiConnection(
  apiKey: string,
  baseUrl?: string
): Promise<TestConnectionResult> {
  const endpoint = baseUrl || "https://generativelanguage.googleapis.com/v1beta";
  const url = `${endpoint.replace(/\/$/, "")}/models?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { models?: Array<{ name?: string }> };
      const modelCount = data.models?.length ?? 0;
      return {
        success: true,
        message: `Connection successful! Found ${modelCount} available models.`,
        model: data.models?.[0]?.name,
      };
    }

    const status = response.status;

    if (status === 400 || status === 403) {
      return {
        success: false,
        error: "Invalid API key",
        code: "INVALID_API_KEY",
        suggestedAction: "Verify your Google API key is correct. You can create one at https://aistudio.google.com/app/apikey",
      };
    }

    return {
      success: false,
      error: `HTTP ${status}: ${response.statusText}`,
      code: `HTTP_${status}`,
      suggestedAction: "Check your Google Cloud project and API key configuration.",
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error - unable to reach Google API",
        code: "NETWORK_ERROR",
        suggestedAction: "Check your internet connection.",
      };
    }
    throw error;
  }
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
