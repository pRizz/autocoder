/**
 * Feature repository - handles all feature database operations
 */

import { eq, and, asc, sql, like } from "drizzle-orm";
import type { DatabaseConnection } from "../db/connection.js";
import { features, type Feature } from "../db/schema.js";
import {
  FeatureNotFoundError,
  FeatureAlreadyClaimedError,
  ValidationError,
} from "../errors/index.js";
import type { FeatureStats, DependencyGraph, FeatureStatus } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { createBackup, type BackupResult } from "../utils/backup.js";

const MAX_DEPENDENCIES = 20;

export class FeatureRepository {
  private readonly maybeDbPath: string | undefined;

  constructor(db: DatabaseConnection, dbPath?: string) {
    this.db = db;
    this.maybeDbPath = dbPath;
  }

  private readonly db: DatabaseConnection;

  /**
   * Create a backup before a destructive operation
   * Only creates a backup if dbPath was provided during construction
   *
   * @param operation - Description of the operation being performed
   * @returns Backup result if backup was created, undefined otherwise
   */
  private createBackupIfPossible(operation: string): BackupResult | undefined {
    if (!this.maybeDbPath) {
      logger.warn("Cannot create backup: dbPath not provided to FeatureRepository", { operation });
      return undefined;
    }

    try {
      return createBackup(this.maybeDbPath, operation);
    } catch (error) {
      // Log the warning but don't block the operation
      const message = error instanceof Error ? error.message : String(error);
      logger.warn("Failed to create backup before operation", {
        operation,
        error: message,
      });
      return undefined;
    }
  }

  /**
   * Create a single feature
   */
  async create(input: {
    category: string;
    name: string;
    description: string;
    steps: string[];
    dependencies?: number[];
  }): Promise<Feature> {
    // Validate dependency limit
    if (input.dependencies && input.dependencies.length > MAX_DEPENDENCIES) {
      throw new ValidationError(
        `Feature has ${input.dependencies.length} dependencies, max is ${MAX_DEPENDENCIES}`
      );
    }

    const now = new Date().toISOString();

    // Get max priority
    const maxPriorityResult = this.db
      .select({ maxPriority: sql<number>`MAX(priority)` })
      .from(features)
      .get();

    const priority = (maxPriorityResult?.maxPriority ?? 0) + 1;

    const result = this.db
      .insert(features)
      .values({
        priority,
        category: input.category,
        name: input.name,
        description: input.description,
        steps: JSON.stringify(input.steps),
        dependencies: input.dependencies
          ? JSON.stringify(input.dependencies)
          : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    logger.info("Feature created", { featureId: result.id, name: result.name });
    return result;
  }

  /**
   * Create multiple features in bulk
   */
  async createBulk(
    inputs: Array<{
      category: string;
      name: string;
      description: string;
      steps: string[];
      depends_on_indices?: number[];
    }>
  ): Promise<{ created: number; withDependencies: number }> {
    const now = new Date().toISOString();

    // Get max priority
    const maxPriorityResult = this.db
      .select({ maxPriority: sql<number>`MAX(priority)` })
      .from(features)
      .get();

    let priority = (maxPriorityResult?.maxPriority ?? 0) + 1;

    // Validate dependency indices before any inserts
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]!;
      if (input.depends_on_indices) {
        for (const depIndex of input.depends_on_indices) {
          if (depIndex >= i) {
            throw new ValidationError(
              `Feature at index ${i} cannot depend on feature at index ${depIndex} (forward reference not allowed)`
            );
          }
          if (depIndex === i) {
            throw new ValidationError(
              `Feature at index ${i} cannot depend on itself`
            );
          }
        }
        if (input.depends_on_indices.length > MAX_DEPENDENCIES) {
          throw new ValidationError(
            `Feature at index ${i} has ${input.depends_on_indices.length} dependencies, max is ${MAX_DEPENDENCIES}`
          );
        }
      }
    }

    // Insert all features and collect their IDs
    const createdIds: number[] = [];
    let withDependencies = 0;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]!;

      // Resolve dependency indices to actual IDs
      let dependencies: number[] | null = null;
      if (input.depends_on_indices && input.depends_on_indices.length > 0) {
        dependencies = input.depends_on_indices.map((idx) => {
          const depId = createdIds[idx];
          if (depId === undefined) {
            throw new ValidationError(
              `Invalid dependency index ${idx} for feature at index ${i}`
            );
          }
          return depId;
        });
        withDependencies++;
      }

