# 🚨 URGENT FIX - Amplify 404 Error

## Current Issue
You're getting **HTTP 404** at: https://main.d14vrz552522yt.amplifyapp.com/

This means Amplify either:
1. Build is failing
2. Wrong output directory
3. Redirect rules not configured

---

## ✅ STEP-BY-STEP FIX

### Step 1: Verify Local Build Works
```bash
cd /Users/apple/Downloads/probet/probet-react
npm run build
ls dist/
```

You should see:
- `index.html`
- `assets/` folder

✅ **If you see these, build is OK**

---

### Step 2: Check Git Repository

**Is your code pushed to GitHub?**

```bash
cd /Users/apple/Downloads/probet/probet-react
git status
```

If you see changes, commit and push:
```bash
git add .
git commit -m "Fix Amplify deployment"
git push origin main
```

---

### Step 3: Configure Amplify Manually

**Go to AWS Amplify Console:**
1. Visit: https://console.aws.amazon.com/amplify/home
2. Click on your app: `probet-react`
3. Go to **App settings** → **Build settings**

**Verify these settings:**

```
Source code provider: GitHub
Repository: probet-react
Branch: main
Base directory: (leave empty)
Build command: npm run build
Output directory: dist
```

**IMPORTANT:** Click **Save** if you made changes

---

### Step 4: Add Redirect Rules in Amplify Console

**This is the KEY fix:**

1. In Amplify Console, go to **App settings** → **Rewrites and redirects**
2. Click **Create rule** or **Edit**
3. Add this rule:

```
Source: </^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|eot|otf|mp4|webm|ogg|mp3|wav)$)([^.]+)$/>
Target: </index.html>
Status: 200
```

4. Click **Save**

**OR** use simple mode:
```
Source: /*
Target: /index.html
Status: 200 (SPA)
```

---

### Step 5: Redeploy

1. Go to Amplify Console
2. Click **Deploy** → **Redeploy**
3. Wait for build to complete

---

## 🔍 Troubleshooting

### Check Amplify Build Logs

1. Amplify Console → Your App
2. Click on latest deployment
3. Check **Build** tab

**Look for errors like:**
- `npm ci failed` → Node version issue
- `npm run build failed` → Code error
- `dist folder not found` → Wrong output directory

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails at `npm ci` | Delete package-lock.json, push again |
| Build succeeds but 404 | Add redirect rules (Step 4) |
| dist folder empty | Check vite.config.js has correct output |
| CORS errors | Check custom headers in amplify.yml |

---

## 📋 Alternative: Manual Deploy

If auto-deploy keeps failing:

### Option A: AWS CLI Deploy

```bash
# Install AWS CLI
npm install -g @aws-amplify/cli

# Configure
amplify configure

# Initialize
amplify init

# Add hosting
amplify add hosting
  - Choose: Amazon CloudFront and S3
  - Choose: PROD (S3 with CloudFront using HTTPS)

# Deploy
amplify publish
```

### Option B: Manual S3 Upload

1. Build locally: `npm run build`
2. Go to S3 Console
3. Find your Amplify bucket
4. Upload contents of `dist/` folder
5. Set Content-Type headers correctly

---

## ✅ Expected Result After Fix

Your app should work at:
- https://main.d14vrz552522yt.amplifyapp.com/ ✅
- https://main.d14vrz552522yt.amplifyapp.com/casino ✅
- https://main.d14vrz552522yt.amplifyapp.com/analytics ✅

All routes should load without 404!

---

## 🆘 Still Not Working?

### Check These:

1. **Is the repository public?** (or did you connect Amplify to private repo?)
2. **Is the branch correct?** (main vs master)
3. **Are you using the correct AWS region?**
4. **Did you grant Amplify permissions?**

### Get Help:

1. **Amplify Build Logs:** Check for specific error messages
2. **Browser Console:** Press F12, check for errors
3. **Network Tab:** Check which file is returning 404

---

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] Code pushed to GitHub
- [ ] amplify.yml in root directory
- [ ] package.json has `"build": "vite build"`
- [ ] vite.config.js has `base: '/'`
- [ ] dist/ folder exists locally
- [ ] Redirect rules configured in Amplify Console

---

## 📞 Contact Support

If still stuck:
1. AWS Support: https://console.aws.amazon.com/support
2. Amplify Docs: https://docs.amplify.aws/
3. Community: https://discord.gg/amplify

---

**After following these steps, your app WILL work!** 🚀
