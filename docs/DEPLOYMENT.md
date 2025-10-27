# Deployment Guide

**Last Updated**: 2025-10-24
**Target Platform**: Vercel
**Status**: Production Ready

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Setup](#vercel-setup)
- [Environment Variables](#environment-variables)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Deployment Process](#deployment-process)
- [Rollback Strategy](#rollback-strategy)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Vercel account (free tier works)
- [ ] Supabase project configured
- [ ] OpenAI API key

### Required Tools
- [ ] Node.js 18+ installed
- [ ] npm or pnpm
- [ ] Git
- [ ] Vercel CLI (для локального тестирования)

### Project Requirements
- [ ] All tests passing (`npm test`)
- [ ] TypeScript check passing (`npm run typecheck`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables documented

---

## Vercel Setup

### Step 1: Create Vercel Project

1. **Go to [vercel.com](https://vercel.com/)**
2. **Click "Add New Project"**
3. **Import Git Repository**:
   - Select your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `app` (important!)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Configure Project Settings**:
   - Project Name: `projekt-lena1` (or your choice)
   - Framework: Next.js
   - Node.js Version: 20.x

### Step 2: Get Vercel Credentials

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
cd app
vercel link

# Get org and project IDs
vercel project ls
```

Save these values:
- `VERCEL_ORG_ID` - находится в project settings
- `VERCEL_PROJECT_ID` - находится в project settings
- `VERCEL_TOKEN` - создай в [Account Settings → Tokens](https://vercel.com/account/tokens)

### Step 3: Add GitHub Secrets

Go to GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

---

## Environment Variables

### Production Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

#### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenAI
OPENAI_API_KEY=sk-...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
SENTRY_DSN=https://...  # Sentry error tracking

# Features flags
NEXT_PUBLIC_ENABLE_CHAT_SHARING=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Environment Variable Scopes

Vercel поддерживает 3 scope:
- **Production** - main branch deployment
- **Preview** - PR deployments
- **Development** - local development

Рекомендации:
- Production: используй production Supabase + real OpenAI key
- Preview: используй preview Supabase (если есть) + development OpenAI key
- Development: используй `.env.local` (не коммитить!)

---

## GitHub Actions CI/CD

### Test Workflow

**File**: `.github/workflows/test.yml`

**Triggers**:
- Every push to `main` or `develop`
- Every Pull Request

**Jobs**:
1. **Test** - Runs on Node 18.x and 20.x:
   - TypeScript check
   - Linter
   - Unit tests
   - Build

2. **E2E** - Runs on Node 20.x:
   - Playwright E2E tests
   - Uploads test results

### Deploy Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to `main` → Production deployment
- Pull Request → Preview deployment

**Jobs**:
1. **Preview Deployment** (for PRs):
   - Build with preview environment
   - Deploy to Vercel preview URL
   - Comment PR with preview URL

2. **Production Deployment** (for main):
   - Build with production environment
   - Deploy to production URL
   - Create deployment status

---

## Deployment Process

### Automatic Deployment

#### Production Deployment
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Create Pull Request
gh pr create

# 5. Wait for tests to pass
# 6. Preview deployment will be created automatically
# 7. Test preview deployment

# 8. Merge PR to main
gh pr merge

# 9. Automatic production deployment starts
# 10. Monitor deployment in Vercel dashboard
```

#### Preview Deployment
- Создается автоматически для каждого PR
- URL: `https://your-app-git-[branch]-[team].vercel.app`
- Комментарий в PR с preview URL
- Обновляется при каждом push в PR

### Manual Deployment

```bash
# Deploy to preview
cd app
vercel

# Deploy to production
vercel --prod

# Promote specific deployment
vercel promote <deployment-url>
```

---

## Rollback Strategy

### Quick Rollback

**Via Vercel Dashboard**:
1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

**Via CLI**:
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

### Emergency Rollback

Если production полностью сломан:
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or force push previous commit
git reset --hard <previous-commit>
git push --force origin main
```

⚠️ **Warning**: Force push требует force push rights на main branch!

---

## Monitoring

### Vercel Analytics

**Enable in**: Vercel Dashboard → Analytics

**Metrics**:
- Page views
- Unique visitors
- Top pages
- Device types
- Countries

### Custom Monitoring

**Recommended tools**:
1. **Sentry** - Error tracking
2. **Vercel Web Vitals** - Performance
3. **Google Analytics** - User behavior

See [MONITORING.md](./MONITORING.md) for setup guides.

---

## Troubleshooting

### Build Fails

**Problem**: Build fails with module not found

**Solution**:
```bash
# Check if dependencies are in package.json
# Install missing dependencies
npm install <missing-package>

# Clear Vercel cache
vercel --force
```

### Environment Variables Not Working

**Problem**: Environment variables undefined

**Solution**:
1. Check variable names:
   - Client variables MUST start with `NEXT_PUBLIC_`
   - Server variables accessed via `process.env.VAR_NAME`

2. Verify in Vercel Dashboard:
   - Project → Settings → Environment Variables
   - Check correct environment (Production/Preview/Development)

3. Redeploy:
   ```bash
   vercel --prod --force
   ```

### Supabase Connection Fails

**Problem**: Cannot connect to Supabase

**Solution**:
1. Check Supabase URL and anon key
2. Verify Supabase project is active
3. Check RLS policies allow access
4. Test connection locally first

### Slow Cold Starts

**Problem**: First request takes 10+ seconds

**Solution**:
1. Enable Edge Functions (if possible)
2. Reduce bundle size:
   ```bash
   npm run build:analyze
   ```
3. Use code splitting
4. Implement ISR/SSG where possible

### Preview Deployment Not Created

**Problem**: PR doesn't create preview deployment

**Solution**:
1. Check GitHub Actions log for errors
2. Verify Vercel secrets are set
3. Check Vercel integration enabled:
   - GitHub → Settings → Integrations → Vercel
4. Re-run workflow:
   ```bash
   gh run rerun <run-id>
   ```

---

## Performance Optimization

### Production Checklist

- [ ] Enable gzip/brotli compression
- [ ] Configure CDN caching
- [ ] Optimize images (Next.js Image component)
- [ ] Implement code splitting
- [ ] Use ISR/SSG for static pages
- [ ] Minimize client-side JavaScript
- [ ] Configure proper Cache-Control headers

### Recommended Vercel Settings

```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## Security

### Production Security Checklist

- [ ] All secrets in environment variables
- [ ] No secrets in Git history
- [ ] HTTPS only (Vercel default)
- [ ] Security headers configured (see vercel.json)
- [ ] Rate limiting configured
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] Supabase RLS policies enabled

### Security Headers

Already configured in `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Database Migrations

### Production Migration Process

1. **Test migration locally**:
   ```bash
   npm run db:migrate
   ```

2. **Test on Supabase preview** (if available):
   - Create preview Supabase project
   - Run migration
   - Test thoroughly

3. **Backup production database**:
   - Supabase Dashboard → Database → Backups
   - Create manual backup

4. **Run migration**:
   - Supabase Dashboard → SQL Editor
   - Paste migration SQL
   - Execute

5. **Verify migration**:
   - Check tables created
   - Test application
   - Monitor errors

6. **Rollback plan**:
   - Keep rollback SQL ready
   - Test rollback on preview first

---

## Cost Optimization

### Vercel Pricing Tiers

**Hobby** (Free):
- 100 GB bandwidth/month
- No custom domains limit
- Community support
- **Recommended for**: MVP, personal projects

**Pro** ($20/month):
- 1 TB bandwidth/month
- Password protection
- Analytics
- **Recommended for**: Production apps with traffic

### Cost Reduction Tips

1. **Optimize images** - Use Next.js Image optimizer
2. **Cache aggressively** - Static assets, API responses
3. **Use ISR/SSG** - Reduce function invocations
4. **Monitor bandwidth** - Check Vercel dashboard
5. **Implement rate limiting** - Prevent abuse

---

## Support & Resources

### Official Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Guides](https://supabase.com/docs/guides)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Discord](https://nextjs.org/discord)
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Getting Help
1. Check [Troubleshooting](#troubleshooting) section
2. Search Vercel docs
3. Check GitHub Actions logs
4. Contact Vercel support (Pro plan)

---

## Checklist: First Deployment

Use this checklist for your first production deployment:

### Pre-Deployment
- [ ] All tests passing locally
- [ ] TypeScript check passes
- [ ] Build successful
- [ ] .env.example up to date
- [ ] Documentation updated
- [ ] Security review completed

### Vercel Setup
- [ ] Vercel project created
- [ ] GitHub repository linked
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

### GitHub Actions
- [ ] GitHub secrets configured
- [ ] test.yml workflow added
- [ ] deploy.yml workflow added
- [ ] Test workflow runs successfully

### Post-Deployment
- [ ] Production URL accessible
- [ ] All features working
- [ ] Database connected
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Error tracking configured
- [ ] Monitoring dashboard setup

### Launch Checklist
- [ ] Final smoke test
- [ ] Performance audit (Lighthouse)
- [ ] Security audit
- [ ] Monitor logs for 1 hour
- [ ] Announce launch 🎉

---

**Deployment Status: READY**
**Next: Configure environment variables and deploy!**
