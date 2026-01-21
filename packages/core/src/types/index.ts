/**
 * Core domain types for open-autocoder
 */

import { z } from "zod";

// Feature status enum
export type FeatureStatus = "pending" | "in_progress" | "passing" | "blocked";

// Agent types
export type AgentType = "initializer" | "coding" | "testing";

// Agent status
export type AgentStatus = "idle" | "running" | "paused" | "stopped" | "error";

// Session status
export type SessionStatus = "running" | "completed" | "failed" | "cancelled";

// Zod schemas for validation
export const createFeatureSchema = z.object({
  category: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  steps: z.array(z.string()).min(1),
  dependsOnIndices: z.array(z.number().int().min(0)).optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9-_]+$/i),
  path: z.string().min(1),
  model: z.string().optional(),
  provider: z.string().optional(),
  concurrency: z.number().int().min(1).max(5).optional(),
  yoloMode: z.boolean().optional(),
  testingAgentRatio: z.number().int().min(0).max(3).optional(),
});

export const updateProjectSchema = createProjectSchema.partial().omit({
  name: true,
  path: true,
});

export const createProviderSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  apiKey: z.string().min(1),
  baseUrl: z.string().url().optional(),
  isDefault: z.boolean().optional(),
});

// Bulk feature creation input
export const bulkFeatureInputSchema = z.object({
  category: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  steps: z.array(z.string()).min(1),
  depends_on_indices: z.array(z.number().int().min(0)).max(20).optional(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type BulkFeatureInput = z.infer<typeof bulkFeatureInputSchema>;

// Feature statistics
export interface FeatureStats {
  passing: number;
  inProgress: number;
  total: number;
  percentage: number;
}

// Dependency graph types
export interface GraphNode {
  id: number;
  name: string;
  status: FeatureStatus;
}

export interface GraphEdge {
  source: number;
  target: number;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// WebSocket event types
export type WSEventType =
  | "feature_created"
  | "feature_updated"
  | "feature_deleted"
  | "agent_started"
  | "agent_stopped"
  | "agent_output"
  | "progress_updated"
  | "connection_established";

export interface WSEvent {
  type: WSEventType;
  projectName: string;
  data: unknown;
  timestamp: string;
}
