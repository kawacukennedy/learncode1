import { User, Snippet } from "@/types";
import { hashPassword, generateId } from "./auth";

export function createSampleData() {
  // Only create sample data if storage is empty
  const existingUsers = localStorage.getItem("learncode_users");
  const existingSnippets = localStorage.getItem("learncode_snippets");

  if (existingUsers || existingSnippets) {
    return; // Data already exists
  }

  // Sample users
  const sampleUsers: User[] = [
    {
      id: "user1",
      name: "Alex Johnson",
      email: "alex@example.com",
      password: hashPassword("demo123"),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user2",
      name: "Sarah Chen",
      email: "sarah@example.com",
      password: hashPassword("demo123"),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user3",
      name: "Mike Rodriguez",
      email: "mike@example.com",
      password: hashPassword("demo123"),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Sample snippets
  const sampleSnippets: Snippet[] = [
    {
      id: generateId(),
      title: "React useState Hook Example",
      description:
        "A simple example of how to use the useState hook in React with proper typing.",
      code: `import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Counter;`,
      language: "TypeScript",
      tags: ["react", "hooks", "typescript", "counter"],
      isPublic: true,
      likes: 15,
      userId: "user1",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "Python Data Processing",
      description:
        "Efficient data processing with pandas and numpy for large datasets.",
      code: `import pandas as pd
import numpy as np
from typing import List, Dict, Any

def process_data(file_path: str) -> pd.DataFrame:
    """
    Process CSV data with cleaning and transformation
    """
    # Read data
    df = pd.read_csv(file_path)

    # Clean data
    df = df.dropna()
    df = df.drop_duplicates()

    # Transform data
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])

    # Add computed columns
    if 'price' in df.columns and 'quantity' in df.columns:
        df['total'] = df['price'] * df['quantity']

    return df

def aggregate_by_category(df: pd.DataFrame,
                         category_col: str,
                         value_col: str) -> Dict[str, Any]:
    """
    Create aggregated statistics by category
    """
    return {
        'sum': df.groupby(category_col)[value_col].sum().to_dict(),
        'mean': df.groupby(category_col)[value_col].mean().to_dict(),
        'count': df.groupby(category_col).size().to_dict()
    }`,
      language: "Python",
      tags: ["pandas", "numpy", "data-science", "csv"],
      isPublic: true,
      likes: 23,
      userId: "user2",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "CSS Grid Layout Pattern",
      description:
        "A responsive grid layout using CSS Grid with auto-fit and minmax.",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.grid-item h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.grid-item p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }

  .grid-item {
    padding: 1.5rem;
  }
}`,
      language: "CSS",
      tags: ["css-grid", "responsive", "layout", "hover-effects"],
      isPublic: true,
      likes: 18,
      userId: "user1",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "JavaScript Debounce Function",
      description:
        "A utility function to debounce API calls and prevent excessive requests.",
      code: `/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time the debounced
 * function was invoked.
 */
function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

// Usage examples:

// Debounce search input
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((e) => {
  console.log('Searching for:', e.target.value);
  // Make API call here
}, 300);

searchInput.addEventListener('input', debouncedSearch);

// Debounce window resize
const debouncedResize = debounce(() => {
  console.log('Window resized to:', window.innerWidth, window.innerHeight);
  // Handle resize logic here
}, 250);

window.addEventListener('resize', debouncedResize);

// Debounce button clicks (immediate execution)
const button = document.querySelector('#submit');
const debouncedSubmit = debounce(() => {
  console.log('Form submitted!');
  // Submit form
}, 1000, true);

button.addEventListener('click', debouncedSubmit);`,
      language: "JavaScript",
      tags: ["utility", "performance", "debounce", "api-calls"],
      isPublic: true,
      likes: 31,
      userId: "user3",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "Go HTTP Server with Middleware",
      description:
        "A simple HTTP server in Go with custom middleware for logging and CORS.",
      code: `package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
)

// Middleware function type
type Middleware func(http.HandlerFunc) http.HandlerFunc

// Logging middleware
func LoggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        log.Printf("Started %s %s", r.Method, r.URL.Path)

        next.ServeHTTP(w, r)

        log.Printf("Completed in %v", time.Since(start))
    }
}

// CORS middleware
func CORSMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    }
}

