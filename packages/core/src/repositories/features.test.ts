/**
 * Unit tests for FeatureRepository
 *
 * Tests cover all CRUD operations, dependency handling,
 * atomic claiming, and query methods.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema.js";
import { FeatureRepository } from "./features.js";
import {
  FeatureNotFoundError,
  FeatureAlreadyClaimedError,
  ValidationError,
} from "../errors/index.js";
import type { DatabaseConnection } from "../db/connection.js";

describe("FeatureRepository", () => {
  let db: DatabaseConnection;
  let sqliteDb: Database.Database;
  let repo: FeatureRepository;

  beforeEach(() => {
    // Create in-memory database for testing
    sqliteDb = new Database(":memory:");
    db = drizzle(sqliteDb, { schema });

    // Initialize tables
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        priority INTEGER NOT NULL,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        steps TEXT NOT NULL,
        passes INTEGER NOT NULL DEFAULT 0,
        in_progress INTEGER NOT NULL DEFAULT 0,
        dependencies TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    repo = new FeatureRepository(db);
  });

  afterEach(() => {
    sqliteDb.close();
  });

  describe("create", () => {
    it("should create a feature with auto-incremented priority", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "A test feature",
        steps: ["Step 1", "Step 2"],
      });

      expect(feature.id).toBe(1);
      expect(feature.priority).toBe(1);
      expect(feature.category).toBe("functional");
      expect(feature.name).toBe("Test Feature");
      expect(feature.description).toBe("A test feature");
      expect(JSON.parse(feature.steps)).toEqual(["Step 1", "Step 2"]);
      expect(feature.passes).toBe(0);
      expect(feature.inProgress).toBe(0);
    });

    it("should assign sequential priorities", async () => {
      const feature1 = await repo.create({
        category: "functional",
        name: "Feature 1",
        description: "First feature",
        steps: ["Step 1"],
      });

      const feature2 = await repo.create({
        category: "functional",
        name: "Feature 2",
        description: "Second feature",
        steps: ["Step 1"],
      });

      expect(feature1.priority).toBe(1);
      expect(feature2.priority).toBe(2);
    });

    it("should create feature with dependencies", async () => {
      const feature1 = await repo.create({
        category: "functional",
        name: "Feature 1",
        description: "First feature",
        steps: ["Step 1"],
      });

      const feature2 = await repo.create({
        category: "functional",
        name: "Feature 2",
        description: "Second feature",
        steps: ["Step 1"],
        dependencies: [feature1.id],
      });

      expect(JSON.parse(feature2.dependencies!)).toEqual([feature1.id]);
    });

    it("should throw ValidationError when dependencies exceed max limit", async () => {
      const deps = Array.from({ length: 21 }, (_, i) => i + 1);

      await expect(
        repo.create({
          category: "functional",
          name: "Feature with too many deps",
          description: "Test",
          steps: ["Step 1"],
          dependencies: deps,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("createBulk", () => {
    it("should create multiple features in bulk", async () => {
      const result = await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
      ]);

      expect(result.created).toBe(2);
      expect(result.withDependencies).toBe(0);

      const features = await repo.list();
      expect(features.length).toBe(2);
    });

    it("should handle depends_on_indices for batch dependencies", async () => {
      const result = await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
          depends_on_indices: [0], // Depends on Feature 1
        },
      ]);

      expect(result.created).toBe(2);
      expect(result.withDependencies).toBe(1);

      const features = await repo.list();
      const feature2 = features.find((f) => f.name === "Feature 2");
      const deps = JSON.parse(feature2!.dependencies!);
      expect(deps).toEqual([features[0].id]);
    });

    it("should throw ValidationError for forward reference in depends_on_indices", async () => {
      await expect(
        repo.createBulk([
          {
            category: "functional",
            name: "Feature 1",
            description: "First feature",
            steps: ["Step 1"],
            depends_on_indices: [1], // Forward reference not allowed
          },
          {
            category: "functional",
            name: "Feature 2",
            description: "Second feature",
            steps: ["Step 1"],
          },
        ])
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for self-reference in depends_on_indices", async () => {
      await expect(
        repo.createBulk([
          {
            category: "functional",
            name: "Feature 1",
            description: "First feature",
            steps: ["Step 1"],
            depends_on_indices: [0], // Self-reference not allowed
          },
        ])
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getById", () => {
    it("should return feature by ID", async () => {
      const created = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "A test feature",
        steps: ["Step 1"],
      });

      const feature = await repo.getById(created.id);

      expect(feature.id).toBe(created.id);
      expect(feature.name).toBe("Test Feature");
    });

    it("should throw FeatureNotFoundError for non-existent ID", async () => {
      await expect(repo.getById(999)).rejects.toThrow(FeatureNotFoundError);
    });
  });

  describe("list", () => {
    beforeEach(async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "security",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);
    });

    it("should list all features sorted by priority", async () => {
      const features = await repo.list();

      expect(features.length).toBe(3);
      expect(features[0].name).toBe("Feature 1");
      expect(features[1].name).toBe("Feature 2");
      expect(features[2].name).toBe("Feature 3");
    });

    it("should filter by category", async () => {
      const features = await repo.list({ category: "functional" });

      expect(features.length).toBe(2);
      expect(features.every((f) => f.category === "functional")).toBe(true);
    });

    it("should filter by passes status", async () => {
      // Mark one as passing
      const all = await repo.list();
      await repo.markPassing(all[0].id);

      const passing = await repo.list({ passes: true });
      const notPassing = await repo.list({ passes: false });

      expect(passing.length).toBe(1);
      expect(notPassing.length).toBe(2);
    });

    it("should support pagination with limit and offset", async () => {
      const page1 = await repo.list({ limit: 2, offset: 0 });
      const page2 = await repo.list({ limit: 2, offset: 2 });

      expect(page1.length).toBe(2);
      expect(page2.length).toBe(1);
    });
  });

  describe("search", () => {
    beforeEach(async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Login Feature",
          description: "User login functionality",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Logout Feature",
          description: "User logout functionality",
          steps: ["Step 1"],
        },
        {
          category: "security",
          name: "Password Reset",
          description: "Reset user password",
          steps: ["Step 1"],
        },
      ]);
    });

    it("should search features by name", async () => {
      const results = await repo.search("Login");

      expect(results.length).toBe(1);
      expect(results[0].name).toBe("Login Feature");
    });

    it("should be case-insensitive", async () => {
      const results = await repo.search("login");

      expect(results.length).toBe(1);
      expect(results[0].name).toBe("Login Feature");
    });

    it("should find partial matches", async () => {
      const results = await repo.search("Log");

      expect(results.length).toBe(2);
    });

    it("should combine search with filters", async () => {
      const results = await repo.search("Feature", { category: "functional" });

      expect(results.length).toBe(2);
      expect(results.every((f) => f.category === "functional")).toBe(true);
    });
  });

  describe("markPassing", () => {
    it("should mark feature as passing and clear in_progress", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.claim(feature.id);
      const updated = await repo.markPassing(feature.id);

      expect(updated.passes).toBe(1);
      expect(updated.inProgress).toBe(0);
    });

    it("should throw FeatureNotFoundError for non-existent ID", async () => {
      await expect(repo.markPassing(999)).rejects.toThrow(FeatureNotFoundError);
    });
  });

  describe("markFailing", () => {
    it("should mark feature as failing and clear in_progress", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      // First mark as passing
      await repo.markPassing(feature.id);
      // Then mark as failing (regression)
      const updated = await repo.markFailing(feature.id);

      expect(updated.passes).toBe(0);
      expect(updated.inProgress).toBe(0);
    });
  });

  describe("claim", () => {
    it("should atomically claim a feature", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      const claimed = await repo.claim(feature.id);

      expect(claimed.inProgress).toBe(1);
    });

    it("should throw FeatureAlreadyClaimedError if already claimed", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.claim(feature.id);

      await expect(repo.claim(feature.id)).rejects.toThrow(
        FeatureAlreadyClaimedError
      );
    });

    it("should throw FeatureNotFoundError for non-existent ID", async () => {
      await expect(repo.claim(999)).rejects.toThrow(FeatureNotFoundError);
    });
  });

  describe("clearInProgress", () => {
    it("should clear in_progress status", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.claim(feature.id);
      const cleared = await repo.clearInProgress(feature.id);

      expect(cleared.inProgress).toBe(0);
    });
  });

  describe("skip", () => {
    it("should move feature to end of priority queue", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
      ]);

      const features = await repo.list();
      const feature1 = features[0];
      const feature2 = features[1];

      await repo.skip(feature1.id);

      const skipped = await repo.getById(feature1.id);
      expect(skipped.priority).toBeGreaterThan(feature2.priority);
    });

    it("should clear in_progress when skipping", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.claim(feature.id);
      const skipped = await repo.skip(feature.id);

      expect(skipped.inProgress).toBe(0);
    });

    it("should clear dependencies when skipping", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
      ]);

      const features = await repo.list();
      const feature2 = features.find((f) => f.name === "Feature 2")!;

      const skipped = await repo.skip(feature2.id);

      expect(skipped.dependencies).toBeNull();
    });
  });

  describe("getNext", () => {
    it("should return highest priority pending feature", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
      ]);

      const next = await repo.getNext();

      expect(next?.name).toBe("Feature 1");
    });

    it("should skip features with unsatisfied dependencies", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature, depends on Feature 1",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature, no deps",
          steps: ["Step 1"],
        },
      ]);

      // Claim feature 1
      const features = await repo.list();
      await repo.claim(features[0].id);

      // Next should be Feature 3 since Feature 2 is blocked
      const next = await repo.getNext();
      expect(next?.name).toBe("Feature 3");
    });

    it("should return feature after dependency is satisfied", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature, depends on Feature 1",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
      ]);

      const features = await repo.list();
      const feature1 = features[0];

      // Mark Feature 1 as passing
      await repo.markPassing(feature1.id);

      // Now Feature 2 should be available
      const next = await repo.getNext();
      expect(next?.name).toBe("Feature 2");
    });

    it("should return null when all features are passing", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.markPassing(feature.id);

      const next = await repo.getNext();
      expect(next).toBeNull();
    });
  });

  describe("getReady", () => {
    it("should return multiple ready features", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);

      const ready = await repo.getReady(10);

      expect(ready.length).toBe(3);
    });

    it("should respect limit parameter", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);

      const ready = await repo.getReady(2);

      expect(ready.length).toBe(2);
    });
  });

  describe("getBlocked", () => {
    it("should return features blocked by dependencies", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature, depends on Feature 1",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
      ]);

      const blocked = await repo.getBlocked();

      expect(blocked.length).toBe(1);
      expect(blocked[0].name).toBe("Feature 2");
      expect(blocked[0].blockedBy.length).toBe(1);
    });

    it("should return empty array when no features are blocked", async () => {
      await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      const blocked = await repo.getBlocked();

      expect(blocked.length).toBe(0);
    });
  });

  describe("getForRegression", () => {
    it("should return random passing features", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);

      // Mark all as passing
      const features = await repo.list();
      for (const f of features) {
        await repo.markPassing(f.id);
      }

      const regression = await repo.getForRegression(2);

      expect(regression.length).toBe(2);
      expect(regression.every((f) => f.passes === 1)).toBe(true);
    });

    it("should exclude in-progress features", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.markPassing(feature.id);
      await repo.claim(feature.id);

      const regression = await repo.getForRegression();

      expect(regression.length).toBe(0);
    });
  });

  describe("getStats", () => {
    it("should return correct statistics", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);

      const features = await repo.list();
      await repo.markPassing(features[0].id);
      await repo.claim(features[1].id);

      const stats = await repo.getStats();

      expect(stats.total).toBe(3);
      expect(stats.passing).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.percentage).toBeCloseTo(33.33, 1);
    });
  });

  describe("getGraph", () => {
    it("should return nodes and edges for visualization", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
      ]);

      const graph = await repo.getGraph();

      expect(graph.nodes.length).toBe(2);
      expect(graph.edges.length).toBe(1);
      expect(graph.edges[0].target).toBe(graph.nodes[1].id);
      expect(graph.edges[0].source).toBe(graph.nodes[0].id);
    });
  });

  describe("delete", () => {
    it("should delete a feature", async () => {
      const feature = await repo.create({
        category: "functional",
        name: "Test Feature",
        description: "Test",
        steps: ["Step 1"],
      });

      await repo.delete(feature.id);

      await expect(repo.getById(feature.id)).rejects.toThrow(
        FeatureNotFoundError
      );
    });

    it("should clean up orphaned dependencies", async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
          depends_on_indices: [0],
        },
      ]);

      const features = await repo.list();
      const feature1 = features[0];
      const feature2 = features[1];

      // Delete feature 1
      await repo.delete(feature1.id);

      // Feature 2 should have its dependency removed
      const updated = await repo.getById(feature2.id);
      const deps = updated.dependencies
        ? JSON.parse(updated.dependencies)
        : [];
      expect(deps.length).toBe(0);
    });

    it("should throw FeatureNotFoundError for non-existent ID", async () => {
      await expect(repo.delete(999)).rejects.toThrow(FeatureNotFoundError);
    });
  });

  describe("count", () => {
    beforeEach(async () => {
      await repo.createBulk([
        {
          category: "functional",
          name: "Feature 1",
          description: "First feature",
          steps: ["Step 1"],
        },
        {
          category: "security",
          name: "Feature 2",
          description: "Second feature",
          steps: ["Step 1"],
        },
        {
          category: "functional",
          name: "Feature 3",
          description: "Third feature",
          steps: ["Step 1"],
        },
      ]);
    });

    it("should return total count", async () => {
      const count = await repo.count();
      expect(count).toBe(3);
    });

    it("should return count filtered by category", async () => {
      const count = await repo.count({ category: "functional" });
      expect(count).toBe(2);
    });

    it("should return count filtered by passes status", async () => {
      const features = await repo.list();
      await repo.markPassing(features[0].id);

      const passingCount = await repo.count({ passes: true });
      const notPassingCount = await repo.count({ passes: false });

      expect(passingCount).toBe(1);
      expect(notPassingCount).toBe(2);
    });
  });
});
