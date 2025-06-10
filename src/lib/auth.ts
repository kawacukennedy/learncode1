import { User, CreateUserData, LoginData, AuthSession } from "@/types";
import { getUsers, saveUser, updateUser } from "./storage";

const SESSION_KEY = "learncode_session";
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKENS_KEY = "learncode_reset_tokens";

interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
}

export function generateId(): string {
  // Generate a more secure ID
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}_${randomPart}`;
}

export function generateResetToken(): string {
  // Generate a secure reset token
  const timestamp = Date.now().toString(36);
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `reset_${timestamp}_${randomPart}`;
}

export function hashPassword(password: string): string {
  // Simple hash simulation for demo - in production use proper hashing like bcrypt
  const salt = "learncode_salt_2024";
  return btoa(password + salt);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Password must contain at least one letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function registerUser(
  userData: CreateUserData,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Validate input data
    if (!userData.name?.trim()) {
      return { success: false, error: "Name is required" };
    }

    if (!userData.email?.trim()) {
      return { success: false, error: "Email is required" };
    }

    if (!validateEmail(userData.email)) {
      return { success: false, error: "Invalid email format" };
    }

    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors.join(". ") };
    }

    const users = getUsers();

    // Check if user already exists
    if (
      users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())
    ) {
      return { success: false, error: "User with this email already exists" };
    }

    const user: User = {
      id: generateId(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashPassword(userData.password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      saveUser(user);
      console.log("✅ User registered successfully:", user.email);
      return { success: true, user };
    } catch (error) {
      console.error("❌ Failed to save user:", error);
      return { success: false, error: "Failed to create user account" };
    }
  } catch (error) {
    console.error("❌ Registration failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration",
    };
  }
}

export async function loginUser(
  loginData: LoginData,
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  try {
    // Validate input data
    if (!loginData.email?.trim()) {
      return { success: false, error: "Email is required" };
    }

    if (!loginData.password) {
      return { success: false, error: "Password is required" };
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === loginData.email.toLowerCase(),
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!verifyPassword(loginData.password, user.password)) {
      return { success: false, error: "Invalid email or password" };
    }

    const session: AuthSession = {
      user,
      token: generateId(),
    };

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          ...session,
          expiresAt: Date.now() + SESSION_TIMEOUT,
        }),
      );

      console.log("✅ User logged in successfully:", user.email);
      return { success: true, session };
    } catch (error) {
      console.error("❌ Failed to save session:", error);
      return { success: false, error: "Failed to create session" };
    }
  } catch (error) {
    console.error("❌ Login failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
}

export function getSession(): AuthSession | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);

    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      console.log("⚠️ Session expired, logging out");
      logout();
      return null;
    }

    return session;
  } catch (error) {
    console.error("❌ Failed to get session:", error);
    logout(); // Clear corrupted session
    return null;
  }
}

export function refreshSession(): boolean {
  try {
    const session = getSession();
    if (!session) return false;

    // Extend session timeout
    const extendedSession = {
      ...session,
      expiresAt: Date.now() + SESSION_TIMEOUT,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(extendedSession));
    return true;
  } catch (error) {
    console.error("❌ Failed to refresh session:", error);
    return false;
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    console.log("✅ User logged out successfully");
  } catch (error) {
    console.error("❌ Failed to logout:", error);
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

// Enhanced password reset functionality
export async function resetPassword(
  email: string,
): Promise<{ success: boolean; error?: string; token?: string }> {
  try {
    if (!email?.trim()) {
      return { success: false, error: "Email is required" };
    }

    if (!validateEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      // For security, we don't reveal if the email exists or not
      // but we still return success to prevent email enumeration
      console.log("⚠️ Password reset attempted for non-existent email:", email);
      return { success: true };
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenData: ResetToken = {
      email: email.toLowerCase(),
      token: resetToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      used: false,
    };

    // Store reset token
    const existingTokens = getResetTokens();

    // Remove any existing tokens for this email
    const filteredTokens = existingTokens.filter(
      (t) => t.email !== email.toLowerCase(),
    );
    filteredTokens.push(tokenData);

    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(filteredTokens));

    // In a real app, this would send an email with the reset link
    // For demo purposes, we'll log it and simulate success
    console.log("🔐 Password reset token generated:", resetToken);
    console.log("📧 Reset link would be sent to:", email);
    console.log(
      "🔗 Reset URL would be:",
      `${window.location.origin}/reset-password?token=${resetToken}`,
    );

    return { success: true, token: resetToken };
  } catch (error) {
    console.error("❌ Password reset failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred during password reset",
    };
  }
}

export function getResetTokens(): ResetToken[] {
  try {
    const data = localStorage.getItem(RESET_TOKENS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Failed to get reset tokens:", error);
    return [];
  }
}

export function validateResetToken(token: string): {
  valid: boolean;
  email?: string;
  error?: string;
} {
  try {
    if (!token) {
      return { valid: false, error: "Reset token is required" };
    }

    const tokens = getResetTokens();
    const tokenData = tokens.find((t) => t.token === token);

    if (!tokenData) {
      return { valid: false, error: "Invalid or expired reset token" };
    }

    if (tokenData.used) {
      return { valid: false, error: "Reset token has already been used" };
    }

    if (Date.now() > tokenData.expiresAt) {
      return { valid: false, error: "Reset token has expired" };
    }

    return { valid: true, email: tokenData.email };
  } catch (error) {
    console.error("❌ Failed to validate reset token:", error);
    return { valid: false, error: "Failed to validate reset token" };
  }
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate token
    const tokenValidation = validateResetToken(token);
    if (!tokenValidation.valid) {
      return { success: false, error: tokenValidation.error };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors.join(". ") };
    }

    const email = tokenValidation.email!;
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email);

    if (userIndex === -1) {
      return { success: false, error: "User not found" };
    }

    // Update password
    const success = updateUser(users[userIndex].id, {
      password: hashPassword(newPassword),
    });

    if (!success) {
      return { success: false, error: "Failed to update password" };
    }

    // Mark token as used
    const tokens = getResetTokens();
    const tokenIndex = tokens.findIndex((t) => t.token === token);
    if (tokenIndex !== -1) {
      tokens[tokenIndex].used = true;
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    }

    console.log("✅ Password reset successfully for user:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to reset password with token:", error);
    return {
      success: false,
      error: "An unexpected error occurred while resetting password",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, "name">>,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    if (updates.name !== undefined) {
      if (!updates.name?.trim()) {
        return { success: false, error: "Name cannot be empty" };
      }
      updates.name = updates.name.trim();
    }

    const success = updateUser(userId, updates);

    if (!success) {
      return { success: false, error: "Failed to update user profile" };
    }

    // Get updated user
    const users = getUsers();
    const updatedUser = users.find((u) => u.id === userId);

    if (!updatedUser) {
      return { success: false, error: "User not found after update" };
    }

    // Update session if it's the current user
    const session = getSession();
    if (session && session.user.id === userId) {
      const newSession = {
        ...session,
        user: updatedUser,
        expiresAt: Date.now() + SESSION_TIMEOUT,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    }

    console.log("✅ User profile updated successfully:", userId);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("❌ Failed to update user profile:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating profile",
    };
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId || !currentPassword || !newPassword) {
      return { success: false, error: "All fields are required" };
    }

    const users = getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!verifyPassword(currentPassword, user.password)) {
      return { success: false, error: "Current password is incorrect" };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors.join(". ") };
    }

    const success = updateUser(userId, {
      password: hashPassword(newPassword),
    });

    if (!success) {
      return { success: false, error: "Failed to update password" };
    }

    console.log("✅ Password changed successfully for user:", userId);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to change password:", error);
    return {
      success: false,
      error: "An unexpected error occurred while changing password",
    };
  }
}

// Security utility functions
export function sanitizeUserInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function validateSessionToken(token: string): boolean {
  // In a real app, you'd validate the token against a secret
  return typeof token === "string" && token.length > 10;
}

// Rate limiting (simple implementation)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(email: string): {
  allowed: boolean;
  resetTime?: number;
} {
  const MAX_ATTEMPTS = 5;
  const WINDOW_TIME = 15 * 60 * 1000; // 15 minutes

  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset if window has passed
  if (now - attempts.lastAttempt > WINDOW_TIME) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (attempts.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      resetTime: attempts.lastAttempt + WINDOW_TIME,
    };
  }

  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;

  return { allowed: true };
}

// Clean up expired reset tokens
export function cleanupExpiredTokens(): void {
  try {
    const tokens = getResetTokens();
    const now = Date.now();
    const validTokens = tokens.filter((t) => now < t.expiresAt && !t.used);
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(validTokens));
    console.log("🧹 Cleaned up expired reset tokens");
  } catch (error) {
    console.error("❌ Failed to cleanup expired tokens:", error);
  }
}
