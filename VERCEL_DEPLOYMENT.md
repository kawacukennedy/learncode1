# Vercel Deployment Guide for LearnCode

## 🚀 Quick Deployment

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/learncode)

### Option 2: Manual Deployment

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**

   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## ⚙️ Vercel Configuration Explained

Our `vercel.json` is optimized for React SPA deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/((?!_next|api|assets|favicon.ico|site.webmanifest|robots.txt|sitemap.xml|learncode-icon.svg).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Key Features:

✅ **SPA Routing**: All non-static routes redirect to `index.html`
✅ **Static File Optimization**: Assets are cached for 1 year
✅ **Security Headers**: CSP, HSTS, XSS protection
✅ **Clean URLs**: No `.html` extensions
✅ **Performance**: Optimized caching strategies

## 🛡️ Security Headers

Our configuration includes comprehensive security headers:

- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **HSTS**: Forces HTTPS connections
- **X-Content-Type-Options**: Prevents MIME sniffing

## 📊 Performance Optimization

- **Asset Caching**: 1-year cache for static files
- **Compression**: Automatic gzip/brotli compression
- **CDN**: Global edge network delivery
- **Build Optimization**: Tree-shaking and minification

## 🔧 Environment Variables

For production deployment, set these in Vercel dashboard:

```env
# If using Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret

# Environment
NODE_ENV=production
```

## 📝 Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] Performance monitoring enabled

## 🌐 Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed
5. Wait for SSL certificate provisioning

## 📈 Monitoring

Vercel provides built-in monitoring:

- **Analytics**: Page views and performance metrics
- **Speed Insights**: Core Web Vitals tracking
- **Function Logs**: API route monitoring (if applicable)
- **Error Reporting**: Automatic error tracking

## 🔄 Automatic Deployments

Every push to your main branch will trigger:

1. **Build Process**: TypeScript compilation and bundling
2. **Preview Deployment**: Temporary URL for testing
3. **Production Deployment**: Live site update (on main branch)

## 🆘 Troubleshooting

### Common Issues:

**Build Fails**

```bash
# Solution: Check TypeScript errors
npm run typecheck
```

**404 on Routes**

```bash
# Solution: Verify vercel.json rewrites configuration
# Our config already handles this correctly
```

**Slow Loading**

```bash
# Solution: Check asset optimization
# Our config includes proper caching headers
```

### Getting Help:

- Check Vercel deployment logs
- Review build output for errors
- Verify environment variables
- Test locally with `npm run preview`

## 🎯 Production URLs

After deployment, your app will be available at:

- **Production**: `https://your-app.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)
- **Preview**: `https://your-app-git-branch.vercel.app` (for branches)

Your LearnCode app is now live and ready for users! 🎉
