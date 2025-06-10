# Database Migration Guide for Vercel Deployment

## Current State

- Using `localStorage` for client-side data persistence
- Mock database system with sample data
- No real backend or database

## Target State

- Real database with persistent storage
- API routes for CRUD operations
- User authentication with sessions
- Scalable architecture for production

## Migration Options

### Option 1: Vercel KV (Redis) - Quick Start ⚡

**Best for**: Rapid prototyping, simple data structures, caching
**Pros**:

- Native Vercel integration
- Very fast setup
- No SQL knowledge required
- Built-in caching

**Cons**:

- Limited query capabilities
- Not ideal for complex relationships
- Storage limitations on free tier

### Option 2: PlanetScale (MySQL) - Production Ready 🚀

**Best for**: Production applications, complex queries, scaling
**Pros**:

- Full MySQL compatibility
- Excellent performance
- Branching for database schema changes
- Generous free tier

**Cons**:

- Requires SQL knowledge
- More setup complexity

### Option 3: Supabase (PostgreSQL) - Full Stack Solution 🔥

**Best for**: Complete backend replacement, real-time features
**Pros**:

- Full PostgreSQL database
- Built-in authentication
- Real-time subscriptions
- Dashboard and admin tools
- Row Level Security

**Cons**:

- More complex setup
- Learning curve for PostgreSQL

### Option 4: Vercel Postgres - Native Solution 💎

**Best for**: Vercel-native PostgreSQL experience
**Pros**:

- Native Vercel integration
- PostgreSQL features
- Seamless deployment

**Cons**:

- Newer service (less mature)
- Limited availability

## Recommended Approach: Supabase

For LearnCode, I recommend **Supabase** because:

1. It provides user authentication out of the box
2. PostgreSQL is perfect for your data structure
3. Real-time features for community updates
4. Generous free tier
5. Easy migration path

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Snippets table
CREATE TABLE snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[], -- PostgreSQL array
  likes INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Likes table (for tracking who liked what)
CREATE TABLE snippet_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(snippet_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_snippets_user_id ON snippets(user_id);
CREATE INDEX idx_snippets_is_public ON snippets(is_public);
CREATE INDEX idx_snippets_language ON snippets(language);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX idx_snippet_likes_snippet_id ON snippet_likes(snippet_id);
```

## Migration Steps

### Step 1: Set up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API key
4. Run the SQL schema above in the Supabase SQL editor

### Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install bcryptjs jsonwebtoken
```

### Step 3: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

### Step 4: Create API Routes

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/snippets` - CRUD operations for snippets
- `/api/snippets/[id]` - Individual snippet operations
- `/api/snippets/like` - Like/unlike snippets

### Step 5: Update Frontend

- Replace localStorage calls with API calls
- Update authentication to use real backend
- Handle loading states and errors properly

## Data Migration Process

### For Existing Users (if any)

1. Export current localStorage data
2. Create migration script to import into database
3. Update user passwords to use proper hashing

### Sample Data Migration

```javascript
// Migration script to convert localStorage data to database
const migrateLocalStorageData = async () => {
  const users = JSON.parse(localStorage.getItem("learncode_users") || "[]");
  const snippets = JSON.parse(
    localStorage.getItem("learncode_snippets") || "[]",
  );

  // Import users and snippets to database
  // Handle password hashing
  // Maintain relationships
};
```

## Deployment Checklist

- [ ] Database schema created
- [ ] Environment variables configured
- [ ] API routes implemented
- [ ] Frontend updated to use APIs
- [ ] Authentication flow working
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Sample data imported
- [ ] Testing completed

## Performance Considerations

1. **Indexing**: Proper indexes on frequently queried columns
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Use Vercel's edge caching for public data
4. **Rate Limiting**: Protect APIs from abuse
5. **Connection Pooling**: Use Supabase's built-in pooling

## Security Considerations

1. **Row Level Security**: Enable RLS in Supabase
2. **Input Validation**: Validate all user inputs
3. **SQL Injection**: Use parameterized queries
4. **Authentication**: Secure JWT tokens
5. **Rate Limiting**: Prevent API abuse

## Cost Estimation

### Supabase (Recommended)

- **Free Tier**: Up to 500MB database, 50K monthly active users
- **Pro Tier**: $25/month for production features
- **Pay-as-you-scale**: Additional usage costs

### Vercel

- **Free Tier**: Sufficient for development and small apps
- **Pro Tier**: $20/month for production features

## Next Steps

1. Choose your database solution
2. Set up the database and schema
3. Implement API routes (I can help with this)
4. Update frontend to use APIs
5. Deploy and test

Would you like me to implement the Supabase integration and API routes for you?
