import { User, Snippet } from "@/types";
import { db } from "./database";

/**
 * Storage layer with enhanced error handling and data validation
 */

export function getUsers(): User[] {
  return db.getUsers();
}

export function saveUser(user: User): void {
  const success = db.saveUser(user);
  if (!success) {
    throw new Error("Failed to save user");
  }
}

export function updateUser(userId: string, updates: Partial<User>): boolean {
  return db.updateUser(userId, updates);
}

export function getSnippets(): Snippet[] {
  return db.getSnippets();
}

export function saveSnippets(snippets: Snippet[]): void {
  try {
    // Clear existing snippets and save new array
    db.clearAllData();
    snippets.forEach((snippet) => {
      const success = db.saveSnippet(snippet);
      if (!success) {
        console.warn("Failed to save snippet:", snippet.id);
      }
    });
  } catch (error) {
    console.error("Failed to save snippets:", error);
    throw new Error("Failed to save snippets");
  }
}

export function saveSnippet(snippet: Snippet): boolean {
  return db.saveSnippet(snippet);
}

export function updateSnippet(
  snippetId: string,
  updates: Partial<Snippet>,
): boolean {
  return db.updateSnippet(snippetId, updates);
}

export function deleteSnippet(snippetId: string): boolean {
  return db.deleteSnippet(snippetId);
}

export function getUserSnippets(userId: string): Snippet[] {
  try {
    const snippets = getSnippets();
    return snippets.filter((snippet) => snippet.userId === userId);
  } catch (error) {
    console.error("Failed to get user snippets:", error);
    return [];
  }
}

export function getRecentSnippets(
  userId: string,
  limit: number = 4,
): Snippet[] {
  try {
    const userSnippets = getUserSnippets(userId);
    return userSnippets
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  } catch (error) {
    console.error("Failed to get recent snippets:", error);
    return [];
  }
}

export function getPublicSnippets(): Snippet[] {
  try {
    const allSnippets = getSnippets();
    const users = getUsers();

    return allSnippets
      .filter((snippet) => snippet.isPublic)
      .map((snippet) => {
        const user = users.find((u) => u.id === snippet.userId);
        return {
          ...snippet,
          userName: user?.name || "Unknown User",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  } catch (error) {
    console.error("Failed to get public snippets:", error);
    return [];
  }
}

export function searchSnippets(userId: string, query: string): Snippet[] {
  try {
    if (!query.trim()) return [];

    const userSnippets = getUserSnippets(userId);
    const lowerQuery = query.toLowerCase();

    return userSnippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(lowerQuery) ||
        snippet.language.toLowerCase().includes(lowerQuery) ||
        snippet.description.toLowerCase().includes(lowerQuery) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  } catch (error) {
    console.error("Failed to search snippets:", error);
    return [];
  }
}

export function searchAllPublicSnippets(query: string): Snippet[] {
  try {
    if (!query.trim()) return [];

    const publicSnippets = getPublicSnippets();
    const lowerQuery = query.toLowerCase();

    return publicSnippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(lowerQuery) ||
        snippet.language.toLowerCase().includes(lowerQuery) ||
        snippet.description.toLowerCase().includes(lowerQuery) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        snippet.userName?.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    console.error("Failed to search public snippets:", error);
    return [];
  }
}

export function getSnippetsByLanguage(language: string): Snippet[] {
  try {
    const allSnippets = getSnippets();
    return allSnippets.filter(
      (snippet) => snippet.language.toLowerCase() === language.toLowerCase(),
    );
  } catch (error) {
    console.error("Failed to get snippets by language:", error);
    return [];
  }
}

export function getPopularSnippets(limit: number = 10): Snippet[] {
  try {
    const publicSnippets = getPublicSnippets();
    return publicSnippets.sort((a, b) => b.likes - a.likes).slice(0, limit);
  } catch (error) {
    console.error("Failed to get popular snippets:", error);
    return [];
  }
}

export function getLanguageStats(): Record<string, number> {
  try {
    const allSnippets = getSnippets();
    const stats: Record<string, number> = {};

    allSnippets.forEach((snippet) => {
      stats[snippet.language] = (stats[snippet.language] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Failed to get language stats:", error);
    return {};
  }
}

export function getDatabaseStats() {
  return db.getStats();
}

export function createBackup(): void {
  db.createBackup();
}

export function restoreFromBackup(): boolean {
  return db.restoreFromBackup();
}

export function clearAllData(): void {
  db.clearAllData();
}
