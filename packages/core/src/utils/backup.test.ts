/**
 * Unit tests for database backup utility
 * Feature #139 - Database backup before destructive operations
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  createBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  getBackupDirectory,
} from "./backup.js";

describe("Database Backup Utility", () => {
  let tempDir: string;
  let testDbPath: string;

  beforeEach(() => {
    // Create a temporary directory for tests
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "backup-test-"));
    testDbPath = path.join(tempDir, "test.db");

    // Create a test database file with some content
    fs.writeFileSync(testDbPath, "test database content");
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("getBackupDirectory", () => {
    it("should return .backups directory path relative to database", () => {
      const backupDir = getBackupDirectory(testDbPath);
      expect(backupDir).toBe(path.join(tempDir, ".backups"));
    });
  });

  describe("createBackup", () => {
    it("should create a backup file with timestamp", () => {
      const result = createBackup(testDbPath, "test operation");

      expect(result).toBeDefined();
      expect(result.backupPath).toContain(".backups");
      expect(result.backupPath).toContain("test_");
      expect(result.backupPath).toContain(".backup");
      expect(result.timestamp).toBeDefined();
      expect(result.sizeBytes).toBeGreaterThan(0);

      // Verify backup file exists
      expect(fs.existsSync(result.backupPath)).toBe(true);

      // Verify content matches original
      const backupContent = fs.readFileSync(result.backupPath, "utf-8");
      const originalContent = fs.readFileSync(testDbPath, "utf-8");
      expect(backupContent).toBe(originalContent);
    });

    it("should create backups directory if it does not exist", () => {
      const backupDir = getBackupDirectory(testDbPath);
      expect(fs.existsSync(backupDir)).toBe(false);

      createBackup(testDbPath, "test operation");

      expect(fs.existsSync(backupDir)).toBe(true);
    });

    it("should backup WAL file if it exists", () => {
      // Create a WAL file
      const walPath = `${testDbPath}-wal`;
      fs.writeFileSync(walPath, "wal content");

      const result = createBackup(testDbPath, "test operation");

      // Verify WAL backup exists
      const walBackupPath = `${result.backupPath}-wal`;
      expect(fs.existsSync(walBackupPath)).toBe(true);

      const walBackupContent = fs.readFileSync(walBackupPath, "utf-8");
      expect(walBackupContent).toBe("wal content");
    });

    it("should backup SHM file if it exists", () => {
      // Create a SHM file
      const shmPath = `${testDbPath}-shm`;
      fs.writeFileSync(shmPath, "shm content");

      const result = createBackup(testDbPath, "test operation");

      // Verify SHM backup exists
      const shmBackupPath = `${result.backupPath}-shm`;
      expect(fs.existsSync(shmBackupPath)).toBe(true);

      const shmBackupContent = fs.readFileSync(shmBackupPath, "utf-8");
      expect(shmBackupContent).toBe("shm content");
    });

    it("should throw error if database file does not exist", () => {
      const nonExistentPath = path.join(tempDir, "nonexistent.db");

      expect(() => createBackup(nonExistentPath, "test")).toThrow(
        "Database file not found"
      );
    });

    it("should create multiple backups with unique timestamps", async () => {
      const result1 = createBackup(testDbPath, "operation 1");

      // Wait a tiny bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const result2 = createBackup(testDbPath, "operation 2");

      expect(result1.backupPath).not.toBe(result2.backupPath);
      expect(fs.existsSync(result1.backupPath)).toBe(true);
      expect(fs.existsSync(result2.backupPath)).toBe(true);
    });
  });

  describe("listBackups", () => {
    it("should return empty array if no backups exist", () => {
      const backups = listBackups(testDbPath);
      expect(backups).toEqual([]);
    });

    it("should return backups sorted by timestamp (newest first)", async () => {
      // Create multiple backups
      createBackup(testDbPath, "operation 1");
      await new Promise((resolve) => setTimeout(resolve, 10));
      createBackup(testDbPath, "operation 2");
      await new Promise((resolve) => setTimeout(resolve, 10));
      const lastBackup = createBackup(testDbPath, "operation 3");

      const backups = listBackups(testDbPath);

      expect(backups.length).toBe(3);
      expect(backups[0]!.path).toBe(lastBackup.backupPath);
    });

    it("should only return backups for the specified database", () => {
      // Create backup for test database
      createBackup(testDbPath, "test operation");

      // Create another database and backup
      const otherDbPath = path.join(tempDir, "other.db");
      fs.writeFileSync(otherDbPath, "other content");
      createBackup(otherDbPath, "other operation");

      const testBackups = listBackups(testDbPath);
      const otherBackups = listBackups(otherDbPath);

      expect(testBackups.length).toBe(1);
      expect(otherBackups.length).toBe(1);
      expect(testBackups[0]!.databaseName).toBe("test");
      expect(otherBackups[0]!.databaseName).toBe("other");
    });
  });

  describe("restoreBackup", () => {
    it("should restore database from backup", () => {
      // Create backup
      const backup = createBackup(testDbPath, "test operation");

      // Modify original database
      fs.writeFileSync(testDbPath, "modified content");
      expect(fs.readFileSync(testDbPath, "utf-8")).toBe("modified content");

      // Restore from backup
      restoreBackup(backup.backupPath, testDbPath);

      // Verify original content is restored
      const restoredContent = fs.readFileSync(testDbPath, "utf-8");
      expect(restoredContent).toBe("test database content");
    });

    it("should restore WAL file if backup has one", () => {
      // Create WAL file and backup
      const walPath = `${testDbPath}-wal`;
      fs.writeFileSync(walPath, "original wal content");
      const backup = createBackup(testDbPath, "test operation");

      // Modify WAL file
      fs.writeFileSync(walPath, "modified wal content");

      // Restore from backup
      restoreBackup(backup.backupPath, testDbPath);

      // Verify WAL is restored
      const restoredWalContent = fs.readFileSync(walPath, "utf-8");
      expect(restoredWalContent).toBe("original wal content");
    });

    it("should remove stale WAL file if backup has no WAL", () => {
      // Create backup without WAL
      const backup = createBackup(testDbPath, "test operation");

      // Create a stale WAL file
      const walPath = `${testDbPath}-wal`;
      fs.writeFileSync(walPath, "stale wal content");
      expect(fs.existsSync(walPath)).toBe(true);

      // Restore from backup (which has no WAL)
      restoreBackup(backup.backupPath, testDbPath);

      // Verify stale WAL is removed
      expect(fs.existsSync(walPath)).toBe(false);
    });

    it("should throw error if backup file does not exist", () => {
      const nonExistentBackup = path.join(tempDir, "nonexistent.backup");

      expect(() => restoreBackup(nonExistentBackup, testDbPath)).toThrow(
        "Backup file not found"
      );
    });
  });

  describe("deleteBackup", () => {
    it("should delete backup file", () => {
      const backup = createBackup(testDbPath, "test operation");
      expect(fs.existsSync(backup.backupPath)).toBe(true);

      deleteBackup(backup.backupPath);

      expect(fs.existsSync(backup.backupPath)).toBe(false);
    });

    it("should delete associated WAL and SHM files", () => {
      // Create WAL and SHM files
      const walPath = `${testDbPath}-wal`;
      const shmPath = `${testDbPath}-shm`;
      fs.writeFileSync(walPath, "wal content");
      fs.writeFileSync(shmPath, "shm content");

      const backup = createBackup(testDbPath, "test operation");

      // Verify backup files exist
      expect(fs.existsSync(`${backup.backupPath}-wal`)).toBe(true);
      expect(fs.existsSync(`${backup.backupPath}-shm`)).toBe(true);

      deleteBackup(backup.backupPath);

      // Verify all backup files are deleted
      expect(fs.existsSync(backup.backupPath)).toBe(false);
      expect(fs.existsSync(`${backup.backupPath}-wal`)).toBe(false);
      expect(fs.existsSync(`${backup.backupPath}-shm`)).toBe(false);
    });

    it("should not throw if backup does not exist", () => {
      const nonExistentBackup = path.join(tempDir, "nonexistent.backup");

      // Should not throw
      expect(() => deleteBackup(nonExistentBackup)).not.toThrow();
    });
  });

  describe("backup cleanup (max backups)", () => {
    it("should keep only 10 most recent backups", async () => {
      // Create 12 backups
      for (let i = 0; i < 12; i++) {
        createBackup(testDbPath, `operation ${i}`);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const backups = listBackups(testDbPath);

      // Should only have 10 backups (cleanup happens after each creation)
      expect(backups.length).toBe(10);
    });
  });
});
