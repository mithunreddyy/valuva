/**
 * Database Backup Utility
 * Production-ready database backup script
 * Creates timestamped backups with compression
 */

import { exec } from "child_process";
import { promisify } from "util";
import { createWriteStream } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { env } from "../config/env";
import { logger } from "../utils/logger.util";
import * as path from "path";
import * as fs from "fs/promises";

const execAsync = promisify(exec);

interface BackupOptions {
  outputDir?: string;
  compress?: boolean;
  includeData?: boolean;
  includeSchema?: boolean;
}

export class DatabaseBackupUtil {
  /**
   * Create database backup
   */
  async createBackup(options: BackupOptions = {}): Promise<string> {
    const {
      outputDir = "./backups",
      compress = true,
      includeData = true,
      includeSchema = true,
    } = options;

    // Parse DATABASE_URL
    const dbUrl = env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }

    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    const dbUser = url.username;
    const dbHost = url.hostname;
    const dbPort = url.port || "5432";
    const dbPassword = url.password;

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true }).catch(() => {
      // Directory might already exist, ignore error
    });

    // Generate backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(
      outputDir,
      `valuva-backup-${timestamp}.sql`
    );
    const finalFile = compress
      ? `${backupFile}.gz`
      : backupFile;

    try {
      // Set PGPASSWORD environment variable
      const env = { ...process.env, PGPASSWORD: dbPassword };

      // Build pg_dump command
      const dumpOptions = [];
      if (includeSchema) dumpOptions.push("--schema-only");
      if (includeData && !includeSchema) dumpOptions.push("--data-only");
      if (!includeSchema && !includeData) {
        throw new Error("At least one of includeSchema or includeData must be true");
      }

      const dumpCommand = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} ${dumpOptions.join(" ")}`;

      logger.info("Starting database backup", {
        database: dbName,
        output: finalFile,
      });

      // Execute pg_dump
      const { stdout } = await execAsync(dumpCommand, { env });

      // Write to file
      if (compress) {
        const { Readable } = require("stream");
        const writeStream = createWriteStream(finalFile);
        const gzipStream = createGzip();
        await pipeline(
          Readable.from([stdout]),
          gzipStream,
          writeStream
        );
      } else {
        await fs.writeFile(backupFile, stdout);
      }

      // Get file size
      const stats = await fs.stat(finalFile);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

      logger.info("Database backup completed", {
        file: finalFile,
        size: `${sizeMB} MB`,
      });

      return finalFile;
    } catch (error) {
      logger.error("Database backup failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(
    backupFile: string,
    options: { dropExisting?: boolean } = {}
  ): Promise<void> {
    const { dropExisting = false } = options;

    const dbUrl = env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }

    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    const dbUser = url.username;
    const dbHost = url.hostname;
    const dbPort = url.port || "5432";
    const dbPassword = url.password;

    try {
      const env = { ...process.env, PGPASSWORD: dbPassword };

      if (dropExisting) {
        logger.warn("Dropping existing database", { database: dbName });
        await execAsync(
          `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -c "DROP DATABASE IF EXISTS ${dbName}; CREATE DATABASE ${dbName};"`,
          { env }
        );
      }

      // Check if file is compressed
      const isCompressed = backupFile.endsWith(".gz");
      let restoreCommand: string;

      if (isCompressed) {
        restoreCommand = `gunzip -c ${backupFile} | psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName}`;
      } else {
        restoreCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < ${backupFile}`;
      }

      logger.info("Starting database restore", {
        file: backupFile,
        database: dbName,
      });

      await execAsync(restoreCommand, { env });

      logger.info("Database restore completed", {
        file: backupFile,
        database: dbName,
      });
    } catch (error) {
      logger.error("Database restore failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * List available backups
   */
  async listBackups(backupDir: string = "./backups"): Promise<
    Array<{ file: string; size: number; date: Date }>
  > {
    try {
      const files = await fs.readdir(backupDir);
      const backups = [];

      for (const file of files) {
        if (file.startsWith("valuva-backup-") && (file.endsWith(".sql") || file.endsWith(".sql.gz"))) {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          backups.push({
            file,
            size: stats.size,
            date: stats.mtime,
          });
        }
      }

      return backups.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      logger.error("Failed to list backups", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Clean old backups (keep last N backups)
   */
  async cleanOldBackups(
    backupDir: string = "./backups",
    keepCount: number = 10
  ): Promise<number> {
    try {
      const backups = await this.listBackups(backupDir);

      if (backups.length <= keepCount) {
        return 0;
      }

      const toDelete = backups.slice(keepCount);
      let deleted = 0;

      for (const backup of toDelete) {
        try {
          await fs.unlink(path.join(backupDir, backup.file));
          deleted++;
          logger.info("Deleted old backup", { file: backup.file });
        } catch (error) {
          logger.error("Failed to delete backup", {
            file: backup.file,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return deleted;
    } catch (error) {
      logger.error("Failed to clean old backups", {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  }
}

// CLI usage
if (require.main === module) {
  const backupUtil = new DatabaseBackupUtil();

  const command = process.argv[2];
  const args = process.argv.slice(3);

  (async () => {
    try {
      switch (command) {
        case "backup":
          const file = await backupUtil.createBackup({
            compress: !args.includes("--no-compress"),
          });
          console.log(`Backup created: ${file}`);
          break;

        case "restore":
          if (!args[0]) {
            throw new Error("Backup file path required");
          }
          await backupUtil.restoreBackup(args[0], {
            dropExisting: args.includes("--drop-existing"),
          });
          console.log("Backup restored successfully");
          break;

        case "list":
          const backups = await backupUtil.listBackups();
          console.table(backups.map((b) => ({
            file: b.file,
            size: `${(b.size / 1024 / 1024).toFixed(2)} MB`,
            date: b.date.toISOString(),
          })));
          break;

        case "clean":
          const keepCount = parseInt(args[0] || "10", 10);
          const deleted = await backupUtil.cleanOldBackups("./backups", keepCount);
          console.log(`Deleted ${deleted} old backup(s)`);
          break;

        default:
          console.log(`
Usage:
  npm run backup:db                    # Create backup
  npm run backup:db restore <file>     # Restore backup
  npm run backup:db list                # List backups
  npm run backup:db clean [count]       # Clean old backups
          `);
      }
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  })();
}

export const databaseBackup = new DatabaseBackupUtil();

