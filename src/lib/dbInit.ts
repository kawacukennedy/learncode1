import { createSampleData } from "./sampleData";
import { db } from "./database";

/**
 * Database initialization and migration system
 */

const DB_VERSION_KEY = "learncode_db_version";
const CURRENT_VERSION = "1.0.0";

interface Migration {
  version: string;
  description: string;
  up: () => void;
  down: () => void;
}

const migrations: Migration[] = [
  {
    version: "1.0.0",
    description: "Initial database setup with sample data",
    up: () => {
      console.log("🔄 Running initial migration...");
      createSampleData();
    },
    down: () => {
      console.log("🔄 Rolling back initial migration...");
      db.clearAllData();
    },
  },
];

export function initializeDatabase(): void {
  try {
    console.log("🚀 Initializing LearnCode database...");

    // Check if database needs initialization
    const currentVersion = localStorage.getItem(DB_VERSION_KEY);

    if (!currentVersion) {
      console.log("📦 Fresh installation detected, setting up database...");
      runMigrations();
      localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
      console.log("✅ Database initialized successfully!");
    } else if (currentVersion !== CURRENT_VERSION) {
      console.log(
        `🔄 Database version mismatch. Current: ${currentVersion}, Required: ${CURRENT_VERSION}`,
      );
      runMigrations(currentVersion);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
      console.log("✅ Database migrated successfully!");
    } else {
      console.log("✅ Database is up to date");
    }

    // Verify database integrity
    verifyDatabaseIntegrity();
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw new Error("Database initialization failed");
  }
}

function runMigrations(fromVersion?: string): void {
  try {
    const migrationsToRun = migrations.filter((migration) => {
      if (!fromVersion) return true;
      return compareVersions(migration.version, fromVersion) > 0;
    });

    migrationsToRun.forEach((migration) => {
      console.log(
        `🔄 Running migration: ${migration.version} - ${migration.description}`,
      );
      migration.up();
    });

    console.log(`✅ Ran ${migrationsToRun.length} migrations`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

function rollbackMigration(toVersion: string): void {
  try {
    const migrationsToRollback = migrations
      .filter((migration) => compareVersions(migration.version, toVersion) > 0)
      .reverse();

    migrationsToRollback.forEach((migration) => {
      console.log(`🔄 Rolling back migration: ${migration.version}`);
      migration.down();
    });

    localStorage.setItem(DB_VERSION_KEY, toVersion);
    console.log(`✅ Rolled back to version ${toVersion}`);
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    throw error;
  }
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA > partB) return 1;
    if (partA < partB) return -1;
  }

  return 0;
}

function verifyDatabaseIntegrity(): void {
  try {
    const stats = db.getStats();
    console.log("📊 Database statistics:", stats);

    // Basic integrity checks
    if (stats.users < 0 || stats.snippets < 0) {
      throw new Error("Invalid database state detected");
    }

    console.log("✅ Database integrity verified");
  } catch (error) {
    console.error("❌ Database integrity check failed:", error);
    throw error;
  }
}

export function resetDatabase(): void {
  try {
    console.log("🔄 Resetting database...");
    db.clearAllData();
    localStorage.removeItem(DB_VERSION_KEY);
    initializeDatabase();
    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    throw error;
  }
}

export function exportDatabase(): string {
  try {
    const data = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      users: db.getUsers(),
      snippets: db.getSnippets(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("❌ Failed to export database:", error);
    throw error;
  }
}

export function importDatabase(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);

    // Validate import data
    if (
      !data.users ||
      !data.snippets ||
      !Array.isArray(data.users) ||
      !Array.isArray(data.snippets)
    ) {
      throw new Error("Invalid import data format");
    }

    // Clear existing data
    db.clearAllData();

    // Import users
    data.users.forEach((user: any) => {
      db.saveUser(user);
    });

    // Import snippets
    data.snippets.forEach((snippet: any) => {
      db.saveSnippet(snippet);
    });

    console.log("✅ Database imported successfully");
  } catch (error) {
    console.error("❌ Failed to import database:", error);
    throw error;
  }
}

export function getDatabaseInfo(): any {
  return {
    version: localStorage.getItem(DB_VERSION_KEY) || "unknown",
    stats: db.getStats(),
    migrations: migrations.map((m) => ({
      version: m.version,
      description: m.description,
    })),
  };
}
