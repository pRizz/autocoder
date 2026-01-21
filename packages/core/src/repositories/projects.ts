/**
 * Project repository - handles all project database operations
 */

import { eq } from "drizzle-orm";
import type { DatabaseConnection } from "../db/connection.js";
import { projects, sessions, type Project, type NewProject } from "../db/schema.js";
import { ProjectNotFoundError, ValidationError } from "../errors/index.js";
import { logger } from "../utils/logger.js";
import { createBackup, type BackupResult } from "../utils/backup.js";

export class ProjectRepository {
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
      logger.debug("Cannot create backup: dbPath not provided to ProjectRepository", { operation });
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
   * Create a new project
   */
  async create(input: {
    name: string;
    path: string;
    model?: string;
    provider?: string;
    concurrency?: number;
    yoloMode?: boolean;
    testingAgentRatio?: number;
  }): Promise<Project> {
    const now = new Date().toISOString();

    // Check for duplicate name
    const existing = this.db
      .select()
      .from(projects)
      .where(eq(projects.name, input.name))
      .get();

    if (existing) {
      throw new ValidationError(`Project with name '${input.name}' already exists`);
    }

    // Validate path doesn't contain traversal
    if (input.path.includes("..")) {
      throw new ValidationError("Project path cannot contain '..'");
    }

    const result = this.db
      .insert(projects)
      .values({
        name: input.name,
        path: input.path,
        model: input.model ?? null,
        provider: input.provider ?? null,
        concurrency: input.concurrency ?? 3,
        yoloMode: input.yoloMode ? 1 : 0,
        testingAgentRatio: input.testingAgentRatio ?? 1,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    logger.info("Project created", { projectName: result.name });
    return result;
  }

  /**
   * Get a project by name
   */
  async getByName(name: string): Promise<Project> {
    const project = this.db
      .select()
      .from(projects)
      .where(eq(projects.name, name))
      .get();

    if (!project) {
      throw new ProjectNotFoundError(name);
    }

    return project;
  }

  /**
   * List all projects
   */
  async list(): Promise<Project[]> {
    return this.db.select().from(projects).all();
  }

  /**
   * Update project settings
   */
  async update(
    name: string,
    input: {
      model?: string;
      provider?: string;
      concurrency?: number;
      yoloMode?: boolean;
      testingAgentRatio?: number;
    }
  ): Promise<Project> {
    const now = new Date().toISOString();

    // Ensure project exists
    await this.getByName(name);

    const updateData: Partial<NewProject> = {
      updatedAt: now,
    };

    if (input.model !== undefined) {
      updateData.model = input.model;
    }
    if (input.provider !== undefined) {
      updateData.provider = input.provider;
    }
    if (input.concurrency !== undefined) {
      updateData.concurrency = input.concurrency;
    }
    if (input.yoloMode !== undefined) {
      updateData.yoloMode = input.yoloMode ? 1 : 0;
    }
    if (input.testingAgentRatio !== undefined) {
      updateData.testingAgentRatio = input.testingAgentRatio;
    }

    const result = this.db
      .update(projects)
      .set(updateData)
      .where(eq(projects.name, name))
      .returning()
      .get();

    if (!result) {
      throw new ProjectNotFoundError(name);
    }

    logger.info("Project updated", { projectName: name });
    return result;
  }

  /**
   * Delete a project and its associated sessions
   * Creates a backup of the registry database before deletion for recovery purposes
   */
  async delete(name: string): Promise<void> {
    // Verify project exists first (throws if not found)
    await this.getByName(name);

    // Create backup of registry database before destructive operation
    this.createBackupIfPossible(`delete project '${name}'`);

    // First, delete associated sessions
    const deletedSessions = this.db
      .delete(sessions)
      .where(eq(sessions.projectName, name))
      .returning()
      .all();

    if (deletedSessions.length > 0) {
      logger.info("Project sessions deleted", {
        projectName: name,
        sessionCount: deletedSessions.length,
      });
    }

    // Then delete the project
    const result = this.db
      .delete(projects)
      .where(eq(projects.name, name))
      .returning()
      .get();

    if (!result) {
      throw new ProjectNotFoundError(name);
    }

    logger.info("Project deleted", { projectName: name });
  }
}
