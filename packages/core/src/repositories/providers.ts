/**
 * Provider repository - handles AI provider database operations
 */

import { eq } from "drizzle-orm";
import type { DatabaseConnection } from "../db/connection.js";
import { providers, type Provider, type NewProvider } from "../db/schema.js";
import { ValidationError, OpenAutocoderError } from "../errors/index.js";
import { logger } from "../utils/logger.js";

export class ProviderNotFoundError extends OpenAutocoderError {
  public readonly providerId: string;

  constructor(providerId: string) {
    super(`Provider '${providerId}' not found`, "PROVIDER_NOT_FOUND", {
      suggestedAction: "Verify the provider ID or add a new provider",
    });
    this.name = "ProviderNotFoundError";
    this.providerId = providerId;
  }
}

export class ProviderRepository {
  constructor(private readonly db: DatabaseConnection) {}

  /**
   * Create a new provider
   */
  async create(input: {
    id: string;
    name: string;
    apiKeyEncrypted: string;
    baseUrl?: string;
    isDefault?: boolean;
  }): Promise<Provider> {
    const now = new Date().toISOString();

    // Check for duplicate ID
    const existing = this.db
      .select()
      .from(providers)
      .where(eq(providers.id, input.id))
      .get();

    if (existing) {
      throw new ValidationError(`Provider with ID '${input.id}' already exists`);
    }

    // If this is set as default, clear other defaults
    if (input.isDefault) {
      this.db
        .update(providers)
        .set({ isDefault: 0, updatedAt: now })
        .run();
    }

    const result = this.db
      .insert(providers)
      .values({
        id: input.id,
        name: input.name,
        apiKeyEncrypted: input.apiKeyEncrypted,
        baseUrl: input.baseUrl ?? null,
        isDefault: input.isDefault ? 1 : 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    logger.info("Provider created", { providerId: result.id });
    return result;
  }

  /**
   * Get a provider by ID
   */
  async getById(id: string): Promise<Provider> {
    const provider = this.db
      .select()
      .from(providers)
      .where(eq(providers.id, id))
      .get();

    if (!provider) {
      throw new ProviderNotFoundError(id);
    }

    return provider;
  }

  /**
   * List all providers
   */
  async list(): Promise<Provider[]> {
    return this.db.select().from(providers).all();
  }

  /**
   * Get the default provider
   */
  async getDefault(): Promise<Provider | null> {
    const provider = this.db
      .select()
      .from(providers)
      .where(eq(providers.isDefault, 1))
      .get();

    return provider ?? null;
  }

  /**
   * Update a provider
   */
  async update(
    id: string,
    input: {
      name?: string;
      apiKeyEncrypted?: string;
      baseUrl?: string;
      isDefault?: boolean;
    }
  ): Promise<Provider> {
    const now = new Date().toISOString();

    // Ensure provider exists
    await this.getById(id);

    // If setting as default, clear other defaults
    if (input.isDefault) {
      this.db
        .update(providers)
        .set({ isDefault: 0, updatedAt: now })
        .run();
    }

    const updateData: Partial<NewProvider> = {
      updatedAt: now,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.apiKeyEncrypted !== undefined) {
      updateData.apiKeyEncrypted = input.apiKeyEncrypted;
    }
    if (input.baseUrl !== undefined) {
      updateData.baseUrl = input.baseUrl;
    }
    if (input.isDefault !== undefined) {
      updateData.isDefault = input.isDefault ? 1 : 0;
    }

    const result = this.db
      .update(providers)
      .set(updateData)
      .where(eq(providers.id, id))
      .returning()
      .get();

    if (!result) {
      throw new ProviderNotFoundError(id);
    }

    logger.info("Provider updated", { providerId: id });
    return result;
  }

  /**
   * Delete a provider
   */
  async delete(id: string): Promise<void> {
    const result = this.db
      .delete(providers)
      .where(eq(providers.id, id))
      .returning()
      .get();

    if (!result) {
      throw new ProviderNotFoundError(id);
    }

    logger.info("Provider deleted", { providerId: id });
  }

  /**
   * Get provider with masked API key (for listing)
   */
  async listWithMaskedKeys(): Promise<Array<Omit<Provider, "apiKeyEncrypted"> & { apiKeyMasked: string }>> {
    const allProviders = await this.list();

    return allProviders.map((p) => {
      const { apiKeyEncrypted, ...rest } = p;
      return {
        ...rest,
        apiKeyMasked: apiKeyEncrypted ? this.maskApiKey(apiKeyEncrypted) : "",
      };
    });
  }

  private maskApiKey(key: string): string {
    if (key.length <= 8) {
      return "***";
    }
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }
}
