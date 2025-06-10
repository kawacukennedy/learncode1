import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabase } from "./lib/dbInit";
import { setupGlobalErrorHandling } from "./lib/errorHandler";
import { initDevTools } from "./lib/devUtils";

// Initialize development tools (only in dev mode)
if (import.meta.env.DEV) {
  initDevTools();
}

// Set up global error handling
setupGlobalErrorHandling();

// Initialize database with proper migration system
try {
  initializeDatabase();
} catch (error) {
  console.error("Failed to initialize database:", error);
  // You could show an error page here or retry logic
}

createRoot(document.getElementById("root")!).render(<App />);
