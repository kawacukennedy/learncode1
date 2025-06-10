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

interface CreateSnippetRequest {
  title: string;
  description?: string;
  code: string;
  language: string;
  isPublic: boolean;
  tags?: string[];
}

interface GetSnippetsQuery {
  public?: string;
  search?: string;
  language?: string;
  limit?: string;
  offset?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET":
        return await handleGetSnippets(req, res);
      case "POST":
        return await handleCreateSnippet(req, res);
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

async function handleGetSnippets(req: NextApiRequest, res: NextApiResponse) {
  const {
    public: publicOnly,
    search,
    language,
    limit,
    offset,
  }: GetSnippetsQuery = req.query;

  const auth = verifyToken(req);

  try {
    let data, error;

    if (search) {
      // Search snippets
      const result = await SupabaseAPI.searchSnippets(
        search,
        auth?.userId,
        publicOnly === "true",
      );
      data = result.data;
      error = result.error;
    } else if (publicOnly === "true") {
      // Get public snippets
      const result = await SupabaseAPI.getPublicSnippets(
        limit ? parseInt(limit) : undefined,
        offset ? parseInt(offset) : undefined,
      );
      data = result.data;
      error = result.error;
    } else if (auth?.userId) {
      // Get user's snippets
      const result = await SupabaseAPI.getUserSnippets(
        auth.userId,
        limit ? parseInt(limit) : undefined,
      );
      data = result.data;
      error = result.error;
    } else {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch snippets",
      });
    }

    // Filter by language if specified
    if (language && language !== "All") {
      data = data?.filter(
        (snippet) => snippet.language.toLowerCase() === language.toLowerCase(),
      );
    }

    // Transform data to match frontend expectations
    const snippets = data?.map((snippet) => ({
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
    }));

    res.status(200).json({
      success: true,
      data: snippets,
    });
  } catch (error) {
    console.error("Get snippets error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch snippets",
    });
  }
}

async function handleCreateSnippet(req: NextApiRequest, res: NextApiResponse) {
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
  }: CreateSnippetRequest = req.body;

  // Validation
  if (!title?.trim() || !code?.trim() || !language?.trim()) {
    return res.status(400).json({
      success: false,
      error: "Title, code, and language are required",
    });
  }

  try {
    const { data: snippet, error } = await SupabaseAPI.createSnippet({
      title: title.trim(),
      description: description?.trim() || null,
      code: code.trim(),
      language: language.trim(),
      is_public: Boolean(isPublic),
      tags: tags || null,
      user_id: auth.userId,
    });

    if (error || !snippet) {
      console.error("Failed to create snippet:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create snippet",
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

    res.status(201).json({
      success: true,
      data: transformedSnippet,
    });
  } catch (error) {
    console.error("Create snippet error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create snippet",
    });
  }
}
