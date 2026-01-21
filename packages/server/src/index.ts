/**
 * @open-autocoder/server
 *
 * Fastify API server with WebSocket support for open-autocoder.
 */

import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import { logger } from "@open-autocoder/core";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { registerProjectRoutes, getProjectPath, projectExists } from "./routes/projects.js";
import { registerFeatureRoutes } from "./routes/features.js";
import { registerProviderRoutes } from "./routes/providers.js";
import { registerAgentRoutes } from "./routes/agent.js";
import { registerAuthRoutes } from "./routes/auth.js";

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = "0.0.0.0";

export interface ServerOptions {
  port?: number;
  host?: string;
  serveStatic?: boolean;
  staticPath?: string;
}

/**
 * Create and configure the Fastify server instance
 */
export async function createServer(options: ServerOptions = {}): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(websocket);

  // Serve static files (web UI) if enabled
  if (options.serveStatic) {
    const staticPath = options.staticPath ?? findWebDistPath();
    if (staticPath && existsSync(staticPath)) {
      await fastify.register(fastifyStatic, {
        root: staticPath,
        prefix: "/",
      });
      logger.info(`Serving static files from: ${staticPath}`);
    } else {
      logger.warn("Static path not found, web UI will not be served");
    }
  }

  // Health check endpoint
  fastify.get("/api/health", async (_request, _reply) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    };
  });

  // Version endpoint
  fastify.get("/api/version", async (_request, _reply) => {
    return {
      version: "0.1.0",
      name: "open-autocoder",
    };
  });

  // WebSocket endpoint placeholder (generic)
  fastify.get("/ws", { websocket: true }, (socket, _req) => {
    socket.on("message", (message: Buffer | ArrayBuffer | Buffer[]) => {
      const data = message.toString();
      logger.debug("WebSocket message received", { data });
    });

    socket.send(
      JSON.stringify({
        type: "connection_established",
        timestamp: new Date().toISOString(),
      })
    );
  });

  // Project-specific WebSocket endpoint with validation
  fastify.get<{ Params: { projectName: string } }>(
    "/ws/projects/:projectName",
    { websocket: true },
    async (socket, req) => {
      const { projectName } = req.params;

      // Validate that the project exists
      const exists = await projectExists(projectName);

      if (!exists) {
        logger.warn("WebSocket connection rejected: project not found", { projectName });

        // Send error message before closing
        socket.send(
          JSON.stringify({
            type: "error",
            code: "PROJECT_NOT_FOUND",
            message: `Project '${projectName}' not found`,
            timestamp: new Date().toISOString(),
          })
        );

        // Close the connection with code 4004 (custom code for "not found")
        socket.close(4004, `Project '${projectName}' not found`);
        return;
      }

      logger.info("WebSocket connection established for project", { projectName });

      socket.on("message", (message: Buffer | ArrayBuffer | Buffer[]) => {
        const data = message.toString();
        logger.debug("WebSocket message received for project", { projectName, data });
      });

      socket.send(
        JSON.stringify({
          type: "connection_established",
          projectName,
          timestamp: new Date().toISOString(),
        })
      );
    }
  );

  // Register API routes
  await registerProjectRoutes(fastify);
  await registerFeatureRoutes(fastify, getProjectPath);
  await registerProviderRoutes(fastify);
  await registerAgentRoutes(fastify, getProjectPath);
  await registerAuthRoutes(fastify);

  return fastify;
}

/**
 * Start the server and listen on the specified port
 */
export async function startServer(options: ServerOptions = {}): Promise<FastifyInstance> {
  const port = options.port ?? parseInt(process.env["PORT"] ?? String(DEFAULT_PORT), 10);
  const host = options.host ?? process.env["HOST"] ?? DEFAULT_HOST;

  const fastify = await createServer(options);

  // Start server
  try {
    await fastify.listen({ port, host });
    logger.info(`Server listening on http://${host}:${port}`);
    logger.info(`API available at http://${host}:${port}/api`);
    logger.info(`WebSocket available at ws://${host}:${port}/ws`);
    if (options.serveStatic) {
      logger.info(`Web UI available at http://${host}:${port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    throw err;
  }

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    logger.info("Shutting down server...");
    await fastify.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return fastify;
}

/**
 * Find the web package dist directory
 */
function findWebDistPath(): string | null {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Try relative path from dist (when running from built package)
  const fromDist = join(__dirname, "..", "..", "web", "dist");
  if (existsSync(fromDist)) {
    return fromDist;
  }

  // Try relative path from src (when running in dev)
  const fromSrc = join(__dirname, "..", "..", "..", "web", "dist");
  if (existsSync(fromSrc)) {
    return fromSrc;
  }

  // Try from node_modules (when installed as package)
  const fromNodeModules = join(__dirname, "..", "..", "..", "..", "web", "dist");
  if (existsSync(fromNodeModules)) {
    return fromNodeModules;
  }

  return null;
}

// Run directly if this is the main module
const isMainModule = process.argv[1]?.includes("server") && !process.argv[1]?.includes("cli");
if (isMainModule) {
  startServer({ serveStatic: true }).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
