/**
 * Agent API routes
 *
 * Handles orchestrator start/pause/stop operations and status via REST API.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  getOrchestratorStatus,
  startOrchestrator,
  pauseOrchestrator,
  resumeOrchestrator,
  stopOrchestrator,
  logger,
  ProjectNotFoundError,
  AgentError,
  isOpenAutocoderError,
} from "@open-autocoder/core";

// Zod schema for start options
const startAgentSchema = z.object({
  concurrency: z.number().int().min(1).max(5).optional(),
  yoloMode: z.boolean().optional(),
  testingAgentRatio: z.number().int().min(0).max(3).optional(),
});

type StartAgentBody = z.infer<typeof startAgentSchema>;

/**
 * Handle errors and return appropriate HTTP responses
 */
function handleError(error: unknown, reply: FastifyReply): FastifyReply {
  if (error instanceof ProjectNotFoundError) {
    return reply.status(404).send({
      error: error.message,
      code: error.code,
      suggestedAction: error.suggestedAction,
    });
  }

  if (error instanceof AgentError) {
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
  logger.error("Unexpected error in agent API", { error: message });
  return reply.status(500).send({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

/**
 * Register all agent routes on the Fastify instance
 */
export async function registerAgentRoutes(
  fastify: FastifyInstance,
  getProjectPath: (name: string) => Promise<string>
): Promise<void> {
  /**
   * GET /api/projects/:name/agent/status - Get orchestrator status
   */
  fastify.get(
    "/api/projects/:name/agent/status",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists (will throw ProjectNotFoundError if not)
        await getProjectPath(name);

        const status = getOrchestratorStatus(name);

        return reply.send({
          projectName: status.projectName,
          status: status.status,
          startedAt: status.startedAt,
          stoppedAt: status.stoppedAt,
          concurrency: status.concurrency,
          activeAgents: status.activeAgents,
          completedFeatures: status.completedFeatures,
          error: status.error,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/agent/start - Start orchestrator
   */
  fastify.post(
    "/api/projects/:name/agent/start",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Body: StartAgentBody;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists and get path
        const projectPath = await getProjectPath(name);

        // Validate request body
        const parseResult = startAgentSchema.safeParse(request.body ?? {});
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
          return reply.status(400).send({
            error: `Validation failed: ${errorMessage}`,
            code: "VALIDATION_ERROR",
          });
        }

        const options = parseResult.data;

        const state = await startOrchestrator(name, projectPath, {
          concurrency: options.concurrency,
          yoloMode: options.yoloMode,
          testingAgentRatio: options.testingAgentRatio,
        });

        logger.info("Orchestrator started via API", { projectName: name });

        return reply.status(200).send({
          message: `Orchestrator started for project '${name}'`,
          status: state.status,
          startedAt: state.startedAt,
          concurrency: state.concurrency,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/agent/pause - Pause orchestrator
   */
  fastify.post(
    "/api/projects/:name/agent/pause",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists
        await getProjectPath(name);

        const state = await pauseOrchestrator(name);

        logger.info("Orchestrator paused via API", { projectName: name });

        return reply.status(200).send({
          message: `Orchestrator paused for project '${name}'`,
          status: state.status,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/agent/resume - Resume paused orchestrator
   */
  fastify.post(
    "/api/projects/:name/agent/resume",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists
        await getProjectPath(name);

        const state = await resumeOrchestrator(name);

        logger.info("Orchestrator resumed via API", { projectName: name });

        return reply.status(200).send({
          message: `Orchestrator resumed for project '${name}'`,
          status: state.status,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * POST /api/projects/:name/agent/stop - Stop orchestrator
   */
  fastify.post(
    "/api/projects/:name/agent/stop",
    async (
      request: FastifyRequest<{ Params: { name: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists
        await getProjectPath(name);

        const state = await stopOrchestrator(name);

        logger.info("Orchestrator stopped via API", { projectName: name });

        return reply.status(200).send({
          message: `Orchestrator stopped for project '${name}'`,
          status: state.status,
          stoppedAt: state.stoppedAt,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  /**
   * GET /api/projects/:name/agent/logs - Get agent logs (placeholder)
   */
  fastify.get(
    "/api/projects/:name/agent/logs",
    async (
      request: FastifyRequest<{
        Params: { name: string };
        Querystring: { limit?: number; offset?: number };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.params;

        // Verify project exists
        await getProjectPath(name);

        // Placeholder: In full implementation, read from log file
        return reply.send({
          projectName: name,
          logs: [],
          message: "Log retrieval not yet implemented",
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
