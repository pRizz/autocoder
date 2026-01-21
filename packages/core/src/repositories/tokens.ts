/**
 * Token repository - handles authentication token storage and validation
 */

import { eq, and, gt, lt } from "drizzle-orm";
import { randomBytes } from "crypto";
import type { DatabaseConnection } from "../db/connection.js";
import { tokens, users, type User } from "../db/schema.js";
import { logger } from "../utils/logger.js";

/**
 * Default token expiration time in milliseconds (24 hours)
 */
const DEFAULT_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a cryptographically secure token
 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export interface TokenValidationResult {
  valid: boolean;
  user?: Omit<User, "passwordHash">;
  error?: string;
}

export class TokenRepository {
  constructor(private readonly db: DatabaseConnection) {}

  /**
   * Create a new token for a user
   * @param userId - The user ID to create the token for
   * @param expiresInMs - Token expiration time in milliseconds (default 24 hours)
   * @returns The generated token string
   */
  create(userId: number, expiresInMs: number = DEFAULT_TOKEN_EXPIRY_MS): string {
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMs);

    this.db
      .insert(tokens)
      .values({
        token,
        userId,
        expiresAt: expiresAt.toISOString(),
        createdAt: now.toISOString(),
      })
      .run();

    logger.debug("Token created for user", { userId, expiresAt: expiresAt.toISOString() });
    return token;
  }

  /**
   * Validate a token and return the associated user if valid
   * @param token - The token to validate
   * @returns Validation result with user info if valid
   */
  validate(token: string): TokenValidationResult {
    if (!token) {
      return { valid: false, error: "Token is required" };
    }

    const now = new Date().toISOString();

    // Find token that is not expired
    const tokenRecord = this.db
      .select()
      .from(tokens)
      .where(and(eq(tokens.token, token), gt(tokens.expiresAt, now)))
      .get();

    if (!tokenRecord) {
      logger.debug("Token validation failed: token not found or expired");
      return { valid: false, error: "Invalid or expired token" };
    }

    // Get associated user
    const user = this.db
      .select()
      .from(users)
      .where(eq(users.id, tokenRecord.userId))
      .get();

    if (!user) {
      logger.warn("Token validation failed: user not found", { userId: tokenRecord.userId });
      // Clean up orphaned token
      this.delete(token);
      return { valid: false, error: "User not found" };
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    logger.debug("Token validated successfully", { userId: user.id, username: user.username });

    return { valid: true, user: userWithoutPassword };
  }

  /**
   * Delete a token (logout)
   * @param token - The token to delete
   */
  delete(token: string): void {
    this.db.delete(tokens).where(eq(tokens.token, token)).run();
    logger.debug("Token deleted");
  }

  /**
   * Delete all tokens for a user (logout from all sessions)
   * @param userId - The user ID to delete all tokens for
   */
  deleteAllForUser(userId: number): void {
    this.db.delete(tokens).where(eq(tokens.userId, userId)).run();
    logger.debug("All tokens deleted for user", { userId });
  }

  /**
   * Clean up expired tokens (maintenance task)
   * @returns Number of tokens deleted
   */
  cleanupExpired(): number {
    const now = new Date().toISOString();
    const result = this.db
      .delete(tokens)
      .where(lt(tokens.expiresAt, now))
      .returning()
      .all();

    if (result.length > 0) {
      logger.info("Cleaned up expired tokens", { count: result.length });
    }

    return result.length;
  }

  /**
   * Get all active tokens for a user
   * @param userId - The user ID to get tokens for
   * @returns List of active tokens (without the actual token strings for security)
   */
  getActiveForUser(userId: number): Array<{ id: number; expiresAt: string; createdAt: string }> {
    const now = new Date().toISOString();
    const activeTokens = this.db
      .select({
        id: tokens.id,
        expiresAt: tokens.expiresAt,
        createdAt: tokens.createdAt,
      })
      .from(tokens)
      .where(and(eq(tokens.userId, userId), gt(tokens.expiresAt, now)))
      .all();

    return activeTokens;
  }
}
