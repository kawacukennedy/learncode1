import { User, Snippet } from "@/types";

/**
 * Database Manager - Handles all localStorage operations with validation and error handling
 */
class DatabaseManager {
  private static instance: DatabaseManager;
  private readonly USERS_KEY = "learncode_users";
  private readonly SNIPPETS_KEY = "learncode_snippets";
  private readonly SESSION_KEY = "learncode_session";
  private readonly BACKUP_KEY = "learncode_backup";

  constructor() {
    this.initializeDatabase();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database with error handling
   */
  private initializeDatabase(): void {
    try {
      // Test localStorage availability
      if (typeof Storage === "undefined") {
        throw new Error("LocalStorage is not supported");
      }

      // Test write/read operations
      const testKey = "learncode_test";
      localStorage.setItem(testKey, "test");
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (testValue !== "test") {
        throw new Error("LocalStorage is not working properly");
      }

      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw new Error("Failed to initialize database");
    }
  }

  /**
   * Create backup of all data
   */
  createBackup(): void {
    try {
      const backup = {
        users: this.getUsers(),
        snippets: this.getSnippets(),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      console.log("✅ Backup created successfully");
    } catch (error) {
      console.error("❌ Failed to create backup:", error);
    }
  }

  /**
   * Restore data from backup
   */
  restoreFromBackup(): boolean {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        console.warn("⚠️ No backup found");
        return false;
      }

      const backup = JSON.parse(backupData);

      if (backup.users && Array.isArray(backup.users)) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(backup.users));
      }

      if (backup.snippets && Array.isArray(backup.snippets)) {
        localStorage.setItem(
          this.SNIPPETS_KEY,
          JSON.stringify(backup.snippets),
        );
      }

      console.log("✅ Data restored from backup");
      return true;
    } catch (error) {
      console.error("❌ Failed to restore from backup:", error);
      return false;
    }
  }

  /**
   * Get all users with validation
   */
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      if (!data) return [];

      const users = JSON.parse(data);
      if (!Array.isArray(users)) {
        console.warn("⚠️ Invalid users data format, resetting...");
        localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        return [];
      }

      // Validate user objects
      return users.filter((user) => this.validateUser(user));
    } catch (error) {
      console.error("❌ Failed to get users:", error);
      return [];
    }
  }

  /**
   * Save user with validation
   */
  saveUser(user: User): boolean {
    try {
      if (!this.validateUser(user)) {
        console.error("❌ Invalid user data");
        return false;
      }

      const users = this.getUsers();

      // Check for duplicate email
      if (users.some((u) => u.email === user.email && u.id !== user.id)) {
        console.error("❌ User with this email already exists");
        return false;
      }

      users.push(user);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      console.log("✅ User saved successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to save user:", error);
      return false;
    }
  }

  /**
   * Update user with validation
   */
  updateUser(userId: string, updates: Partial<User>): boolean {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        console.error("❌ User not found");
        return false;
      }

      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (!this.validateUser(updatedUser)) {
        console.error("❌ Invalid updated user data");
        return false;
      }

      users[userIndex] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      console.log("✅ User updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update user:", error);
      return false;
    }
  }

  /**
   * Get all snippets with validation
   */
  getSnippets(): Snippet[] {
    try {
      const data = localStorage.getItem(this.SNIPPETS_KEY);
      if (!data) return [];

      const snippets = JSON.parse(data);
      if (!Array.isArray(snippets)) {
        console.warn("⚠️ Invalid snippets data format, resetting...");
        localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify([]));
        return [];
      }

      // Validate snippet objects
      return snippets.filter((snippet) => this.validateSnippet(snippet));
    } catch (error) {
      console.error("❌ Failed to get snippets:", error);
      return [];
    }
  }

  /**
   * Save snippet with validation
   */
  saveSnippet(snippet: Snippet): boolean {
    try {
      if (!this.validateSnippet(snippet)) {
        console.error("❌ Invalid snippet data");
        return false;
      }

      const snippets = this.getSnippets();
      snippets.push(snippet);
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
      console.log("✅ Snippet saved successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to save snippet:", error);
      return false;
    }
  }

  /**
   * Update snippet with validation
   */
  updateSnippet(snippetId: string, updates: Partial<Snippet>): boolean {
    try {
      const snippets = this.getSnippets();
      const snippetIndex = snippets.findIndex((s) => s.id === snippetId);

      if (snippetIndex === -1) {
        console.error("❌ Snippet not found");
        return false;
      }

      const updatedSnippet = {
        ...snippets[snippetIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (!this.validateSnippet(updatedSnippet)) {
        console.error("❌ Invalid updated snippet data");
        return false;
      }

      snippets[snippetIndex] = updatedSnippet;
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
      console.log("✅ Snippet updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to update snippet:", error);
      return false;
    }
  }

  /**
   * Delete snippet
   */
  deleteSnippet(snippetId: string): boolean {
    try {
      const snippets = this.getSnippets();
      const filteredSnippets = snippets.filter((s) => s.id !== snippetId);

      if (filteredSnippets.length === snippets.length) {
        console.error("❌ Snippet not found");
        return false;
      }

      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(filteredSnippets));
      console.log("✅ Snippet deleted successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete snippet:", error);
      return false;
    }
  }

  /**
   * Clear all data
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.SNIPPETS_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      console.log("✅ All data cleared successfully");
    } catch (error) {
      console.error("❌ Failed to clear data:", error);
    }
  }

  /**
   * Get database statistics
   */
  getStats(): {
    users: number;
    snippets: number;
    publicSnippets: number;
    totalSize: string;
  } {
    try {
      const users = this.getUsers();
      const snippets = this.getSnippets();
      const publicSnippets = snippets.filter((s) => s.isPublic);

      // Calculate approximate storage size
      const usersSize = JSON.stringify(users).length;
      const snippetsSize = JSON.stringify(snippets).length;
      const totalBytes = usersSize + snippetsSize;
      const totalSize = this.formatBytes(totalBytes);

      return {
        users: users.length,
        snippets: snippets.length,
        publicSnippets: publicSnippets.length,
        totalSize,
      };
    } catch (error) {
      console.error("❌ Failed to get stats:", error);
      return { users: 0, snippets: 0, publicSnippets: 0, totalSize: "0 B" };
    }
  }

  /**
   * Validate user object
   */
  private validateUser(user: any): user is User {
    return (
      user &&
      typeof user.id === "string" &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      typeof user.password === "string" &&
      typeof user.createdAt === "string" &&
      typeof user.updatedAt === "string" &&
      user.email.includes("@") &&
      user.name.length > 0
    );
  }

  /**
   * Validate snippet object
   */
  private validateSnippet(snippet: any): snippet is Snippet {
    return (
      snippet &&
      typeof snippet.id === "string" &&
      typeof snippet.title === "string" &&
      typeof snippet.description === "string" &&
      typeof snippet.code === "string" &&
      typeof snippet.language === "string" &&
      typeof snippet.userId === "string" &&
      typeof snippet.isPublic === "boolean" &&
      typeof snippet.likes === "number" &&
      typeof snippet.createdAt === "string" &&
      typeof snippet.updatedAt === "string" &&
      Array.isArray(snippet.tags) &&
      snippet.title.length > 0 &&
      snippet.code.length > 0
    );
  }

  /**
   * Format bytes to human readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export singleton instance
export const db = DatabaseManager.getInstance();
