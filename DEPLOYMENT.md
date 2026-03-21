# ProBet Admin Dashboard - AWS Amplify Deployment Guide

## ✅ Build Status: READY FOR DEPLOYMENT

### Build Output:
- `dist/index.html` - 0.76 kB
- `dist/assets/index.css` - 77.07 kB (gzipped: 11.93 kB)
- `dist/assets/react-vendor.js` - 47.71 kB (gzipped: 16.70 kB)
- `dist/assets/chart-vendor.js` - 186.06 kB (gzipped: 65.02 kB)
- `dist/assets/index.js` - 401.78 kB (gzipped: 95.36 kB)

**Total Size:** ~635 KB (uncompressed) / ~190 KB (gzipped)

---

## 📋 Deployment Steps

### Option 1: AWS Amplify Console (Recommended - Easiest)

#### Step 1: Push to Git Repository
```bash
cd /Users/apple/Downloads/probet/probet-react

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ProBet React Dashboard"

# Push to GitHub/GitLab/Bitbucket
git remote add origin https://github.com/your-username/probet-react.git
git push -u origin main
```

#### Step 2: Connect to AWS Amplify
1. Go to **AWS Console** → **Amplify** → **Get Started**
2. Choose **Amplify Hosting** (not Amplify Studio)
3. Click **Get Started** under "Host your web app"
4. Select your Git provider (GitHub/GitLab/Bitbucket)
5. Choose your repository: `probet-react`
6. Select branch: `main`

#### Step 3: Configure Build Settings
Amplify will auto-detect the `amplify.yml` file. Verify these settings:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Base directory:** (leave empty)

#### Step 4: Deploy
1. Click **Next**
2. Review settings
3. Click **Save and Deploy**
4. Wait for build to complete (~2-3 minutes)
5. Your app will be live at: `https://main.xxxxx.amplifyapp.com`

---

### Option 2: Manual Deployment (CLI)

#### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify
```bash
cd /Users/apple/Downloads/probet/probet-react
amplify init
```

Follow the prompts:
- Enter a name for your project: `probet-react`
- Choose default editor: `Visual Studio Code`
- Choose app type: `javascript`
- Choose framework: `react`
- Source directory path: `src`
- Distribution directory path: `dist`
- Build command: `npm run build`
- Start command: `npm run dev`

#### Step 3: Add Hosting
```bash
amplify add hosting
```

Select:
- Choose the plugin module: `Amazon CloudFront and S3`
- Select the environment setup: `PROD (S3 with CloudFront using HTTPS)`

#### Step 4: Deploy
```bash
amplify publish
```

Your app will be live at the provided CloudFront URL.

---

## 🔧 Environment Variables (If Needed)

If you need to add API keys or other environment variables:

1. Go to **Amplify Console** → Your App
2. Click **App settings** → **Environment variables**
3. Click **Manage variables**
4. Add your variables:
   - `VITE_API_URL` = your API endpoint
   - `VITE_APP_NAME` = ProBet Dashboard
5. Click **Save**
6. Redeploy (automatic on next push or manual redeploy)

---

## 🚀 Custom Domain Setup

1. Go to **Amplify Console** → Your App
2. Click **Domain management** (left sidebar)
3. Click **Add sub domain**
4. Enter your subdomain (e.g., `dashboard`)
5. Choose your root domain (or connect a new one)
6. Click **Save**
7. Update DNS records as instructed

---

## ⚠️ Common Issues & Solutions

### Issue 1: 404 on Page Refresh
**Solution:** Already configured in `amplify.yml` for SPA routing.

### Issue 2: Build Fails
**Check:**
- Node version (should be 18+)
- Run `npm install` before build
- Check build logs in Amplify Console

### Issue 3: Large Bundle Size
**Current Status:** ✅ Optimized with code splitting
- React vendor chunk: 47 KB
- Chart.js vendor chunk: 186 KB
- Main app chunk: 401 KB

**Further Optimization (Optional):**
```javascript
// In vite.config.js, add more manual chunks
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'chart-vendor': ['chart.js', 'react-chartjs-2'],
  'ui-vendor': ['@headlessui/react', '@heroicons/react'],
}
```

---

## 📊 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] All routes work (`/`, `/analytics`, `/casino`, etc.)
- [ ] Blackjack game loads and plays correctly
- [ ] Charts render properly
- [ ] Sidebar navigation works
- [ ] CSS styles load correctly
- [ ] No console errors
- [ ] Mobile responsive (test on different devices)
- [ ] Custom domain configured (if needed)
- [ ] HTTPS enabled (automatic with Amplify)

---

## 🔗 Useful Links

- **Amplify Console:** https://console.aws.amazon.com/amplify/home
- **Amplify Documentation:** https://docs.amplify.aws/
- **Pricing:** https://aws.amazon.com/amplify/pricing/
  - Free tier: 1000 build-min/month, 5 GB storage, 15 GB served/month
  - Pay as you go: $9/month for first app, then usage-based

---

## 📈 Monitoring & Analytics

After deployment:
1. Enable **AWS CloudWatch** for build logs
2. Set up **Amplify Analytics** for user tracking
3. Configure **Custom Headers** for security
4. Enable **DDoS protection** with AWS Shield

---

## ✅ Ready to Deploy!

Your app is production-ready with:
- ✅ Optimized build (code splitting enabled)
- ✅ amplify.yml configured
- ✅ No build errors
- ✅ All 8 pages functional
- ✅ Tailwind CSS working
- ✅ Chart.js visualizations working
- ✅ React Router configured for SPA

**Next Step:** Push to Git and connect to AWS Amplify!
