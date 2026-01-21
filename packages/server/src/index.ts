/**
 * @open-autocoder/server
 *
 * Fastify API server with WebSocket support for open-autocoder.
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { logger } from "@open-autocoder/core";

const PORT = parseInt(process.env["PORT"] ?? "3001", 10);
const HOST = process.env["HOST"] ?? "0.0.0.0";

async function main(): Promise<void> {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(websocket);

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

  // WebSocket endpoint placeholder
  fastify.get("/ws", { websocket: true }, (socket, _req) => {
    socket.on("message", (message) => {
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

  // Start server
  try {
    await fastify.listen({ port: PORT, host: HOST });
    logger.info(`Server listening on http://${HOST}:${PORT}`);
    logger.info(`API available at http://${HOST}:${PORT}/api`);
    logger.info(`WebSocket available at ws://${HOST}:${PORT}/ws`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    logger.info("Shutting down server...");
    await fastify.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
