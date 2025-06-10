/**
 * Comprehensive error handling and logging system
 */

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: "error" | "warning" | "info";
  message: string;
  stack?: string;
  context?: any;
  userId?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private readonly ERRORS_KEY = "learncode_errors";
  private readonly MAX_ERRORS = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Log an error with context
   */
  logError(error: Error | string, context?: any, userId?: string): void {
    try {
      const errorLog: ErrorLog = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        type: "error",
        message: typeof error === "string" ? error : error.message,
        stack: typeof error === "object" ? error.stack : undefined,
        context,
        userId,
      };

      this.saveErrorLog(errorLog);
      console.error("🚨 Error logged:", errorLog);
    } catch (e) {
      console.error("Failed to log error:", e);
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: any, userId?: string): void {
    try {
      const warningLog: ErrorLog = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        type: "warning",
        message,
        context,
        userId,
      };

      this.saveErrorLog(warningLog);
      console.warn("⚠️ Warning logged:", warningLog);
    } catch (e) {
      console.error("Failed to log warning:", e);
    }
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: any, userId?: string): void {
    try {
      const infoLog: ErrorLog = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        type: "info",
        message,
        context,
        userId,
      };

      this.saveErrorLog(infoLog);
      console.info("ℹ️ Info logged:", infoLog);
    } catch (e) {
      console.error("Failed to log info:", e);
    }
  }

  /**
   * Get all error logs
   */
  getErrorLogs(): ErrorLog[] {
    try {
      const data = localStorage.getItem(this.ERRORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to get error logs:", e);
      return [];
    }
  }

  /**
   * Get error logs by type
   */
  getErrorLogsByType(type: "error" | "warning" | "info"): ErrorLog[] {
    return this.getErrorLogs().filter((log) => log.type === type);
  }

  /**
   * Get recent error logs
   */
  getRecentErrorLogs(limit: number = 10): ErrorLog[] {
    return this.getErrorLogs()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Clear all error logs
   */
  clearErrorLogs(): void {
    try {
      localStorage.removeItem(this.ERRORS_KEY);
      console.log("✅ Error logs cleared");
    } catch (e) {
      console.error("Failed to clear error logs:", e);
    }
  }

  /**
   * Export error logs as JSON
   */
  exportErrorLogs(): string {
    return JSON.stringify(this.getErrorLogs(), null, 2);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  } {
    const logs = this.getErrorLogs();
    return {
      total: logs.length,
      errors: logs.filter((l) => l.type === "error").length,
      warnings: logs.filter((l) => l.type === "warning").length,
      info: logs.filter((l) => l.type === "info").length,
    };
  }

  private saveErrorLog(errorLog: ErrorLog): void {
    try {
      let logs = this.getErrorLogs();
      logs.push(errorLog);

      // Keep only the most recent errors
      if (logs.length > this.MAX_ERRORS) {
        logs = logs.slice(-this.MAX_ERRORS);
      }

      localStorage.setItem(this.ERRORS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save error log:", e);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Global error handler
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    errorHandler.logError(`Unhandled promise rejection: ${event.reason}`, {
      reason: event.reason,
    });
  });

  // Handle global errors
  window.addEventListener("error", (event) => {
    errorHandler.logError(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  console.log("✅ Global error handling set up");
}

// Utility functions for common error scenarios
export function handleApiError(error: any, operation: string): string {
  const message =
    error?.message || error?.error || "An unexpected error occurred";
  errorHandler.logError(`API Error in ${operation}: ${message}`, {
    operation,
    error,
  });
  return message;
}

export function handleStorageError(error: any, operation: string): string {
  const message = "Storage operation failed. Please try again.";
  errorHandler.logError(
    `Storage Error in ${operation}: ${error?.message || error}`,
    { operation, error },
  );
  return message;
}

export function handleAuthError(error: any, operation: string): string {
  const message = error?.message || "Authentication failed";
  errorHandler.logError(`Auth Error in ${operation}: ${message}`, {
    operation,
    error,
  });
  return message;
}

export function handleValidationError(
  errors: string[],
  operation: string,
): string {
  const message = errors.join(". ");
  errorHandler.logWarning(`Validation Error in ${operation}: ${message}`, {
    operation,
    errors,
  });
  return message;
}

// Try-catch wrapper with error logging
export async function withErrorHandling<T>(
  operation: () => Promise<T> | T,
  operationName: string,
  userId?: string,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    const message = handleApiError(error, operationName);
    return { success: false, error: message };
  }
}
