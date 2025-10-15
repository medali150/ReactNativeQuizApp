# ✅ Installation & Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation Requirements

- [ ] Node.js installed (v16+)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] MongoDB installed or MongoDB Atlas account
  - Check: MongoDB service running
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

## 🔧 Backend Setup

### Step 1: Install Dependencies
- [ ] Navigate to backend folder: `cd backend`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify node_modules folder created

### Step 2: Configure Environment
- [ ] Check `.env` file exists
- [ ] If not, copy from `.env.example`
- [ ] Update MONGODB_URI (if using MongoDB Atlas)
- [ ] Set strong JWT_SECRET
- [ ] Verify PORT is available (default: 5000)

### Step 3: Database Setup
- [ ] MongoDB service running
- [ ] Test connection
- [ ] Run seed script: `npm run seed`
- [ ] Verify sample data created:
  - [ ] Admin account created
  - [ ] User account created
  - [ ] 3 sample quizzes created

### Step 4: Start Backend
- [ ] Run: `npm run dev`
- [ ] Check console for "Server running" message
- [ ] Check console for "MongoDB Connected" message
- [ ] Verify no error messages
- [ ] Test health endpoint: http://localhost:5000/api/health

### Step 5: Test Backend API (Optional)
- [ ] Install Postman or use browser
- [ ] Test register endpoint
- [ ] Test login endpoint
- [ ] Verify JWT token received

## 📱 Mobile Setup

### Step 1: Install Dependencies
- [ ] Open NEW terminal
- [ ] Navigate to mobile folder: `cd mobile`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify node_modules folder created

### Step 2: Configure API Connection
- [ ] Open: `mobile/src/services/api.ts`
- [ ] Locate line 5: `const API_URL`
- [ ] Update based on your device:
  - [ ] Android Emulator: `http://10.0.2.2:5000/api`
  - [ ] iOS Simulator: `http://localhost:5000/api`
  - [ ] Physical Device: `http://YOUR_IP:5000/api`
- [ ] Save file

### Step 3: Find Your IP (for Physical Device)
- [ ] Windows: Run `ipconfig` in terminal
- [ ] Mac/Linux: Run `ifconfig | grep inet`
- [ ] Note the IPv4 address (e.g., 192.168.1.x)
- [ ] Update API_URL with this IP

### Step 4: Start Expo
- [ ] Run: `npm start`
- [ ] Wait for QR code to appear
- [ ] Verify no error messages
- [ ] Metro bundler opens in browser

### Step 5: Run on Device

#### For Android Emulator:
- [ ] Android Studio installed
- [ ] Emulator running
- [ ] Press 'a' in terminal
- [ ] App builds and launches

#### For iOS Simulator (Mac only):
- [ ] Xcode installed
- [ ] Press 'i' in terminal
- [ ] App builds and launches

#### For Physical Device:
- [ ] Expo Go app installed
- [ ] Device on same WiFi as computer
- [ ] Scan QR code
- [ ] App loads successfully

## 🧪 Testing

### Backend Tests
- [ ] Server responds to requests
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] JWT token generated
- [ ] Protected routes work
- [ ] Admin endpoints work
- [ ] Quiz CRUD operations work

### Mobile App Tests

#### Authentication
- [ ] Register screen loads
- [ ] Can create new account
- [ ] Login screen loads
- [ ] Can login with credentials
- [ ] Token saved in AsyncStorage
- [ ] Auto-login on app restart

#### User Flow
- [ ] User sees Home screen
- [ ] Quiz list displays
- [ ] Can select quiz
- [ ] Quiz screen loads
- [ ] Can answer questions
- [ ] Can navigate questions
- [ ] Can submit quiz
- [ ] Results display correctly
- [ ] Pull-to-refresh works

#### Admin Flow
- [ ] Admin sees Dashboard
- [ ] Quiz list displays
- [ ] Can tap "Create Quiz"
- [ ] Create quiz screen loads
- [ ] Can add questions
- [ ] Can add options
- [ ] Can select correct answer
- [ ] Can save quiz
- [ ] Quiz appears in list
- [ ] Can edit quiz
- [ ] Can delete quiz

#### General
- [ ] Logout works
- [ ] Navigation smooth
- [ ] No crashes
- [ ] Loading indicators show
- [ ] Error messages display
- [ ] UI looks good

## 🔍 Troubleshooting Checks

### If Backend Won't Start:
- [ ] Check MongoDB running: `mongod` or check service
- [ ] Check port availability
- [ ] Check .env file exists and valid
- [ ] Check node_modules installed
- [ ] Check for error messages in console

### If Mobile Won't Connect:
- [ ] Backend running
- [ ] API_URL correct in api.ts
- [ ] Same WiFi network (physical device)
- [ ] Firewall not blocking
- [ ] IP address correct (physical device)
- [ ] Expo cache cleared if needed: `npx expo start -c`

### If Login Fails:
- [ ] Backend running
- [ ] Database seeded
- [ ] Using correct credentials
- [ ] Check backend console for errors
- [ ] Check mobile console for errors

## 📊 Success Indicators

### Backend Success:
```
✅ MongoDB Connected: localhost
✅ Server running in development mode on port 5000
```

### Seed Success:
```
✅ Admin created: admin@quizapp.com
✅ User created: user@quizapp.com
✅ Quiz created: JavaScript Basics
✅ Quiz created: React Fundamentals
✅ Quiz created: General Knowledge
✅ Database seeded successfully!
```

### Mobile Success:
- Metro bundler shows "100% complete"
- App opens without errors
- Login screen displays
- Can navigate app

## 🎉 Final Verification

- [ ] Backend running on http://localhost:5000
- [ ] Mobile app running on device/simulator
- [ ] Can login as user
- [ ] Can login as admin
- [ ] User can take quiz
- [ ] Admin can create quiz
- [ ] All features working
- [ ] No error messages

## 📝 Test Accounts

Default credentials (after seeding):

**Admin:**
- Email: admin@quizapp.com
- Password: admin123

**User:**
- Email: user@quizapp.com
- Password: user123

## 🚀 You're Ready!

If all items are checked, your Quiz App is fully operational!

### Next Steps:
1. Test all features
2. Create your own quizzes
3. Invite users to test
4. Customize as needed
5. Deploy to production

## 📞 Need Help?

If any checks failed:
1. Review error messages carefully
2. Check SETUP_INSTRUCTIONS.md
3. Check troubleshooting section
4. Verify all prerequisites
5. Try clearing caches and reinstalling

## 🎯 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Port in use | Change PORT in .env |
| MongoDB error | Start MongoDB service |
| Can't connect | Check API_URL |
| Expo error | Run `npx expo start -c` |
| Module not found | Run `npm install` |
| Token invalid | Clear AsyncStorage and login again |

---

**Congratulations on setting up your Quiz App! 🎊**