      const result = this.db
        .insert(features)
        .values({
          priority: priority++,
          category: input.category,
          name: input.name,
          description: input.description,
          steps: JSON.stringify(input.steps),
          dependencies: dependencies ? JSON.stringify(dependencies) : null,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
        .get();

      createdIds.push(result.id);
    }

    logger.info("Bulk features created", { count: inputs.length });
    return { created: inputs.length, withDependencies };
  }

  /**
   * Get a feature by ID
   */
  async getById(id: number): Promise<Feature> {
    const feature = this.db
      .select()
      .from(features)
      .where(eq(features.id, id))
      .get();

    if (!feature) {
      throw new FeatureNotFoundError(id);
    }

    return feature;
  }

  /**
   * List features with optional filtering
   */
  async list(options?: {
    passes?: boolean;
    inProgress?: boolean;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Feature[]> {
    let query = this.db.select().from(features);

    // Note: Drizzle's query builder requires careful chaining
    const conditions = [];

    if (options?.passes !== undefined) {
      conditions.push(eq(features.passes, options.passes ? 1 : 0));
    }
    if (options?.inProgress !== undefined) {
      conditions.push(eq(features.inProgress, options.inProgress ? 1 : 0));
    }
    if (options?.category) {
      conditions.push(eq(features.category, options.category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    query = query.orderBy(asc(features.priority)) as typeof query;

    if (options?.limit) {
      query = query.limit(options.limit) as typeof query;
    }
    if (options?.offset) {
      query = query.offset(options.offset) as typeof query;
    }

    return query.all();
  }

  /**
   * Count features with optional filtering (for pagination)
   * Same filters as list() but returns count instead of features
   */
  async count(options?: {
    passes?: boolean;
    inProgress?: boolean;
    category?: string;
  }): Promise<number> {
    const conditions = [];

    if (options?.passes !== undefined) {
      conditions.push(eq(features.passes, options.passes ? 1 : 0));
    }
    if (options?.inProgress !== undefined) {
      conditions.push(eq(features.inProgress, options.inProgress ? 1 : 0));
    }
    if (options?.category) {
      conditions.push(eq(features.category, options.category));
    }

    let query = this.db.select({ count: sql<number>`count(*)` }).from(features);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = query.get();
    return result?.count ?? 0;
  }

  /**
   * Search features by name (case-insensitive)
   */
  async search(query: string, options?: {
    passes?: boolean;
    inProgress?: boolean;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Feature[]> {
    // Use SQLite LIKE with % wildcards for case-insensitive search
    // Note: SQLite LIKE is case-insensitive for ASCII by default
    const searchPattern = `%${query}%`;

    let dbQuery = this.db.select().from(features);

    const conditions = [
      like(features.name, searchPattern),
    ];

    if (options?.passes !== undefined) {
      conditions.push(eq(features.passes, options.passes ? 1 : 0));
    }
    if (options?.inProgress !== undefined) {
      conditions.push(eq(features.inProgress, options.inProgress ? 1 : 0));
    }
    if (options?.category) {
      conditions.push(eq(features.category, options.category));
    }

    dbQuery = dbQuery.where(and(...conditions)) as typeof dbQuery;
    dbQuery = dbQuery.orderBy(asc(features.priority)) as typeof dbQuery;

    if (options?.limit) {
      dbQuery = dbQuery.limit(options.limit) as typeof dbQuery;
    }
    if (options?.offset) {
      dbQuery = dbQuery.offset(options.offset) as typeof dbQuery;
    }

    return dbQuery.all();
  }

  /**
   * Mark a feature as passing
   */
  async markPassing(id: number): Promise<Feature> {
    const now = new Date().toISOString();

    const result = this.db
      .update(features)
      .set({ passes: 1, inProgress: 0, updatedAt: now })
      .where(eq(features.id, id))
      .returning()
      .get();

    if (!result) {
      throw new FeatureNotFoundError(id);
    }

    logger.info("Feature marked as passing", { featureId: id });
    return result;
  }

  /**
   * Mark a feature as failing
   */
  async markFailing(id: number): Promise<Feature> {
    const now = new Date().toISOString();

    const result = this.db
      .update(features)
      .set({ passes: 0, inProgress: 0, updatedAt: now })
      .where(eq(features.id, id))
      .returning()
      .get();

    if (!result) {
      throw new FeatureNotFoundError(id);
    }

    logger.info("Feature marked as failing", { featureId: id });
    return result;
  }

  /**
   * Atomically claim a feature (mark in_progress)
   */
  async claim(id: number): Promise<Feature> {
    const now = new Date().toISOString();

    // Check if already claimed
    const existing = await this.getById(id);
    if (existing.inProgress === 1) {
      throw new FeatureAlreadyClaimedError(id);
    }

    const result = this.db
      .update(features)
      .set({ inProgress: 1, updatedAt: now })
      .where(and(eq(features.id, id), eq(features.inProgress, 0)))
      .returning()
      .get();

    if (!result) {
      throw new FeatureAlreadyClaimedError(id);
    }

    logger.info("Feature claimed", { featureId: id });
    return result;
  }

  /**
   * Clear in_progress status from a feature
   */
  async clearInProgress(id: number): Promise<Feature> {
    const now = new Date().toISOString();

    const result = this.db
      .update(features)
      .set({ inProgress: 0, updatedAt: now })
      .where(eq(features.id, id))
      .returning()
      .get();

    if (!result) {
      throw new FeatureNotFoundError(id);
    }

    logger.info("Feature in_progress cleared", { featureId: id });
    return result;
  }

  /**
   * Skip a feature (move to end of priority queue)
   * Also clears dependencies so the feature becomes a regular pending feature
   */
  async skip(id: number): Promise<Feature> {
    const now = new Date().toISOString();

    // Get max priority
    const maxPriorityResult = this.db
      .select({ maxPriority: sql<number>`MAX(priority)` })
      .from(features)
      .get();

    const newPriority = (maxPriorityResult?.maxPriority ?? 0) + 1;

    // Clear dependencies so the feature is no longer blocked
    const result = this.db
      .update(features)
      .set({
        priority: newPriority,
        inProgress: 0,
        dependencies: null,
        updatedAt: now,
      })
      .where(eq(features.id, id))
      .returning()
      .get();

    if (!result) {
      throw new FeatureNotFoundError(id);
    }

    logger.info("Feature skipped", {
      featureId: id,
      newPriority,
      dependenciesCleared: true,
    });
    return result;
  }

  /**
   * Get the next feature ready to be worked on
   */
  async getNext(): Promise<Feature | null> {
    // Get all pending features
    const pending = this.db
      .select()
      .from(features)
      .where(and(eq(features.passes, 0), eq(features.inProgress, 0)))
      .orderBy(asc(features.priority))
      .all();

    // For each pending feature, check if dependencies are satisfied
    for (const feature of pending) {
      if (await this.areDependenciesSatisfied(feature)) {
        return feature;
      }
    }

    return null;
  }

  /**
   * Get all features ready to start (dependencies satisfied, not in progress)
   */
  async getReady(limit: number = 10): Promise<Feature[]> {
    const pending = this.db
      .select()
      .from(features)
      .where(and(eq(features.passes, 0), eq(features.inProgress, 0)))
      .orderBy(asc(features.priority))
      .all();

    const ready: Feature[] = [];
    for (const feature of pending) {
      if (await this.areDependenciesSatisfied(feature)) {
        ready.push(feature);
        if (ready.length >= limit) {
          break;
        }
      }
    }

    return ready;
  }

  /**
   * Get features blocked by unmet dependencies
   */
  async getBlocked(): Promise<Array<Feature & { blockedBy: number[] }>> {
    const pending = this.db
      .select()
      .from(features)
      .where(and(eq(features.passes, 0), eq(features.inProgress, 0)))
      .all();

    const blocked: Array<Feature & { blockedBy: number[] }> = [];

    for (const feature of pending) {
      const deps = this.parseDependencies(feature.dependencies);
      if (deps.length === 0) continue;

      const blockedBy: number[] = [];
      for (const depId of deps) {
        const dep = this.db
          .select()
          .from(features)
          .where(eq(features.id, depId))
          .get();

        if (!dep || dep.passes !== 1) {
          blockedBy.push(depId);
        }
      }

      if (blockedBy.length > 0) {
        blocked.push({ ...feature, blockedBy });
      }
    }

    return blocked;
  }

  /**
   * Get random passing features for regression testing
   */
  async getForRegression(limit: number = 3): Promise<Feature[]> {
    // Get passing features not in progress
    const passing = this.db
      .select()
      .from(features)
      .where(and(eq(features.passes, 1), eq(features.inProgress, 0)))
      .all();

    // Shuffle and take limit
    const shuffled = passing.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  /**
   * Get feature statistics
   */
  async getStats(): Promise<FeatureStats> {
    const all = this.db.select().from(features).all();

    const passing = all.filter((f) => f.passes === 1).length;
    const inProgress = all.filter((f) => f.inProgress === 1).length;
    const total = all.length;
    const percentage = total > 0 ? (passing / total) * 100 : 0;

    return { passing, inProgress, total, percentage };
  }

  /**
   * Get dependency graph for visualization
   */
  async getGraph(): Promise<DependencyGraph> {
    const all = this.db.select().from(features).all();

    const nodes = all.map((f) => ({
      id: f.id,
      name: f.name,
      status: this.getFeatureStatus(f),
    }));

    const edges: Array<{ source: number; target: number }> = [];
    for (const feature of all) {
      const deps = this.parseDependencies(feature.dependencies);
      for (const depId of deps) {
        edges.push({ source: depId, target: feature.id });
      }
    }

    return { nodes, edges };
  }

  /**
   * Delete a feature by ID
   * Creates a backup before deletion for recovery purposes
   */
  async delete(id: number): Promise<void> {
    // Verify feature exists first (throws if not found)
    await this.getById(id);

    // Create backup before destructive operation
    this.createBackupIfPossible(`delete feature ${id}`);

    const result = this.db
      .delete(features)
      .where(eq(features.id, id))
      .returning()
      .get();

    if (!result) {
      throw new FeatureNotFoundError(id);
    }

    // Clean up orphaned dependencies
    await this.cleanupOrphanedDependencies(id);

    logger.info("Feature deleted", { featureId: id });
  }

  /**
   * Delete all features in the database
   * Used when deleting a project to cascade the deletion to all its features
   * Creates a backup before deletion for recovery purposes
   * Returns the number of features deleted
   */
  async deleteAll(): Promise<number> {
    const count = this.db.select().from(features).all().length;

    if (count > 0) {
      // Create backup before destructive operation
      this.createBackupIfPossible(`delete all features (${count} features)`);
    }

    this.db.delete(features).run();

    logger.info("All features deleted", { count });
    return count;
  }

  /**
   * Clear in_progress status from ALL features
   * Used when stopping the orchestrator to release all claimed features
   * Returns the number of features that had in_progress cleared
   */
  async clearAllInProgress(): Promise<number> {
    const now = new Date().toISOString();

    // Count features that are currently in progress
    const inProgressFeatures = this.db
      .select()
      .from(features)
      .where(eq(features.inProgress, 1))
      .all();

    const count = inProgressFeatures.length;

    if (count > 0) {
      // Clear in_progress for all features that have it set
      this.db
        .update(features)
        .set({ inProgress: 0, updatedAt: now })
        .where(eq(features.inProgress, 1))
        .run();

      logger.info("All in_progress flags cleared", {
        clearedCount: count,
        featureIds: inProgressFeatures.map((f) => f.id),
      });
    }

    return count;
  }

  // Private helper methods

  private parseDependencies(deps: string | null): number[] {
    if (!deps) return [];
    try {
      return JSON.parse(deps) as number[];
    } catch {
      return [];
    }
  }

  private async areDependenciesSatisfied(feature: Feature): Promise<boolean> {
    const deps = this.parseDependencies(feature.dependencies);
    if (deps.length === 0) return true;

    for (const depId of deps) {
      const dep = this.db
        .select()
        .from(features)
        .where(eq(features.id, depId))
        .get();

      // If dependency doesn't exist (orphaned), treat as satisfied
      if (!dep) continue;

      // If dependency is not passing, feature is not ready
      if (dep.passes !== 1) {
        return false;
      }
    }

    return true;
  }

  private getFeatureStatus(feature: Feature): FeatureStatus {
    if (feature.passes === 1) return "passing";
    if (feature.inProgress === 1) return "in_progress";
    return "pending";
  }

  private async cleanupOrphanedDependencies(deletedId: number): Promise<void> {
    // Get all features that might have this as a dependency
    const all = this.db.select().from(features).all();

    for (const feature of all) {
      const deps = this.parseDependencies(feature.dependencies);
      if (deps.includes(deletedId)) {
        const newDeps = deps.filter((d) => d !== deletedId);
        this.db
          .update(features)
          .set({
            dependencies: newDeps.length > 0 ? JSON.stringify(newDeps) : null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(features.id, feature.id))
          .run();
      }
    }
  }
}
