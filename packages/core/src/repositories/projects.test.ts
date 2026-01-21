/**
 * Tests for ProjectRepository
 *
 * Includes Feature #136: Sessions cleaned up on project delete
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";
import { ProjectRepository } from "./projects.js";
import { ProjectNotFoundError } from "../errors/index.js";

describe("ProjectRepository", () => {
  let db: ReturnType<typeof drizzle>;
  let sqlite: Database.Database;
  let repo: ProjectRepository;

  beforeEach(() => {
    // Create in-memory SQLite database for each test
    sqlite = new Database(":memory:");
    sqlite.pragma("journal_mode = WAL");

    // Create tables
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        name TEXT PRIMARY KEY,
        path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        model TEXT,
        provider TEXT,
        concurrency INTEGER DEFAULT 3,
        yolo_mode INTEGER DEFAULT 0,
        testing_agent_ratio INTEGER DEFAULT 1
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        agent_type TEXT NOT NULL,
        feature_id INTEGER,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        status TEXT NOT NULL,
        output_log TEXT
      )
    `);

    db = drizzle(sqlite, { schema });
    repo = new ProjectRepository(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  describe("create", () => {
    it("should create a project", async () => {
      const project = await repo.create({
        name: "test-project",
        path: "/tmp/test",
      });

      expect(project.name).toBe("test-project");
      expect(project.path).toBe("/tmp/test");
      expect(project.concurrency).toBe(3);
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      await repo.create({
        name: "test-project",
        path: "/tmp/test",
      });

      await repo.delete("test-project");

      await expect(repo.getByName("test-project")).rejects.toThrow(
        ProjectNotFoundError
      );
    });

    it("should delete associated sessions when project is deleted (Feature #136)", async () => {
      // Create a project
      const project = await repo.create({
        name: "test-project",
        path: "/tmp/test",
      });

      // Create sessions associated with the project
      const now = new Date().toISOString();
      db.insert(schema.sessions)
        .values([
          {
            id: "session-1",
            projectName: "test-project",
            agentType: "initializer",
            featureId: null,
            startedAt: now,
            endedAt: now,
            status: "completed",
            outputLog: "/tmp/log1.txt",
          },
          {
            id: "session-2",
            projectName: "test-project",
            agentType: "coding",
            featureId: 1,
            startedAt: now,
            endedAt: null,
            status: "running",
            outputLog: "/tmp/log2.txt",
          },
          {
            id: "session-3",
            projectName: "test-project",
            agentType: "testing",
            featureId: 2,
            startedAt: now,
            endedAt: now,
            status: "completed",
            outputLog: "/tmp/log3.txt",
          },
        ])
        .run();

      // Verify sessions were created
      const sessionsBeforeDelete = db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.projectName, "test-project"))
        .all();
      expect(sessionsBeforeDelete.length).toBe(3);

      // Delete the project
      await repo.delete("test-project");

      // Verify sessions were also deleted
      const sessionsAfterDelete = db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.projectName, "test-project"))
        .all();
      expect(sessionsAfterDelete.length).toBe(0);
    });

    it("should not affect sessions of other projects when deleting a project", async () => {
      // Create two projects
      await repo.create({
        name: "project-a",
        path: "/tmp/project-a",
      });
      await repo.create({
        name: "project-b",
        path: "/tmp/project-b",
      });

      // Create sessions for both projects
      const now = new Date().toISOString();
      db.insert(schema.sessions)
        .values([
          {
            id: "session-a-1",
            projectName: "project-a",
            agentType: "coding",
            featureId: 1,
            startedAt: now,
            endedAt: null,
            status: "running",
            outputLog: "/tmp/log-a1.txt",
          },
          {
            id: "session-b-1",
            projectName: "project-b",
            agentType: "coding",
            featureId: 1,
            startedAt: now,
            endedAt: null,
            status: "running",
            outputLog: "/tmp/log-b1.txt",
          },
          {
            id: "session-b-2",
            projectName: "project-b",
            agentType: "testing",
            featureId: 2,
            startedAt: now,
            endedAt: now,
            status: "completed",
            outputLog: "/tmp/log-b2.txt",
          },
        ])
        .run();

      // Delete project-a
      await repo.delete("project-a");

      // Verify only project-a's sessions were deleted
      const sessionsA = db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.projectName, "project-a"))
        .all();
      expect(sessionsA.length).toBe(0);

      // project-b's sessions should still exist
      const sessionsB = db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.projectName, "project-b"))
        .all();
      expect(sessionsB.length).toBe(2);
    });

    it("should throw ProjectNotFoundError when deleting non-existent project", async () => {
      await expect(repo.delete("non-existent")).rejects.toThrow(
        ProjectNotFoundError
      );
    });
  });

  describe("getByName", () => {
    it("should return project by name", async () => {
      await repo.create({
        name: "test-project",
        path: "/tmp/test",
      });

      const project = await repo.getByName("test-project");
      expect(project.name).toBe("test-project");
    });

    it("should throw ProjectNotFoundError when not found", async () => {
      await expect(repo.getByName("non-existent")).rejects.toThrow(
        ProjectNotFoundError
      );
    });
  });

  describe("list", () => {
    it("should list all projects", async () => {
      await repo.create({ name: "project-a", path: "/tmp/a" });
      await repo.create({ name: "project-b", path: "/tmp/b" });

      const projects = await repo.list();
      expect(projects.length).toBe(2);
    });
  });

  describe("update", () => {
    it("should update project settings", async () => {
      await repo.create({
        name: "test-project",
        path: "/tmp/test",
      });

      const updated = await repo.update("test-project", {
        concurrency: 5,
        yoloMode: true,
      });

      expect(updated.concurrency).toBe(5);
      expect(updated.yoloMode).toBe(1);
    });
  });
});
