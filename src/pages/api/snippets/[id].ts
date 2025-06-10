import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { SupabaseAPI } from "@/lib/supabase";

// Middleware to verify JWT token
function verifyToken(req: NextApiRequest): { userId: string } | null {
  try {
    const token =
      req.cookies["auth-token"] || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

interface UpdateSnippetRequest {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  isPublic?: boolean;
  tags?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "Snippet ID is required",
    });
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGetSnippet(req, res, id);
      case "PUT":
        return await handleUpdateSnippet(req, res, id);
      case "DELETE":
        return await handleDeleteSnippet(req, res, id);
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function handleGetSnippet(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) {
  try {
    const { data: snippet, error } = await SupabaseAPI.getSnippetById(id);

    if (error || !snippet) {
      return res.status(404).json({
        success: false,
        error: "Snippet not found",
      });
    }

    // Check if snippet is public or user owns it
    const auth = verifyToken(req);
    if (!snippet.is_public && (!auth || auth.userId !== snippet.user_id)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Transform data to match frontend expectations
    const transformedSnippet = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description || "",
      code: snippet.code,
      language: snippet.language,
      isPublic: snippet.is_public,
      tags: snippet.tags || [],
      likes: snippet.likes,
      userId: snippet.user_id,
      userName: snippet.user?.name || "Unknown User",
      createdAt: snippet.created_at,
      updatedAt: snippet.updated_at,
    };

    res.status(200).json({
      success: true,
      data: transformedSnippet,
    });
  } catch (error) {
    console.error("Get snippet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch snippet",
    });
  }
}

async function handleUpdateSnippet(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) {
  const auth = verifyToken(req);

  if (!auth) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const {
    title,
    description,
    code,
    language,
    isPublic,
    tags,
  }: UpdateSnippetRequest = req.body;

  // Validation
  if (title !== undefined && !title.trim()) {
    return res.status(400).json({
      success: false,
      error: "Title cannot be empty",
    });
  }

  if (code !== undefined && !code.trim()) {
    return res.status(400).json({
      success: false,
      error: "Code cannot be empty",
    });
  }

  if (language !== undefined && !language.trim()) {
    return res.status(400).json({
      success: false,
      error: "Language cannot be empty",
    });
  }

  try {
    // Prepare updates object
    const updates: Partial<any> = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined)
      updates.description = description?.trim() || null;
    if (code !== undefined) updates.code = code.trim();
    if (language !== undefined) updates.language = language.trim();
    if (isPublic !== undefined) updates.is_public = Boolean(isPublic);
    if (tags !== undefined) updates.tags = tags || null;

    const { data: snippet, error } = await SupabaseAPI.updateSnippet(
      id,
      auth.userId,
      updates,
    );

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: "Snippet not found or access denied",
        });
      }
      console.error("Failed to update snippet:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update snippet",
      });
    }

    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: "Snippet not found or access denied",
      });
    }

    // Transform data to match frontend expectations
    const transformedSnippet = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description || "",
      code: snippet.code,
      language: snippet.language,
      isPublic: snippet.is_public,
      tags: snippet.tags || [],
      likes: snippet.likes,
      userId: snippet.user_id,
      userName: snippet.user?.name || "Unknown User",
      createdAt: snippet.created_at,
      updatedAt: snippet.updated_at,
    };

    res.status(200).json({
      success: true,
      data: transformedSnippet,
    });
  } catch (error) {
    console.error("Update snippet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update snippet",
    });
  }
}

async function handleDeleteSnippet(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) {
  const auth = verifyToken(req);

  if (!auth) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  try {
    const { error } = await SupabaseAPI.deleteSnippet(id, auth.userId);

    if (error) {
      console.error("Failed to delete snippet:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete snippet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    console.error("Delete snippet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete snippet",
    });
  }
}
