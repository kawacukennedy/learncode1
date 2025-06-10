export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName?: string;
  isPublic: boolean;
  likes: number;
  tags: string[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateSnippetData {
  title: string;
  description: string;
  code: string;
  language: string;
  isPublic: boolean;
  tags: string[];
}

export interface UpdateSnippetData extends CreateSnippetData {
  id: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DatabaseStats {
  users: number;
  snippets: number;
  publicSnippets: number;
  totalSize: string;
}

export interface SearchFilters {
  language?: string;
  tags?: string[];
  isPublic?: boolean;
  userId?: string;
  sortBy?: "recent" | "popular" | "title";
  sortOrder?: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Utility types
export type UserPublic = Omit<User, "password">;
export type SnippetPublic = Snippet & { userName: string };
export type CreateSnippetInput = Omit<CreateSnippetData, "userId">;
export type UpdateSnippetInput = Omit<UpdateSnippetData, "userId">;
