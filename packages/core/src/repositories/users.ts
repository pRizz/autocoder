/**
 * User repository - handles all user database operations for authentication
 */

import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import type { DatabaseConnection } from "../db/connection.js";
import { users, type User, type NewUser } from "../db/schema.js";
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidCredentialsError,
  ValidationError,
} from "../errors/index.js";
import { logger } from "../utils/logger.js";

/**
 * Hash a password using SHA-256 with salt
 * Note: For production, use bcrypt or argon2. SHA-256 is used here for simplicity
 * and to avoid additional dependencies.
 */
function hashPassword(password: string, salt: string): string {
  return createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

/**
 * Generate a cryptographically secure token
 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export interface LoginResult {
  user: Omit<User, "passwordHash">;
  token: string;
}

export class UserRepository {
  constructor(private readonly db: DatabaseConnection) {}

  /**
   * Create a new user
   */
  async create(input: {
    username: string;
    password: string;
    email?: string;
    role?: string;
  }): Promise<Omit<User, "passwordHash">> {
    // Validate username
    if (!input.username || input.username.length < 3) {
      throw new ValidationError("Username must be at least 3 characters", "username");
    }
    if (input.username.length > 50) {
      throw new ValidationError("Username must be at most 50 characters", "username");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(input.username)) {
      throw new ValidationError(
        "Username can only contain letters, numbers, underscores, and hyphens",
        "username"
      );
    }

    // Validate password
    if (!input.password || input.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters", "password");
    }

    const now = new Date().toISOString();

    // Check for duplicate username
    const existing = this.db
      .select()
      .from(users)
      .where(eq(users.username, input.username))
      .get();

    if (existing) {
      throw new UserAlreadyExistsError(input.username);
    }

    // Generate salt and hash password
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(input.password, salt) + ":" + salt;

    const result = this.db
      .insert(users)
      .values({
        username: input.username,
        passwordHash,
        email: input.email ?? null,
        role: input.role ?? "user",
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    logger.info("User created", { username: result.username, role: result.role });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  /**
   * Get a user by username (without password hash)
   */
  async getByUsername(username: string): Promise<Omit<User, "passwordHash">> {
    const user = this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user) {
      throw new UserNotFoundError(username);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get a user by ID (without password hash)
   */
  async getById(id: number): Promise<Omit<User, "passwordHash">> {
    const user = this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get();

    if (!user) {
      throw new UserNotFoundError(`ID ${id}`);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Authenticate user with username and password
   * Returns user info and a session token on success
   */
  async login(username: string, password: string): Promise<LoginResult> {
    // Validate input
    if (!username || !password) {
      throw new ValidationError("Username and password are required");
    }

    // Get user with password hash
    const user = this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user) {
      // Use same error message for both cases to prevent user enumeration
      logger.warn("Login attempt for non-existent user", { username });
      throw new InvalidCredentialsError();
    }

    // Verify password
    const [storedHash, salt] = user.passwordHash.split(":");
    if (!salt) {
      logger.error("Invalid password hash format for user", { username });
      throw new InvalidCredentialsError();
    }

    const inputHash = hashPassword(password, salt);
    if (inputHash !== storedHash) {
      logger.warn("Invalid password attempt", { username });
      throw new InvalidCredentialsError();
    }

    // Generate token
    const token = generateToken();

    logger.info("User logged in successfully", { username, userId: user.id });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * List all users (without password hashes)
   */
  async list(): Promise<Omit<User, "passwordHash">[]> {
    const allUsers = this.db.select().from(users).all();
    return allUsers.map(({ passwordHash: _, ...user }) => user);
  }

  /**
   * Update user
   */
  async update(
    username: string,
    input: {
      email?: string;
      password?: string;
      role?: string;
    }
  ): Promise<Omit<User, "passwordHash">> {
    const now = new Date().toISOString();

    // Ensure user exists
    const existing = this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!existing) {
      throw new UserNotFoundError(username);
    }

    const updateData: Partial<NewUser> = {
      updatedAt: now,
    };

    if (input.email !== undefined) {
      updateData.email = input.email;
    }
    if (input.role !== undefined) {
      updateData.role = input.role;
    }
    if (input.password !== undefined) {
      if (input.password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters", "password");
      }
      const salt = randomBytes(16).toString("hex");
      updateData.passwordHash = hashPassword(input.password, salt) + ":" + salt;
    }

    const result = this.db
      .update(users)
      .set(updateData)
      .where(eq(users.username, username))
      .returning()
      .get();

    if (!result) {
      throw new UserNotFoundError(username);
    }

    logger.info("User updated", { username });
    const { passwordHash: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  /**
   * Delete a user
   */
  async delete(username: string): Promise<void> {
    const result = this.db
      .delete(users)
      .where(eq(users.username, username))
      .returning()
      .get();

    if (!result) {
      throw new UserNotFoundError(username);
    }

    logger.info("User deleted", { username });
  }
}
