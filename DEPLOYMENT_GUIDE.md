# LearnCode Deployment Guide for Vercel

## 🚀 Production Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name: "LearnCode Production"
3. Select your preferred region
4. Wait for the project to be created

### Step 2: Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Run this SQL to create the database schema:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create snippets table
CREATE TABLE snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create snippet_likes table
CREATE TABLE snippet_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(snippet_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_snippets_user_id ON snippets(user_id);
CREATE INDEX idx_snippets_is_public ON snippets(is_public);
CREATE INDEX idx_snippets_language ON snippets(language);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX idx_snippet_likes_snippet_id ON snippet_likes(snippet_id);

-- Create functions for like counting
CREATE OR REPLACE FUNCTION increment_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets SET likes = likes + 1 WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_snippet_likes(snippet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE snippets SET likes = GREATEST(likes - 1, 0) WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Anyone can read public snippets" ON snippets
  FOR SELECT USING (is_public = true OR auth.uid()::text = user_id);

CREATE POLICY "Users can create own snippets" ON snippets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own snippets" ON snippets
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own snippets" ON snippets
  FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can like public snippets" ON snippet_likes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can unlike their likes" ON snippet_likes
  FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can read likes" ON snippet_likes
  FOR SELECT USING (true);
```

### Step 3: Get Supabase Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy these values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### Step 4: Install Required Dependencies

```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### Step 5: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# Environment
NODE_ENV=production
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control!

### Step 6: Update package.json

Add these dependencies if not already present:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

## 🌍 Vercel Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import your LearnCode project

### Step 2: Configure Environment Variables in Vercel

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add all variables from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_KEY = your-service-key
JWT_SECRET = your-super-secret-jwt-key
NODE_ENV = production
```

### Step 3: Update vercel.json

Ensure your `vercel.json` includes API routes:

```json
{
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api|_next|_static|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 4: Deploy

1. Push your code to GitHub
2. Vercel will automatically deploy
3. Check the deployment logs for any errors

## 🔄 Data Migration from localStorage

### Option 1: Manual Migration Script

Create a migration page in your app:

```typescript
// src/pages/migrate.tsx
export default function MigratePage() {
  const migrateData = async () => {
    const users = JSON.parse(localStorage.getItem("learncode_users") || "[]");
    const snippets = JSON.parse(localStorage.getItem("learncode_snippets") || "[]");

    // Send data to your API for migration
    for (const user of users) {
      await fetch("/api/migrate/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    }

    for (const snippet of snippets) {
      await fetch("/api/migrate/snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snippet),
      });
    }
  };

  return (
    <div>
      <h1>Data Migration</h1>
      <button onClick={migrateData}>Migrate LocalStorage Data</button>
    </div>
  );
}
```

### Option 2: Sample Data Population

Create sample data directly in Supabase:

```sql
-- Insert sample users
INSERT INTO users (id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alex Johnson', 'alex@example.com', '$2a$12$sample_hash_1'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Chen', 'sarah@example.com', '$2a$12$sample_hash_2'),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Rodriguez', 'mike@example.com', '$2a$12$sample_hash_3');

-- Insert sample snippets
INSERT INTO snippets (title, description, code, language, is_public, tags, likes, user_id) VALUES
('React useState Hook', 'Simple counter component using React hooks', 'import React, { useState } from ''react'';...', 'TypeScript', true, ARRAY['react', 'hooks'], 15, '550e8400-e29b-41d4-a716-446655440001'),
('Python Data Processing', 'Efficient data processing with pandas', 'import pandas as pd...', 'Python', true, ARRAY['python', 'data'], 23, '550e8400-e29b-41d4-a716-446655440002');
```

## 🔧 Frontend Updates Required

### Update Authentication

Replace your localStorage auth with API calls:

```typescript
// Update src/lib/auth.ts
export const loginUser = async (credentials: LoginCredentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return await response.json();
};
```

### Update Data Fetching

Replace storage calls with API calls:

```typescript
// Update data fetching in your components
useEffect(() => {
  const fetchSnippets = async () => {
    const response = await fetch("/api/snippets?public=true");
    const data = await response.json();
    setSnippets(data.data);
  };

  fetchSnippets();
}, []);
```

## 🎯 Production Checklist

- [ ] Supabase project created and configured
- [ ] Database schema created
- [ ] Environment variables set in Vercel
- [ ] API routes tested
- [ ] Frontend updated to use APIs
- [ ] Sample data populated
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Error monitoring set up
- [ ] Performance monitoring configured

## 📊 Monitoring and Maintenance

### 1. Supabase Dashboard

Monitor your database:

- Check query performance
- Monitor storage usage
- Review security policies
- Check API usage

### 2. Vercel Dashboard

Monitor your application:

- Check deployment status
- Review function logs
- Monitor bandwidth usage
- Check error rates

### 3. Regular Backups

Supabase provides automatic backups, but you can also:

```bash
# Manual backup
npx supabase db dump > backup.sql

# Restore from backup
psql -h your-host -U postgres -d postgres -f backup.sql
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never expose sensitive keys
2. **JWT Secrets**: Use strong, random secrets
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Implement rate limiting for APIs
6. **Row Level Security**: Use Supabase RLS policies

## 💰 Cost Optimization

### Supabase Free Tier Limits:

- 500MB database storage
- 50K monthly active users
- 2GB bandwidth

### Vercel Free Tier Limits:

- 100GB bandwidth
- 1000 serverless function invocations per day

### Tips to Stay Within Limits:

1. Implement pagination for large datasets
2. Use caching for frequently accessed data
3. Optimize images and assets
4. Monitor usage regularly

## 🆘 Common Issues and Solutions

### Issue: "Cannot connect to database"

**Solution**: Check environment variables and network connectivity

### Issue: "JWT token expired"

**Solution**: Implement token refresh logic

### Issue: "Database connection limit reached"

**Solution**: Use connection pooling (Supabase provides this automatically)

### Issue: "Slow query performance"

**Solution**: Add indexes and optimize queries

---

## Ready to Deploy? 🚀

1. Follow all steps above
2. Test thoroughly in development
3. Deploy to Vercel
4. Monitor the application
5. Iterate based on user feedback

Your LearnCode app will now be production-ready with a real database and scalable architecture!
