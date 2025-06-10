/**
 * Development utilities for cleaner console output and better dev experience
 */

// Console styling for better dev experience
export const consoleStyles = {
  success: "color: #10b981; font-weight: bold;",
  error: "color: #ef4444; font-weight: bold;",
  warning: "color: #f59e0b; font-weight: bold;",
  info: "color: #3b82f6; font-weight: bold;",
  debug: "color: #8b5cf6; font-weight: bold;",
  feature:
    "color: #06b6d4; font-weight: bold; background: #1e293b; padding: 2px 6px; border-radius: 3px;",
};

// Enhanced console logging for development
export const devLog = {
  success: (message: string, ...args: any[]) => {
    console.log(`%c✅ ${message}`, consoleStyles.success, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`%c❌ ${message}`, consoleStyles.error, ...args);
  },
  warning: (message: string, ...args: any[]) => {
    console.warn(`%c⚠️ ${message}`, consoleStyles.warning, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.info(`%cℹ️ ${message}`, consoleStyles.info, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(`%c🐛 ${message}`, consoleStyles.debug, ...args);
    }
  },
  feature: (message: string, ...args: any[]) => {
    console.log(`%c🚀 ${message}`, consoleStyles.feature, ...args);
  },
};

// Development environment info
export function showDevInfo(): void {
  if (import.meta.env.DEV) {
    console.clear();
    console.log(
      "%c🎯 LearnCode Development Mode",
      "color: #06b6d4; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);",
    );
    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "color: #374151;",
    );
    console.log("%c📱 App Status:", "color: #10b981; font-weight: bold;");
    console.log(
      "%c  • Database: Initialized with sample data",
      "color: #6b7280;",
    );
    console.log("%c  • Authentication: Ready", "color: #6b7280;");
    console.log("%c  • Error Handling: Active", "color: #6b7280;");
    console.log("%c  • Animations: Framer Motion loaded", "color: #6b7280;");
    console.log("");
    console.log("%c🎮 Demo Accounts:", "color: #f59e0b; font-weight: bold;");
    console.log("%c  • alex@example.com / demo123", "color: #6b7280;");
    console.log("%c  • sarah@example.com / demo123", "color: #6b7280;");
    console.log("%c  • mike@example.com / demo123", "color: #6b7280;");
    console.log("");
    console.log(
      "%c🛠 Development Tools:",
      "color: #8b5cf6; font-weight: bold;",
    );
    console.log("%c  • React DevTools: Available", "color: #6b7280;");
    console.log("%c  • Vite HMR: Active", "color: #6b7280;");
    console.log("%c  • TypeScript: Enabled", "color: #6b7280;");
    console.log("");
    console.log(
      "%c🌟 Tip: Check the Network tab to see data persistence in localStorage!",
      "color: #06b6d4; font-style: italic;",
    );
    console.log(
      "%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "color: #374151;",
    );
  }
}

// Suppress common development warnings
export function suppressDevWarnings(): void {
  if (import.meta.env.DEV) {
    // Suppress React DevTools message in console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === "string" &&
        (message.includes("Download the React DevTools") ||
          message.includes("React DevTools") ||
          message.includes("development experience"))
      ) {
        return; // Suppress this warning
      }
      originalWarn.apply(console, args);
    };

    // Suppress frame options warning
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === "string" && message.includes("X-Frame-Options")) {
        return; // Suppress this error
      }
      originalError.apply(console, args);
    };
  }
}

// Development performance monitoring
export function monitorPerformance(): void {
  if (import.meta.env.DEV && "performance" in window) {
    // Monitor page load performance
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          const domContentLoaded =
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart;

          devLog.info("Performance Metrics:", {
            "Load Time": `${loadTime.toFixed(2)}ms`,
            "DOM Content Loaded": `${domContentLoaded.toFixed(2)}ms`,
            "DNS Lookup": `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
            "Total Load Time": `${perfData.loadEventEnd - perfData.fetchStart}ms`,
          });
        }
      }, 100);
    });
  }
}

// Keyboard shortcuts for development
export function setupDevShortcuts(): void {
  if (import.meta.env.DEV) {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Shift + D: Show dev info
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        showDevInfo();
      }

      // Ctrl/Cmd + Shift + C: Clear console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        console.clear();
        devLog.info("Console cleared");
      }
    });
  }
}

// Initialize all dev utilities
export function initDevTools(): void {
  if (import.meta.env.DEV) {
    suppressDevWarnings();
    showDevInfo();
    monitorPerformance();
    setupDevShortcuts();

    // Add helpful global functions for debugging
    (window as any).devLog = devLog;
    (window as any).showDevInfo = showDevInfo;
  }
}
