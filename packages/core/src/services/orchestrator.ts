/**
 * Orchestrator Manager Service
 *
 * Manages the state and lifecycle of agent orchestrators per project.
 * Provides in-memory state tracking for orchestrator status.
 */

import { type AgentStatus } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { AgentError } from "../errors/index.js";
import { FeatureRepository } from "../repositories/features.js";
import { getDatabase, initializeTables } from "../db/connection.js";
import { join } from "path";

/**
 * Orchestrator state for a single project
 */
export interface OrchestratorState {
  projectName: string;
  projectPath: string | null;
  status: AgentStatus;
  startedAt: string | null;
  stoppedAt: string | null;
  concurrency: number;
  activeAgents: number;
  completedFeatures: number;
  error: string | null;
}

/**
 * Options for starting an orchestrator
 */
export interface StartOrchestratorOptions {
  concurrency?: number | undefined;
  yoloMode?: boolean | undefined;
  testingAgentRatio?: number | undefined;
}

/**
 * In-memory state store for all orchestrators
 */
const orchestratorStates = new Map<string, OrchestratorState>();

/**
 * Get or create the orchestrator state for a project
 */
function getOrCreateState(projectName: string): OrchestratorState {
  let state = orchestratorStates.get(projectName);
  if (!state) {
    state = {
      projectName,
      projectPath: null,
      status: "idle",
      startedAt: null,
      stoppedAt: null,
      concurrency: 1,
      activeAgents: 0,
      completedFeatures: 0,
      error: null,
    };
    orchestratorStates.set(projectName, state);
  }
  return state;
}

/**
 * Get orchestrator status for a project
 */
export function getOrchestratorStatus(projectName: string): OrchestratorState {
  return getOrCreateState(projectName);
}

/**
 * Start the orchestrator for a project
 *
 * Note: This is a simplified implementation that manages state.
 * The actual agent subprocess spawning would be implemented separately
 * when integrating with opencode SDK.
 */
export async function startOrchestrator(
  projectName: string,
  projectPath: string,
  options: StartOrchestratorOptions = {}
): Promise<OrchestratorState> {
  const state = getOrCreateState(projectName);

  // Check if already running
  if (state.status === "running") {
    throw new AgentError(
      "orchestrator",
      `Orchestrator for project '${projectName}' is already running`,
    );
  }

  const concurrency = options.concurrency ?? 1;

  // Update state to running
  state.status = "running";
  state.projectPath = projectPath;
  state.startedAt = new Date().toISOString();
  state.stoppedAt = null;
  state.concurrency = concurrency;
  state.activeAgents = 0;
  state.error = null;

  logger.info("Orchestrator started", {
    projectName,
    projectPath,
    concurrency,
    yoloMode: options.yoloMode ?? false,
    testingAgentRatio: options.testingAgentRatio ?? 1,
  });

  // In a full implementation, this would:
  // 1. Spawn opencode agent subprocesses
  // 2. Set up MCP server connections
  // 3. Begin feature claiming and processing
  // For now, we just manage the state

  return state;
}

/**
 * Pause the orchestrator for a project
 */
export async function pauseOrchestrator(
  projectName: string
): Promise<OrchestratorState> {
  const state = getOrCreateState(projectName);

  if (state.status !== "running") {
    throw new AgentError(
      "orchestrator",
      `Cannot pause orchestrator: current status is '${state.status}'`
    );
  }

  state.status = "paused";

  logger.info("Orchestrator paused", { projectName });

  return state;
}

/**
 * Resume a paused orchestrator
 */
export async function resumeOrchestrator(
  projectName: string
): Promise<OrchestratorState> {
  const state = getOrCreateState(projectName);

  if (state.status !== "paused") {
    throw new AgentError(
      "orchestrator",
      `Cannot resume orchestrator: current status is '${state.status}'`
    );
  }

  state.status = "running";

  logger.info("Orchestrator resumed", { projectName });

  return state;
}

/**
 * Stop the orchestrator for a project
 *
 * This function:
 * 1. Stops all agent subprocesses
 * 2. Clears in_progress status from all claimed features
 * 3. Returns features to the pending queue
 */
export async function stopOrchestrator(
  projectName: string
): Promise<OrchestratorState> {
  const state = getOrCreateState(projectName);

  if (state.status === "idle" || state.status === "stopped") {
    throw new AgentError(
      "orchestrator",
      `Orchestrator for project '${projectName}' is not running`
    );
  }

  // Release all claimed features back to pending queue
  let releasedCount = 0;
  if (state.projectPath) {
    try {
      const dbPath = join(state.projectPath, "features.db");
      const db = getDatabase(dbPath);
      initializeTables(db);
      const featureRepo = new FeatureRepository(db);
      releasedCount = await featureRepo.clearAllInProgress();
      logger.info("Released claimed features on orchestrator stop", {
        projectName,
        releasedCount,
      });
    } catch (error) {
      // Log but don't fail the stop operation if feature release fails
      logger.error("Failed to release claimed features on stop", {
        projectName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // In a full implementation, this would also:
  // 1. Signal all agent subprocesses to stop
  // 2. Wait for graceful shutdown
  // 3. Clean up other resources

  state.status = "stopped";
  state.stoppedAt = new Date().toISOString();
  state.activeAgents = 0;

  logger.info("Orchestrator stopped", { projectName, releasedCount });

  return state;
}

/**
 * Mark orchestrator as errored
 */
export function setOrchestratorError(
  projectName: string,
  errorMessage: string
): OrchestratorState {
  const state = getOrCreateState(projectName);
  state.status = "error";
  state.error = errorMessage;
  state.stoppedAt = new Date().toISOString();

  logger.error("Orchestrator error", { projectName, error: errorMessage });

  return state;
}

/**
 * Update active agent count
 */
export function updateActiveAgents(
  projectName: string,
  count: number
): OrchestratorState {
  const state = getOrCreateState(projectName);
  state.activeAgents = count;
  return state;
}

/**
 * Increment completed features count
 */
export function incrementCompletedFeatures(
  projectName: string
): OrchestratorState {
  const state = getOrCreateState(projectName);
  state.completedFeatures += 1;
  return state;
}

/**
 * Get all orchestrator states (for admin/debugging)
 */
export function getAllOrchestratorStates(): OrchestratorState[] {
  return Array.from(orchestratorStates.values());
}

/**
 * Clear orchestrator state for a project (for testing)
 */
export function clearOrchestratorState(projectName: string): void {
  orchestratorStates.delete(projectName);
}
