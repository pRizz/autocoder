/**
 * Structured error types for open-autocoder
 *
 * All errors follow the error handling philosophy:
 * - Never swallow errors
 * - Provide actionable messages
 * - Distinguish severity levels
 * - Log all errors
 */

/**
 * Base error class for all open-autocoder errors
 */
export class OpenAutocoderError extends Error {
  public readonly code: string;
  public readonly suggestedAction?: string;
  public readonly cause?: Error;

  constructor(
    message: string,
    code: string,
    options?: {
      suggestedAction?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = "OpenAutocoderError";
    this.code = code;
    this.suggestedAction = options?.suggestedAction;
    this.cause = options?.cause;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for user-facing issues with actionable suggestions
 */
export class UserFacingError extends OpenAutocoderError {
  constructor(message: string, suggestedAction: string, cause?: Error) {
    super(message, "USER_ERROR", { suggestedAction, cause });
    this.name = "UserFacingError";
  }
}

/**
 * Database-related errors
 */
export class DatabaseError extends OpenAutocoderError {
  constructor(message: string, cause?: Error) {
    super(message, "DATABASE_ERROR", {
      suggestedAction: "Check database connection and file permissions",
      cause,
    });
    this.name = "DatabaseError";
  }
}

/**
 * Feature not found error
 */
export class FeatureNotFoundError extends OpenAutocoderError {
  public readonly featureId: number;

  constructor(featureId: number) {
    super(`Feature with ID ${featureId} not found`, "FEATURE_NOT_FOUND", {
      suggestedAction: "Verify the feature ID exists in the database",
    });
    this.name = "FeatureNotFoundError";
    this.featureId = featureId;
  }
}

/**
 * Project not found error
 */
export class ProjectNotFoundError extends OpenAutocoderError {
  public readonly projectName: string;

  constructor(projectName: string) {
    super(`Project '${projectName}' not found`, "PROJECT_NOT_FOUND", {
      suggestedAction: "Verify the project name or create a new project",
    });
    this.name = "ProjectNotFoundError";
    this.projectName = projectName;
  }
}

/**
 * Feature already claimed error
 */
export class FeatureAlreadyClaimedError extends OpenAutocoderError {
  public readonly featureId: number;

  constructor(featureId: number) {
    super(
      `Feature ${featureId} is already claimed by another agent`,
      "FEATURE_ALREADY_CLAIMED",
      {
        suggestedAction: "Wait for the feature to be released or claim a different feature",
      }
    );
    this.name = "FeatureAlreadyClaimedError";
    this.featureId = featureId;
  }
}

/**
 * Circular dependency error
 */
export class CircularDependencyError extends OpenAutocoderError {
  constructor(featureId: number, dependencyId: number) {
    super(
      `Adding dependency ${dependencyId} to feature ${featureId} would create a circular dependency`,
      "CIRCULAR_DEPENDENCY",
      {
        suggestedAction: "Review and restructure your dependency graph",
      }
    );
    this.name = "CircularDependencyError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends OpenAutocoderError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", {
      suggestedAction: "Check the input data and try again",
    });
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * Provider connection error
 */
export class ProviderConnectionError extends OpenAutocoderError {
  public readonly providerId: string;

  constructor(providerId: string, message: string, cause?: Error) {
    super(message, "PROVIDER_CONNECTION_ERROR", {
      suggestedAction: "Check your API key and network connection",
      cause,
    });
    this.name = "ProviderConnectionError";
    this.providerId = providerId;
  }
}

/**
 * Agent error
 */
export class AgentError extends OpenAutocoderError {
  public readonly agentType: string;

  constructor(agentType: string, message: string, cause?: Error) {
    super(message, "AGENT_ERROR", {
      suggestedAction: "Check agent logs for details and restart if necessary",
      cause,
    });
    this.name = "AgentError";
    this.agentType = agentType;
  }
}

/**
 * Check if an error is an OpenAutocoderError
 */
export function isOpenAutocoderError(
  error: unknown
): error is OpenAutocoderError {
  return error instanceof OpenAutocoderError;
}

/**
 * Wrap unknown errors in OpenAutocoderError
 */
export function wrapError(error: unknown, context: string): OpenAutocoderError {
  if (isOpenAutocoderError(error)) {
    return error;
  }

  const cause = error instanceof Error ? error : new Error(String(error));
  return new OpenAutocoderError(`${context}: ${cause.message}`, "UNKNOWN_ERROR", {
    cause,
  });
}
