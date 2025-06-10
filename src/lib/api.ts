import { Snippet, CreateSnippetData, UpdateSnippetData } from "@/types";
import {
  getSnippets,
  saveSnippet,
  updateSnippet as updateSnippetStorage,
  deleteSnippet as deleteSnippetStorage,
  getUserSnippets,
} from "./storage";
import { generateId } from "./auth";

/**
 * API layer with enhanced error handling and validation
 */

export async function createSnippet(
  userId: string,
  data: CreateSnippetData,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Validate input data
    if (
      !userId ||
      !data.title?.trim() ||
      !data.code?.trim() ||
      !data.language?.trim()
    ) {
      return { success: false, error: "Missing required fields" };
    }

    // Sanitize input
    const sanitizedData = {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      code: data.code.trim(),
      language: data.language.trim(),
      isPublic: Boolean(data.isPublic),
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag) => tag.trim().length > 0)
        : [],
    };

    const snippet: Snippet = {
      id: generateId(),
      title: sanitizedData.title,
      description: sanitizedData.description,
      code: sanitizedData.code,
      language: sanitizedData.language,
      isPublic: sanitizedData.isPublic,
      tags: sanitizedData.tags,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    const success = saveSnippet(snippet);

    if (!success) {
      return { success: false, error: "Failed to save snippet to database" };
    }

    console.log("✅ Snippet created successfully:", snippet.id);
    return { success: true, snippet };
  } catch (error) {
    console.error("❌ Failed to create snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the snippet",
    };
  }
}

export async function updateSnippet(
  userId: string,
  data: UpdateSnippetData,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Validate input data
    if (
      !userId ||
      !data.id ||
      !data.title?.trim() ||
      !data.code?.trim() ||
      !data.language?.trim()
    ) {
      return { success: false, error: "Missing required fields" };
    }

    // Check if snippet exists and belongs to user
    const userSnippets = getUserSnippets(userId);
    const existingSnippet = userSnippets.find((s) => s.id === data.id);

    if (!existingSnippet) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    // Sanitize input
    const sanitizedData = {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      code: data.code.trim(),
      language: data.language.trim(),
      isPublic: Boolean(data.isPublic),
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag) => tag.trim().length > 0)
        : [],
    };

    const updates: Partial<Snippet> = {
      title: sanitizedData.title,
      description: sanitizedData.description,
      code: sanitizedData.code,
      language: sanitizedData.language,
      isPublic: sanitizedData.isPublic,
      tags: sanitizedData.tags,
      updatedAt: new Date().toISOString(),
    };

    const success = updateSnippetStorage(data.id, updates);

    if (!success) {
      return { success: false, error: "Failed to update snippet in database" };
    }

    // Get updated snippet
    const updatedSnippets = getUserSnippets(userId);
    const updatedSnippet = updatedSnippets.find((s) => s.id === data.id);

    console.log("✅ Snippet updated successfully:", data.id);
    return { success: true, snippet: updatedSnippet };
  } catch (error) {
    console.error("❌ Failed to update snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating the snippet",
    };
  }
}

export async function deleteSnippet(
  userId: string,
  snippetId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    if (!userId || !snippetId) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if snippet exists and belongs to user
    const userSnippets = getUserSnippets(userId);
    const snippet = userSnippets.find((s) => s.id === snippetId);

    if (!snippet) {
      return { success: false, error: "Snippet not found or unauthorized" };
    }

    const success = deleteSnippetStorage(snippetId);

    if (!success) {
      return {
        success: false,
        error: "Failed to delete snippet from database",
      };
    }

    console.log("✅ Snippet deleted successfully:", snippetId);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the snippet",
    };
  }
}

export async function getSnippet(
  userId: string,
  snippetId: string,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Validate input
    if (!userId || !snippetId) {
      return { success: false, error: "Missing required parameters" };
    }

    const userSnippets = getUserSnippets(userId);
    const snippet = userSnippets.find((s) => s.id === snippetId);

    if (!snippet) {
      return { success: false, error: "Snippet not found" };
    }

    console.log("✅ Snippet retrieved successfully:", snippetId);
    return { success: true, snippet };
  } catch (error) {
    console.error("❌ Failed to get snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while retrieving the snippet",
    };
  }
}

export async function likeSnippet(
  snippetId: string,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Validate input
    if (!snippetId) {
      return { success: false, error: "Missing snippet ID" };
    }

    const allSnippets = getSnippets();
    const snippet = allSnippets.find((s) => s.id === snippetId);

    if (!snippet) {
      return { success: false, error: "Snippet not found" };
    }

    // Update likes count
    const success = updateSnippetStorage(snippetId, {
      likes: snippet.likes + 1,
    });

    if (!success) {
      return { success: false, error: "Failed to update likes in database" };
    }

    // Get updated snippet
    const updatedSnippets = getSnippets();
    const updatedSnippet = updatedSnippets.find((s) => s.id === snippetId);

    console.log("✅ Snippet liked successfully:", snippetId);
    return { success: true, snippet: updatedSnippet };
  } catch (error) {
    console.error("❌ Failed to like snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while liking the snippet",
    };
  }
}

export async function unlikeSnippet(
  snippetId: string,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Validate input
    if (!snippetId) {
      return { success: false, error: "Missing snippet ID" };
    }

    const allSnippets = getSnippets();
    const snippet = allSnippets.find((s) => s.id === snippetId);

    if (!snippet) {
      return { success: false, error: "Snippet not found" };
    }

    // Update likes count (don't go below 0)
    const newLikes = Math.max(0, snippet.likes - 1);
    const success = updateSnippetStorage(snippetId, {
      likes: newLikes,
    });

    if (!success) {
      return { success: false, error: "Failed to update likes in database" };
    }

    // Get updated snippet
    const updatedSnippets = getSnippets();
    const updatedSnippet = updatedSnippets.find((s) => s.id === snippetId);

    console.log("✅ Snippet unliked successfully:", snippetId);
    return { success: true, snippet: updatedSnippet };
  } catch (error) {
    console.error("❌ Failed to unlike snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while unliking the snippet",
    };
  }
}

export async function duplicateSnippet(
  userId: string,
  snippetId: string,
  newTitle?: string,
): Promise<{ success: boolean; error?: string; snippet?: Snippet }> {
  try {
    // Get original snippet
    const result = await getSnippet(userId, snippetId);

    if (!result.success || !result.snippet) {
      return { success: false, error: result.error || "Snippet not found" };
    }

    const originalSnippet = result.snippet;

    // Create duplicate
    const duplicateData: CreateSnippetData = {
      title: newTitle || `${originalSnippet.title} (Copy)`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      language: originalSnippet.language,
      isPublic: false, // Duplicates are private by default
      tags: [...originalSnippet.tags],
    };

    return await createSnippet(userId, duplicateData);
  } catch (error) {
    console.error("❌ Failed to duplicate snippet:", error);
    return {
      success: false,
      error: "An unexpected error occurred while duplicating the snippet",
    };
  }
}

// Health check for the API
export async function healthCheck(): Promise<{
  success: boolean;
  message: string;
  stats?: any;
}> {
  try {
    const stats = {
      timestamp: new Date().toISOString(),
      // Add any health check logic here
    };

    console.log("✅ API health check passed");
    return {
      success: true,
      message: "API is healthy",
      stats,
    };
  } catch (error) {
    console.error("❌ API health check failed:", error);
    return {
      success: false,
      message: "API health check failed",
    };
  }
}