// Chain multiple middlewares
func ChainMiddleware(middlewares ...Middleware) Middleware {
    return func(next http.HandlerFunc) http.HandlerFunc {
        for i := len(middlewares) - 1; i >= 0; i-- {
            next = middlewares[i](next)
        }
        return next
    }
}

// API response structure
type Response struct {
    Message string      \`json:"message"\`
    Data    interface{} \`json:"data,omitempty"\`
    Error   string      \`json:"error,omitempty"\`
}

// Handler functions
func healthHandler(w http.ResponseWriter, r *http.Request) {
    response := Response{
        Message: "Server is healthy",
        Data:    map[string]string{"status": "ok", "timestamp": time.Now().Format(time.RFC3339)},
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func main() {
    // Apply middleware chain
    middleware := ChainMiddleware(LoggingMiddleware, CORSMiddleware)

    // Register routes with middleware
    http.HandleFunc("/health", middleware(healthHandler))

    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}`,
      language: "Go",
      tags: ["http-server", "middleware", "cors", "logging"],
      isPublic: true,
      likes: 12,
      userId: "user2",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "SQL Query Optimization",
      description:
        "Common SQL query patterns for better performance with proper indexing.",
      code: `-- Example 1: Optimized pagination with OFFSET/LIMIT
-- BAD: This gets slower as offset increases
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;

-- GOOD: Cursor-based pagination
SELECT * FROM users
WHERE created_at < '2023-10-01 12:00:00'
ORDER BY created_at DESC
LIMIT 20;

-- Example 2: Efficient searching with indexes
-- Create composite index for common search patterns
CREATE INDEX idx_users_search ON users (status, created_at, email);

-- Query that uses the index effectively
SELECT user_id, email, created_at
FROM users
WHERE status = 'active'
  AND created_at >= '2023-01-01'
  AND email LIKE 'john%'
ORDER BY created_at DESC;

-- Example 3: Avoiding N+1 queries with JOINs
-- BAD: This creates N+1 queries
SELECT * FROM posts;
-- Then for each post: SELECT * FROM users WHERE id = post.user_id;

-- GOOD: Single query with JOIN
SELECT p.id, p.title, p.content, p.created_at,
       u.id as user_id, u.name as user_name, u.email
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;

-- Example 4: Using EXISTS instead of IN for better performance
-- GOOD: EXISTS is often faster for large datasets
SELECT DISTINCT u.id, u.name
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id
    AND o.created_at >= '2023-01-01'
);

-- Example 5: Aggregation with proper grouping
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE created_at >= '2023-01-01'
  AND status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;`,
      language: "SQL",
      tags: ["optimization", "indexing", "performance", "joins"],
      isPublic: true,
      likes: 27,
      userId: "user3",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "CSS Glassmorphism Effect",
      description:
        "Modern glassmorphism card design with backdrop blur and subtle shadows.",
      code: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 2rem;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}

/* Dark theme variant */
.glass-card-dark {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
      language: "CSS",
      tags: ["glassmorphism", "modern-ui", "animations", "responsive"],
      isPublic: true,
      likes: 42,
      userId: "user2",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "JavaScript Debounce Function",
      description:
        "Essential debounce utility for optimizing search inputs and API calls.",
      code: `// Debounce function to limit API calls
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // Clear previous timeout
    clearTimeout(timeoutId);

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage example with search
const searchInput = document.getElementById('search');
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Make API call here
  fetch(\`/api/search?q=\${query}\`)
    .then(res => res.json())
    .then(data => console.log(data));
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});`,
      language: "JavaScript",
      tags: ["performance", "optimization", "api", "search", "utilities"],
      isPublic: true,
      likes: 38,
      userId: "user1",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      title: "Docker Multi-Stage Build",
      description:
        "Optimize Docker images with multi-stage builds for production deployment.",
      code: `# Multi-stage Docker build for Node.js app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["npm", "start"]`,
      language: "Dockerfile",
      tags: ["docker", "deployment", "optimization", "production", "nodejs"],
      isPublic: true,
      likes: 29,
      userId: "user3",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];

  // Save sample data to localStorage
  localStorage.setItem("learncode_users", JSON.stringify(sampleUsers));
  localStorage.setItem("learncode_snippets", JSON.stringify(sampleSnippets));

  console.log("✨ Sample data created successfully!");
  console.log("Demo accounts:");
  console.log("- alex@example.com / demo123");
  console.log("- sarah@example.com / demo123");
  console.log("- mike@example.com / demo123");
}
