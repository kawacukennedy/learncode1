import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface DbUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DbSnippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  is_public: boolean;
  tags: string[] | null;
  likes: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: DbUser; // Joined user data
}

export interface DbSnippetLike {
  id: string;
  snippet_id: string;
  user_id: string;
  created_at: string;
}

// Helper functions for database operations
export class SupabaseAPI {
  // User operations
  static async createUser(email: string, name: string, passwordHash: string) {
    const { data, error } = await supabase
      .from("users")
      .insert({ email, name, password_hash: passwordHash })
      .select()
      .single();

    return { data, error };
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    return { data, error };
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  }

  static async updateUser(id: string, updates: Partial<DbUser>) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }

  // Snippet operations
  static async createSnippet(
    snippet: Omit<DbSnippet, "id" | "created_at" | "updated_at" | "likes">,
  ) {
    const { data, error } = await supabase
      .from("snippets")
      .insert(snippet)
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .single();

    return { data, error };
  }

  static async getSnippetById(id: string) {
    const { data, error } = await supabase
      .from("snippets")
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .eq("id", id)
      .single();

    return { data, error };
  }

  static async getUserSnippets(userId: string, limit?: number) {
    let query = supabase
      .from("snippets")
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async getPublicSnippets(limit?: number, offset?: number) {
    let query = supabase
      .from("snippets")
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async searchSnippets(
    query: string,
    userId?: string,
    publicOnly = false,
  ) {
    let dbQuery = supabase
      .from("snippets")
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,language.ilike.%${query}%`,
      )
      .order("created_at", { ascending: false });

    if (publicOnly) {
      dbQuery = dbQuery.eq("is_public", true);
    }

    if (userId && !publicOnly) {
      dbQuery = dbQuery.eq("user_id", userId);
    }

    const { data, error } = await dbQuery;
    return { data, error };
  }

  static async updateSnippet(
    id: string,
    userId: string,
    updates: Partial<DbSnippet>,
  ) {
    const { data, error } = await supabase
      .from("snippets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId) // Ensure user can only update their own snippets
      .select(
        `
        *,
        user:users(id, name, email)
      `,
      )
      .single();

    return { data, error };
  }

  static async deleteSnippet(id: string, userId: string) {
    const { error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Ensure user can only delete their own snippets

    return { error };
  }

  // Like operations
  static async likeSnippet(snippetId: string, userId: string) {
    const { error: likeError } = await supabase
      .from("snippet_likes")
      .insert({ snippet_id: snippetId, user_id: userId });

    if (likeError) {
      return { error: likeError };
    }

    // Increment likes count
    const { data, error } = await supabase.rpc("increment_snippet_likes", {
      snippet_id: snippetId,
    });

    return { data, error };
  }

  static async unlikeSnippet(snippetId: string, userId: string) {
    const { error: unlikeError } = await supabase
      .from("snippet_likes")
      .delete()
      .eq("snippet_id", snippetId)
      .eq("user_id", userId);

    if (unlikeError) {
      return { error: unlikeError };
    }

    // Decrement likes count
    const { data, error } = await supabase.rpc("decrement_snippet_likes", {
      snippet_id: snippetId,
    });

    return { data, error };
  }

  static async getUserLikedSnippets(userId: string) {
    const { data, error } = await supabase
      .from("snippet_likes")
      .select(
        `
        snippet_id,
        snippets(
          *,
          user:users(id, name, email)
        )
      `,
      )
      .eq("user_id", userId);

    return { data, error };
  }

  static async checkIfUserLikedSnippet(snippetId: string, userId: string) {
    const { data, error } = await supabase
      .from("snippet_likes")
      .select("id")
      .eq("snippet_id", snippetId)
      .eq("user_id", userId)
      .single();

    return { liked: !!data && !error, error };
  }

  // Statistics
  static async getDatabaseStats() {
    const [usersResult, snippetsResult, publicSnippetsResult] =
      await Promise.all([
        supabase.from("users").select("id", { count: "exact" }),
        supabase.from("snippets").select("id", { count: "exact" }),
        supabase
          .from("snippets")
          .select("id", { count: "exact" })
          .eq("is_public", true),
      ]);

    return {
      users: usersResult.count || 0,
      snippets: snippetsResult.count || 0,
      publicSnippets: publicSnippetsResult.count || 0,
    };
  }
}

// SQL functions to create in Supabase (run these in the SQL editor)
export const SUPABASE_FUNCTIONS = `
-- Function to increment snippet likes
CREATE OR REPLACE FUNCTION increment_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets SET likes = likes + 1 WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement snippet likes
CREATE OR REPLACE FUNCTION decrement_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets SET likes = GREATEST(likes - 1, 0) WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Anyone can read public snippets
CREATE POLICY "Anyone can read public snippets" ON snippets
  FOR SELECT USING (is_public = true OR auth.uid()::text = user_id);

-- Users can create their own snippets
CREATE POLICY "Users can create own snippets" ON snippets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own snippets
CREATE POLICY "Users can update own snippets" ON snippets
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own snippets
CREATE POLICY "Users can delete own snippets" ON snippets
  FOR DELETE USING (auth.uid()::text = user_id);

-- Users can like any public snippet
CREATE POLICY "Users can like public snippets" ON snippet_likes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can unlike their own likes
CREATE POLICY "Users can unlike their likes" ON snippet_likes
  FOR DELETE USING (auth.uid()::text = user_id);

-- Anyone can read likes
CREATE POLICY "Anyone can read likes" ON snippet_likes
  FOR SELECT USING (true);
`;
