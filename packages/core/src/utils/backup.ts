/**
 * Database backup utility for open-autocoder
 *
 * Creates backups before destructive operations to enable recovery.
 * Backups are stored in a .backups directory alongside the database file.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { logger } from "./logger.js";
import { DatabaseError } from "../errors/index.js";

/** Maximum number of backups to keep per database */
const MAX_BACKUPS = 10;

/** Backup file extension */
const BACKUP_EXTENSION = ".backup";

export interface BackupResult {
  /** Path to the backup file */
  backupPath: string;
  /** Timestamp when backup was created */
  timestamp: string;
  /** Size of the backup in bytes */
  sizeBytes: number;
}

export interface BackupInfo {
  /** Path to the backup file */
  path: string;
  /** Timestamp from filename */
  timestamp: string;
  /** Size in bytes */
  sizeBytes: number;
  /** Original database name */
  databaseName: string;
}

/**
 * Get the backups directory for a given database path
 */
export function getBackupDirectory(dbPath: string): string {
  const dbDir = path.dirname(dbPath);
  return path.join(dbDir, ".backups");
}

/**
 * Ensure the backups directory exists
 */
function ensureBackupDirectory(dbPath: string): string {
  const backupDir = getBackupDirectory(dbPath);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    logger.info("Created backup directory", { backupDir });
  }

  return backupDir;
}

/**
 * Generate a backup filename with timestamp
 */
function generateBackupFilename(dbPath: string, timestamp: string): string {
  const dbName = path.basename(dbPath, path.extname(dbPath));
  // Replace colons with dashes for Windows compatibility
  const safeTimestamp = timestamp.replace(/:/g, "-");
  return `${dbName}_${safeTimestamp}${BACKUP_EXTENSION}`;
}

/**
 * Create a backup of the database before a destructive operation
 *
 * @param dbPath - Path to the SQLite database file
 * @param operation - Description of the operation (for logging)
 * @returns Backup result with path and metadata
 * @throws DatabaseError if backup fails
 */
export function createBackup(dbPath: string, operation: string): BackupResult {
  const timestamp = new Date().toISOString();

  // Ensure database file exists
  if (!fs.existsSync(dbPath)) {
    throw new DatabaseError(`Database file not found: ${dbPath}`);
  }

  try {
    const backupDir = ensureBackupDirectory(dbPath);
    const backupFilename = generateBackupFilename(dbPath, timestamp);
    const backupPath = path.join(backupDir, backupFilename);

    // Copy the database file
    fs.copyFileSync(dbPath, backupPath);

    // Also backup WAL file if it exists (SQLite WAL mode)
    const walPath = `${dbPath}-wal`;
    if (fs.existsSync(walPath)) {
      fs.copyFileSync(walPath, `${backupPath}-wal`);
    }

    // Also backup SHM file if it exists (SQLite WAL mode)
    const shmPath = `${dbPath}-shm`;
    if (fs.existsSync(shmPath)) {
      fs.copyFileSync(shmPath, `${backupPath}-shm`);
    }

    const stats = fs.statSync(backupPath);

    logger.info("Database backup created", {
      backupPath,
      operation,
      sizeBytes: stats.size,
      timestamp,
    });

    // Clean up old backups
    cleanupOldBackups(dbPath);

    return {
      backupPath,
      timestamp,
      sizeBytes: stats.size,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during backup creation";
    throw new DatabaseError(`Failed to create database backup: ${message}`);
  }
}

/**
 * List all available backups for a database
 *
 * @param dbPath - Path to the SQLite database file
 * @returns Array of backup information sorted by timestamp (newest first)
 */
export function listBackups(dbPath: string): BackupInfo[] {
  const backupDir = getBackupDirectory(dbPath);
  const dbName = path.basename(dbPath, path.extname(dbPath));

  if (!fs.existsSync(backupDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(backupDir);
    const backups: BackupInfo[] = [];

    for (const file of files) {
      // Match backup files for this database
      if (file.startsWith(`${dbName}_`) && file.endsWith(BACKUP_EXTENSION)) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);

        // Extract timestamp from filename
        const match = file.match(
          /^(.+)_(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.\d{3}Z)\.backup$/
        );
        const timestamp = match ? match[2]!.replace(/-/g, (m, offset) =>
          // Convert dashes back to colons in time portion
          offset > 9 ? ":" : m
        ) : "";

        backups.push({
          path: filePath,
          timestamp,
          sizeBytes: stats.size,
          databaseName: dbName,
        });
      }
    }

    // Sort by timestamp descending (newest first)
    return backups.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    logger.error("Failed to list backups", { error, dbPath });
    return [];
  }
}

/**
 * Restore a database from a backup
 *
 * @param backupPath - Path to the backup file
 * @param dbPath - Path to restore to (original database location)
 * @throws DatabaseError if restore fails
 */
export function restoreBackup(backupPath: string, dbPath: string): void {
  if (!fs.existsSync(backupPath)) {
    throw new DatabaseError(`Backup file not found: ${backupPath}`);
  }

  try {
    // Copy backup to database location
    fs.copyFileSync(backupPath, dbPath);

    // Also restore WAL file if backup has one
    const walBackup = `${backupPath}-wal`;
    const walPath = `${dbPath}-wal`;
    if (fs.existsSync(walBackup)) {
      fs.copyFileSync(walBackup, walPath);
    } else if (fs.existsSync(walPath)) {
      // Remove stale WAL if no backup WAL exists
      fs.unlinkSync(walPath);
    }

    // Also restore SHM file if backup has one
    const shmBackup = `${backupPath}-shm`;
    const shmPath = `${dbPath}-shm`;
    if (fs.existsSync(shmBackup)) {
      fs.copyFileSync(shmBackup, shmPath);
    } else if (fs.existsSync(shmPath)) {
      // Remove stale SHM if no backup SHM exists
      fs.unlinkSync(shmPath);
    }

    logger.info("Database restored from backup", { backupPath, dbPath });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during backup restore";
    throw new DatabaseError(`Failed to restore database from backup: ${message}`);
  }
}

/**
 * Delete a specific backup
 *
 * @param backupPath - Path to the backup file to delete
 */
export function deleteBackup(backupPath: string): void {
  try {
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);

      // Also delete WAL and SHM files if they exist
      const walPath = `${backupPath}-wal`;
      const shmPath = `${backupPath}-shm`;

      if (fs.existsSync(walPath)) {
        fs.unlinkSync(walPath);
      }
      if (fs.existsSync(shmPath)) {
        fs.unlinkSync(shmPath);
      }

      logger.info("Backup deleted", { backupPath });
    }
  } catch (error) {
    logger.warn("Failed to delete backup", { backupPath, error });
  }
}

/**
 * Clean up old backups, keeping only the most recent MAX_BACKUPS
 *
 * @param dbPath - Path to the database file
 */
function cleanupOldBackups(dbPath: string): void {
  const backups = listBackups(dbPath);

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);

    for (const backup of toDelete) {
      deleteBackup(backup.path);
    }

    logger.info("Old backups cleaned up", {
      deleted: toDelete.length,
      remaining: MAX_BACKUPS,
    });
  }
}
