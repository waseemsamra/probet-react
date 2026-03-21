# 🔧 Amplify Deployment Fix - SPA Routing Issue

## ❌ Problem
You're getting this error:
```
Unsafe attempt to load URL https://main.d14vrz552522yt.amplifyapp.com/ from frame with URL chrome-error://chromewebdata/. Domains, protocols and ports must match.
```

This is a **React Router + Amplify configuration issue**. The SPA needs redirect rules.

---

## ✅ Solution Applied

### 1. **Updated amplify.yml**
Added `rewrites` section to redirect all routes to `index.html`:

```yaml
rewrites:
  - source: '/**/*'
    target: '/index.html'
```

This tells Amplify to serve `index.html` for ALL routes, letting React Router handle client-side routing.

### 2. **Updated vite.config.js**
Added `base: '/'` to ensure correct path resolution.

---

## 📋 Deployment Steps

### Step 1: Commit and Push Changes
```bash
cd /Users/apple/Downloads/probet/probet-react

git add amplify.yml vite.config.js
git commit -m "Fix Amplify SPA routing configuration"
git push origin main
```

### Step 2: Amplify Will Auto-Deploy
1. Go to **AWS Amplify Console**
2. Select your app: `probet-react`
3. It will automatically detect the push and start building
4. Wait for deployment (~2-3 minutes)

### Step 3: Test Your App
Your app should now work at:
- **Main URL:** https://main.d14vrz552522yt.amplifyapp.com/
- **All routes should work:**
  - `/` (Dashboard)
  - `/analytics`
  - `/casino` (with Blackjack & Lightning Roulette)
  - `/horse-racing`
  - `/football`
  - `/users`
  - `/reports`
  - `/all-sports`

---

## 🔍 Why This Happens

### Without Rewrite Rules:
```
User visits: https://your-app.amplifyapp.com/casino
Amplify looks for: /casino folder/file
Result: 404 or security error ❌
```

### With Rewrite Rules:
```
User visits: https://your-app.amplifyapp.com/casino
Amplify serves: /index.html
React Router takes over: Shows /casino page ✅
```

---

## ⚠️ Additional Checks

### 1. Verify amplify.yml Location
Make sure `amplify.yml` is in the **root** of your repository:
```
probet-react/
├── amplify.yml  ← MUST BE HERE
├── package.json
├── vite.config.js
├── src/
└── dist/
```

### 2. Check Amplify Build Settings
In Amplify Console:
1. Go to **App settings** → **Build settings**
2. Verify `amplify.yml` is detected
3. Build command should be: `npm run build`
4. Output directory should be: `dist`

### 3. Clear Browser Cache
Sometimes the old version is cached:
```
Chrome: Ctrl+Shift+Delete → Clear cache
Or use Incognito mode: Ctrl+Shift+N
```

---

## 🚀 Manual Redeploy (If Needed)

If auto-deploy doesn't work:

1. **Go to Amplify Console**
2. **Select your app**
3. Click **Deploy** → **Redeploy**
4. Wait for completion

---

## ✅ Expected Result

After deployment, you should see:
- ✅ No more "Unsafe attempt" error
- ✅ All pages load correctly
- ✅ Navigation works (sidebar links)
- ✅ Direct URL access works (e.g., /casino)
- ✅ Page refresh works on any route

---

## 📞 Still Having Issues?

### Check Amplify Build Logs:
1. Amplify Console → Your App
2. Click on latest deployment
3. Check **Build** tab for errors
4. Check **Serve** tab for runtime issues

### Common Issues:
| Issue | Solution |
|-------|----------|
| 404 on refresh | ✅ Fixed with rewrites |
| Blank page | Check browser console for errors |
| CSS not loading | Clear cache, check asset paths |
| Router not working | Verify BrowserRouter in App.jsx |

---

## 🎯 Your amplify.yml Now Includes:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
        - key: 'Cross-Origin-Opener-Policy'
          value: 'same-origin'
        - key: 'Cross-Origin-Embedder-Policy'
          value: 'require-corp'
  rewrites:
    - source: '/**/*'
      target: '/index.html'  ← THIS FIXES THE ISSUE
```

---

## 🎉 After Fix, Your App Will Work!

**Push to Git now and Amplify will auto-deploy with the fix!**

```bash
git push origin main
```

Then wait 2-3 minutes for Amplify to build and deploy.
