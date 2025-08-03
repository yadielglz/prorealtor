# 🚀 Quick Start Guide - Realtor Platform

## 📋 Prerequisites Checklist

Before you begin, make sure you have:
- [ ] **Node.js 18+ installed** - **[INSTALL FIRST - See NODE_SETUP_GUIDE.md](NODE_SETUP_GUIDE.md)**
- [ ] Git installed
- [ ] A Firebase account (free)
- [ ] A Netlify account (free)
- [ ] A code editor (VS Code recommended)

## ⚠️ IMPORTANT: Install Node.js First

**If you don't have Node.js installed, follow the [NODE_SETUP_GUIDE.md](NODE_SETUP_GUIDE.md) first!**

The guide provides 4 different installation methods:
1. **Official Installer** (Recommended) - Download from nodejs.org
2. **Homebrew** (If you have admin access)
3. **nvm** (Best for no admin access)
4. **Volta** (Alternative manager)

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enable Authentication, Firestore, and Storage
4. Go to Project Settings → General → Your apps
5. Click "Web app" and register your app
6. Copy the configuration object

### Step 3: Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # Add other required variables
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

### Step 4: Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the landing page!

## 🔥 Firebase Configuration Details

### Authentication Setup
1. In Firebase Console → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Google" (optional)

### Firestore Setup
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll deploy security rules later)
4. Select your region

### Storage Setup
1. In Firebase Console → Storage
2. Click "Get started"
3. Choose "Start in test mode"
4. Select your region

### Deploy Security Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules,storage
```

## 🌐 Netlify Deployment

### Option 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command: `npm run netlify:build`
6. Set publish directory: `out`
7. Add environment variables in Netlify dashboard

### Option 2: Manual Deployment
```bash
# Build the project
npm run netlify:build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

## 🧪 Test Your Setup

### 1. Check the Landing Page
- Visit `http://localhost:3000`
- Should see the realtor platform homepage
- Navigation should work

### 2. Test Firebase Connection
- Open browser developer tools
- Check console for any Firebase errors
- Should see Firebase initialized successfully

### 3. Test PWA Features
- Open Chrome DevTools → Application → Manifest
- Should see the PWA manifest loaded
- Try "Add to Home Screen" on mobile

## 🔧 Common Issues & Solutions

### TypeScript Errors
**Issue**: Red squiggly lines everywhere
**Solution**: This is normal before `npm install`. Run the install command first.

### Firebase Errors
**Issue**: "Firebase project not found"
**Solution**: Double-check your Firebase project ID in `.env.local`

### Build Errors
**Issue**: Build fails with environment variable errors
**Solution**: Make sure all required environment variables are set

### Netlify Deployment Issues
**Issue**: Site doesn't load after deployment
**Solution**: Check that environment variables are set in Netlify dashboard

## 📚 Next Development Steps

### Week 1: Core Setup
1. **Authentication Pages**
   - Create login/register pages
   - Implement Firebase Auth
   - Add protected routes

2. **Basic UI Components**
   - Install Shadcn/ui components
   - Create theme provider
   - Build basic layout

### Week 2: CRM Foundation
1. **Dashboard Layout**
   - Create main dashboard
   - Add navigation sidebar
   - Implement responsive design

2. **Contact Management**
   - Contact list view
   - Add/edit contact forms
   - Contact detail pages

### Week 3: Property Management
1. **Property Listings**
   - Property list view
   - Add/edit property forms
   - Property detail pages

2. **File Uploads**
   - Image upload for properties
   - Document upload system
   - Firebase Storage integration

## 🎯 Success Checklist

After setup, you should have:
- [ ] ✅ Local development server running
- [ ] ✅ Firebase project connected
- [ ] ✅ No console errors
- [ ] ✅ PWA manifest working
- [ ] ✅ Netlify deployment successful
- [ ] ✅ Environment variables configured
- [ ] ✅ Security rules deployed

## 🆘 Getting Help

### Resources
- **Main Documentation**: README.md
- **Setup Summary**: SETUP_SUMMARY.md
- **Firebase Docs**: https://firebase.google.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs

### Support
- Create GitHub issues for bugs
- Check the troubleshooting section in README.md
- Review Firebase console for error messages
- Check Netlify deploy logs for deployment issues

---

**You're ready to build! 🚀** The foundation is solid, and you can now start implementing the core features of your realtor platform.