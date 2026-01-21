/**
 * Drizzle ORM schema definitions for open-autocoder database
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Features table - stores all feature/test definitions
 */
export const features = sqliteTable("features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  priority: integer("priority").notNull(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  steps: text("steps").notNull(), // JSON array of step strings
  passes: integer("passes").notNull().default(0),
  inProgress: integer("in_progress").notNull().default(0),
  dependencies: text("dependencies"), // JSON array of feature IDs, nullable
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/**
 * Projects table - stores project registry
 */
export const projects = sqliteTable("projects", {
  name: text("name").primaryKey(),
  path: text("path").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  model: text("model"),
  provider: text("provider"),
  concurrency: integer("concurrency").default(3),
  yoloMode: integer("yolo_mode").default(0),
  testingAgentRatio: integer("testing_agent_ratio").default(1),
});

/**
 * Providers table - stores AI provider configurations
 */
export const providers = sqliteTable("providers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  apiKeyEncrypted: text("api_key_encrypted"),
  baseUrl: text("base_url"),
  isDefault: integer("is_default").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/**
 * Sessions table - stores agent session history
 */
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  projectName: text("project_name").notNull(),
  agentType: text("agent_type").notNull(),
  featureId: integer("feature_id"),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
  status: text("status").notNull(),
  outputLog: text("output_log"),
});

// Type exports for the schema
export type Feature = typeof features.$inferSelect;
export type NewFeature = typeof features.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
