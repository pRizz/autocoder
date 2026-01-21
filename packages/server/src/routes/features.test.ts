/**
 * Integration tests for Features API routes
 *
 * Tests cover all REST endpoints for feature management
 * including CRUD operations, filtering, and status updates.
 */

import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import { registerFeatureRoutes } from "./features.js";
import { getDatabase, initializeTables } from "@open-autocoder/core";
import { tmpdir } from "os";
import { join } from "path";
import { mkdirSync, rmSync, existsSync } from "fs";
import { randomUUID } from "crypto";

describe("Features API", () => {
  let app: FastifyInstance;
  let testDir: string;

  beforeAll(async () => {
    // Create a temporary directory for test database
    testDir = join(tmpdir(), `features-api-test-${randomUUID()}`);
    mkdirSync(testDir, { recursive: true });

    // Initialize database using the core package
    const dbPath = join(testDir, "features.db");
    const db = getDatabase(dbPath);
    initializeTables(db);

    // Create Fastify app
    app = Fastify({ logger: false });

    // Register routes with mock getProjectPath
    await registerFeatureRoutes(app, async (_projectName: string) => {
      return testDir;
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  beforeEach(async () => {
    // Clear the features table before each test by creating a new feature and deleting all
    // Use the API itself to clean up
    const listResponse = await app.inject({
      method: "GET",
      url: "/api/projects/test-project/features",
    });
    const features = JSON.parse(listResponse.body).features || [];
    for (const f of features) {
      await app.inject({
        method: "DELETE",
        url: `/api/projects/test-project/features/${f.id}`,
      });
    }
  });

  describe("POST /api/projects/:name/features", () => {
    it("should create a new feature", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1", "Step 2"],
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.id).toBeDefined();
      expect(body.name).toBe("Test Feature");
      expect(body.category).toBe("functional");
      expect(body.passes).toBe(0);
    });

    it("should return 400 for missing required fields", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          // name is missing
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 for empty steps array", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: [],
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/projects/:name/features/bulk", () => {
    it("should create multiple features", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
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
          ],
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.created).toBe(2);
    });

    it("should handle depends_on_indices", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
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
          ],
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.withDependencies).toBe(1);
    });
  });

  describe("GET /api/projects/:name/features", () => {
    beforeEach(async () => {
      // Create some test features
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature A",
              description: "First feature",
              steps: ["Step 1"],
            },
            {
              category: "security",
              name: "Feature B",
              description: "Second feature",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature C",
              description: "Third feature",
              steps: ["Step 1"],
            },
          ],
        },
      });
    });

    it("should list all features", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(3);
      expect(body.count).toBe(3);
    });

    it("should filter by category", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features?category=functional",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(2);
      expect(body.features.every((f: { category: string }) => f.category === "functional")).toBe(
        true
      );
    });

    it("should filter by passes status", async () => {
      // Mark one feature as passing
      const listResponse = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features",
      });
      const features = JSON.parse(listResponse.body).features;

      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${features[0].id}/pass`,
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features?passes=true",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(1);
    });

    it("should support pagination", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features?limit=2&offset=0",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(2);
      expect(body.total).toBe(3);
    });

    it("should support search with q parameter", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features?q=Feature%20A",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(1);
      expect(body.features[0].name).toBe("Feature A");
    });
  });

  describe("GET /api/projects/:name/features/:id", () => {
    it("should get feature by ID", async () => {
      // Create a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: "GET",
        url: `/api/projects/test-project/features/${created.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(created.id);
      expect(body.name).toBe("Test Feature");
    });

    it("should return 404 for non-existent feature", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/99999",
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.code).toBe("FEATURE_NOT_FOUND");
    });

    it("should return 400 for invalid ID", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/invalid",
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/projects/:name/features/:id/claim", () => {
    it("should claim a feature", async () => {
      // Create a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/claim`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.inProgress).toBe(1);
    });

    it("should return 409 if already claimed", async () => {
      // Create and claim a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/claim`,
      });

      // Try to claim again
      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/claim`,
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.code).toBe("FEATURE_ALREADY_CLAIMED");
    });
  });

  describe("POST /api/projects/:name/features/:id/pass", () => {
    it("should mark feature as passing", async () => {
      // Create a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/pass`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.passes).toBe(1);
      expect(body.inProgress).toBe(0);
    });
  });

  describe("POST /api/projects/:name/features/:id/fail", () => {
    it("should mark feature as failing", async () => {
      // Create a feature and mark as passing
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/pass`,
      });

      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/fail`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.passes).toBe(0);
    });
  });

  describe("POST /api/projects/:name/features/:id/skip", () => {
    it("should skip a feature and move to end of queue", async () => {
      // Create features
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second",
              steps: ["Step 1"],
            },
          ],
        },
      });

      const listResponse = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features",
      });
      const features = JSON.parse(listResponse.body).features;

      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${features[0].id}/skip`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.priority).toBeGreaterThan(features[1].priority);
    });
  });

  describe("DELETE /api/projects/:name/features/:id", () => {
    it("should delete a feature", async () => {
      // Create a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: "DELETE",
        url: `/api/projects/test-project/features/${created.id}`,
      });

      expect(response.statusCode).toBe(204);

      // Verify deletion
      const getResponse = await app.inject({
        method: "GET",
        url: `/api/projects/test-project/features/${created.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });

  describe("GET /api/projects/:name/features/stats", () => {
    it("should return feature statistics", async () => {
      // Create features and set various statuses
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 3",
              description: "Third",
              steps: ["Step 1"],
            },
          ],
        },
      });

      const listResponse = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features",
      });
      const features = JSON.parse(listResponse.body).features;

      // Mark one as passing
      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${features[0].id}/pass`,
      });

      // Claim one
      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${features[1].id}/claim`,
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/stats",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(3);
      expect(body.passing).toBe(1);
      expect(body.inProgress).toBe(1);
      expect(body.percentage).toBeCloseTo(33.33, 1);
    });
  });

  describe("GET /api/projects/:name/features/next", () => {
    it("should return next available feature", async () => {
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/next",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.feature).toBeDefined();
      expect(body.feature.name).toBe("Test Feature");
    });

    it("should return null when all features are passing", async () => {
      // Create and pass a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/pass`,
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/next",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.feature).toBeNull();
    });
  });

  describe("GET /api/projects/:name/features/ready", () => {
    it("should return ready features respecting limit", async () => {
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 3",
              description: "Third",
              steps: ["Step 1"],
            },
          ],
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/ready?limit=2",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(2);
    });
  });

  describe("GET /api/projects/:name/features/blocked", () => {
    it("should return blocked features", async () => {
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second, blocked",
              steps: ["Step 1"],
              depends_on_indices: [0],
            },
          ],
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/blocked",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(1);
      expect(body.features[0].name).toBe("Feature 2");
    });
  });

  describe("GET /api/projects/:name/features/regression", () => {
    it("should return random passing features", async () => {
      // Create features and mark as passing
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second",
              steps: ["Step 1"],
            },
          ],
        },
      });

      const listResponse = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features",
      });
      const features = JSON.parse(listResponse.body).features;

      // Mark all as passing
      for (const f of features) {
        await app.inject({
          method: "POST",
          url: `/api/projects/test-project/features/${f.id}/pass`,
        });
      }

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/regression?limit=2",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(2);
      expect(body.features.every((f: { passes: number }) => f.passes === 1)).toBe(true);
    });
  });

  describe("GET /api/projects/:name/features/graph", () => {
    it("should return dependency graph data", async () => {
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Feature 1",
              description: "First",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Feature 2",
              description: "Second",
              steps: ["Step 1"],
              depends_on_indices: [0],
            },
          ],
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/graph",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.nodes.length).toBe(2);
      expect(body.edges.length).toBe(1);
    });
  });

  describe("GET /api/projects/:name/features/search", () => {
    beforeEach(async () => {
      await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features/bulk",
        payload: {
          features: [
            {
              category: "functional",
              name: "Login Feature",
              description: "User login",
              steps: ["Step 1"],
            },
            {
              category: "functional",
              name: "Logout Feature",
              description: "User logout",
              steps: ["Step 1"],
            },
          ],
        },
      });
    });

    it("should search features by name", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/search?q=Login",
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.features.length).toBe(1);
      expect(body.features[0].name).toBe("Login Feature");
    });

    it("should return 400 for missing search query", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/projects/test-project/features/search",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/projects/:name/features/:id/clear-in-progress", () => {
    it("should clear in-progress status", async () => {
      // Create and claim a feature
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/projects/test-project/features",
        payload: {
          category: "functional",
          name: "Test Feature",
          description: "A test feature",
          steps: ["Step 1"],
        },
      });

      const created = JSON.parse(createResponse.body);

      await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/claim`,
      });

      const response = await app.inject({
        method: "POST",
        url: `/api/projects/test-project/features/${created.id}/clear-in-progress`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.inProgress).toBe(0);
    });
  });
});
