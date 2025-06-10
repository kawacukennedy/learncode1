# 🚀 LearnCode

> **Master Code, Share Knowledge** - The ultimate platform for developers to store, share, and discover code snippets.

![LearnCode Banner](https://img.shields.io/badge/LearnCode-Code%20Snippet%20Platform-blue?style=for-the-badge&logo=code&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.11-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.6.2-0055FF?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion/)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎮 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🎨 Components](#-components)
- [🔧 Development](#-development)
- [🌍 Deployment](#-deployment)
- [📊 Database Options](#-database-options)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### 🔐 **Authentication System**

- **Secure Registration/Login** with email and password
- **Session Management** with persistent storage
- **Password Reset** functionality via email
- **Protected Routes** with authentication guards
- **User Profile Management** with editable information

### 📝 **Code Snippet Management**

- **Create, Read, Update, Delete** code snippets
- **20+ Programming Languages** support (JavaScript, Python, TypeScript, etc.)
- **Syntax Highlighting** for better code readability
- **Tag System** for organized categorization
- **Public/Private Visibility** controls
- **Real-time Preview** during creation/editing

### 🌍 **Community Features**

- **Public Snippet Discovery** in the Community Hub
- **Search & Filter** by language, tags, or author
- **Like System** for popular snippets
- **User Attribution** with author names
- **Trending Content** based on likes and recency
- **Community Statistics** and activity tracking

### 🎨 **Modern UI/UX**

- **Dark Theme** optimized for developers
- **Smooth Animations** powered by Framer Motion
- **Glassmorphism Effects** and gradient backgrounds
- **Interactive Elements** with hover states and transitions
- **Loading States** and error handling
- **Toast Notifications** for user feedback

### 📱 **Responsive Design**

- **Mobile-First Approach** with breakpoint optimization
- **Touch-Friendly** interfaces for mobile devices
- **Flexible Layouts** that adapt to any screen size
- **Progressive Web App** capabilities
- **Cross-Browser Compatibility**

### 🛡️ **Production Ready**

- **TypeScript** for type safety
- **Error Boundaries** and comprehensive error handling
- **Input Validation** and sanitization
- **Security Headers** and CSRF protection
- **Performance Optimization** with code splitting
- **SEO Optimization** with meta tags and sitemap

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and interactions
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives

### **State Management**

- **React Context** - Global state management
- **Local Storage** - Client-side data persistence
- **React Query** - Server state management (optional)

### **Development Tools**

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **TypeScript Compiler** - Type checking

### **Production Database Options**

- **Supabase** (PostgreSQL) - Recommended for production
- **PlanetScale** (MySQL) - Scalable database solution
- **Vercel KV** (Redis) - Key-value storage
- **Vercel Postgres** - Native PostgreSQL integration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/learncode.git

# Navigate to project directory
cd learncode

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:8080
```

## 📦 Installation

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** for version control

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/learncode.git
   cd learncode
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   - Open [http://localhost:8080](http://localhost:8080) in your browser
   - The app will automatically reload when you make changes

### Demo Accounts

For testing purposes, use these pre-configured accounts:

| Email               | Password  | Description                      |
| ------------------- | --------- | -------------------------------- |
| `alex@example.com`  | `demo123` | Developer with multiple snippets |
| `sarah@example.com` | `demo123` | Designer with CSS snippets       |
| `mike@example.com`  | `demo123` | Backend engineer with Python/SQL |

## 🎮 Usage

### **Getting Started**

1. **Registration**: Create a new account with email and password
2. **Login**: Access your dashboard with existing credentials
3. **Create Snippets**: Upload your first code snippet
4. **Explore Community**: Discover snippets from other developers
5. **Manage Profile**: Edit your profile and view your snippets

### **Creating Code Snippets**

1. Navigate to **Upload** or click the **Share Code** button
2. Fill in the snippet details:
   - **Title**: Descriptive name for your snippet
   - **Description**: What the code does (optional)
   - **Language**: Select from 20+ programming languages
   - **Tags**: Add relevant tags for categorization
   - **Visibility**: Choose Public (community) or Private (personal)
   - **Code**: Paste or type your code
3. Click **Share Snippet** to save

### **Editing Snippets**

1. Go to your **Profile** page
2. Find the snippet you want to edit
3. Click the **Edit** button (pencil icon)
4. Make your changes in the dialog
5. Click **Update Snippet** to save

### **Community Discovery**

1. Visit the **Explore** page
2. Browse trending and recent snippets
3. Use the search bar to find specific content
4. Filter by programming language
5. Like snippets you find helpful
6. Click on authors to see more of their work

### **Keyboard Shortcuts**

- `Ctrl/Cmd + S` - Save snippet while editing
- `Tab` - Indent code in editor
- `Ctrl/Cmd + Shift + D` - Show developer information
- `Ctrl/Cmd + Shift + C` - Clear console

## 🏗️ Project Structure

```
learncode/
├── public/                    # Static assets
│   ├── favicon.ico           # App favicon
│   ├── learncode-icon.svg    # Custom app icon
│   ├── site.webmanifest      # PWA manifest
│   ├── robots.txt            # SEO robots file
│   └── sitemap.xml           # SEO sitemap
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Radix)
│   │   ├── Layout.tsx       # App layout wrapper
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts           # API functions
│   │   ├── auth.ts          # Authentication logic
│   │   ├── database.ts      # Database management
│   │   ├── storage.ts       # Local storage utilities
│   │   ├── supabase.ts      # Supabase integration
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── devUtils.ts      # Development utilities
│   │   └── sampleData.ts    # Demo data generation
│   ├── pages/               # Application pages
│   │   ├── Landing.tsx      # Homepage
│   │   ├── Login.tsx        # Authentication
│   │   ├── Signup.tsx       # Registration
│   │   ├── ForgotPassword.tsx # Password reset
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── Upload.tsx       # Snippet creation
│   │   ├── Profile.tsx      # User profile
│   │   ├── Explore.tsx      # Community discovery
│   │   └── NotFound.tsx     # 404 page
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type declarations
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── docs/                    # Documentation
│   ├── DATABASE_MIGRATION.md # Database setup guide
│   └── DEPLOYMENT_GUIDE.md   # Production deployment
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

## 🎨 Components

### **Core Components**

- **Layout** - Persistent app shell with navigation and footer
- **ProtectedRoute** - Authentication guard for private pages
- **Button** - Styled button with variants and animations
- **Card** - Container component for content sections
- **Input/Textarea** - Form input components with validation
- **Badge** - Tag display for categories and status
- **Dialog** - Modal dialogs for editing and forms

### **Page Components**

- **Landing** - Marketing homepage with hero section
- **Dashboard** - User dashboard with recent snippets and community highlights
- **Upload** - Snippet creation form with live preview
- **Profile** - User profile management and snippet library
- **Explore** - Community snippet discovery with search and filters

### **Animation Components**

- **Motion Wrappers** - Framer Motion animations for smooth transitions
- **Loading States** - Animated loading indicators
- **Interactive Elements** - Hover effects and micro-interactions

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Building
npm run build        # Build for production
npm run typecheck    # Run TypeScript checks

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run format.fix   # Format code with Prettier
npm run lint         # Run ESLint
```

### **Development Features**

- **Hot Module Replacement** - Instant updates during development
- **TypeScript Integration** - Full type checking and IntelliSense
- **Error Overlay** - Visual error display during development
- **Development Console** - Enhanced logging with colors and emojis
- **Performance Monitoring** - Load time tracking and metrics

### **Environment Variables**

For production deployment, configure these environment variables:

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Authentication
JWT_SECRET=your_jwt_secret_key

# Environment
NODE_ENV=production
```

### **Code Style Guidelines**

- **TypeScript** - All components must be typed
- **Functional Components** - Use React hooks instead of classes
- **Tailwind CSS** - Use utility classes for styling
- **ESLint** - Follow the configured linting rules
- **Prettier** - Auto-format code on save
- **Naming Conventions** - PascalCase for components, camelCase for functions

## 🌍 Deployment

### **Quick Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/learncode)

### **Manual Deployment**

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel**

   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

4. **Set up database** following the [Database Migration Guide](DATABASE_MIGRATION.md)

### **Other Platforms**

- **Netlify**: Connect your GitHub repo and deploy automatically
- **GitHub Pages**: Use `npm run build` and deploy the `dist` folder
- **AWS S3**: Upload the build folder to an S3 bucket
- **Heroku**: Use the Node.js buildpack with a simple server

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 📊 Database Options

LearnCode supports multiple database backends for production deployment:

### **🔥 Supabase (Recommended)**

- **PostgreSQL** with full SQL features
- **Built-in authentication** and real-time subscriptions
- **Row Level Security** for data protection
- **Generous free tier** (500MB, 50K users)

### **⚡ PlanetScale**

- **MySQL** with serverless scaling
- **Database branching** for schema changes
- **Excellent performance** and reliability

### **🚀 Vercel KV**

- **Redis** for simple key-value storage
- **Native Vercel integration**
- **Perfect for caching** and session storage

### **🐘 Vercel Postgres**

- **PostgreSQL** with Vercel integration
- **Seamless deployment** workflow

For detailed setup instructions, see [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md).

## 🔐 Security

### **Authentication Security**

- **Password Hashing** with bcrypt (12 rounds)
- **JWT Tokens** with secure signing
- **Session Management** with automatic expiration
- **Rate Limiting** on authentication endpoints

### **Data Security**

- **Input Validation** and sanitization
- **XSS Protection** with Content Security Policy
- **CSRF Protection** with SameSite cookies
- **SQL Injection Prevention** with parameterized queries

### **Infrastructure Security**

- **HTTPS Everywhere** with automatic redirects
- **Security Headers** (HSTS, X-Frame-Options, etc.)
- **Environment Variables** for sensitive data
- **Row Level Security** in database

## 🤝 Contributing

We welcome contributions to LearnCode! Here's how you can help:

### **Getting Started**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Contribution Guidelines**

- **Code Quality** - Follow ESLint and Prettier configurations
- **Testing** - Add tests for new features
- **Documentation** - Update docs for significant changes
- **Commit Messages** - Use conventional commit format
- **Issues** - Check existing issues before creating new ones

### **Areas for Contribution**

- 🐛 **Bug Fixes** - Help us fix reported issues
- ✨ **New Features** - Add functionality users are requesting
- 📚 **Documentation** - Improve guides and documentation
- 🎨 **UI/UX** - Enhance the user interface and experience
- ⚡ **Performance** - Optimize loading times and responsiveness
- 🔒 **Security** - Strengthen security measures

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 LearnCode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🌟 Acknowledgments

- **React Team** for the amazing framework
- **Vercel** for the deployment platform
- **Supabase** for the backend infrastructure
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations
- **Radix UI** for accessible components
- **The Open Source Community** for inspiration and contributions

---

## 📞 Support

- **Documentation**: Check our [docs](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/your-username/learncode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/learncode/discussions)
- **Email**: support@learncode.dev

---

<div align="center">

**[⬆ Back to Top](#-learncode)**

Made with ❤️ by the LearnCode team

</div>
