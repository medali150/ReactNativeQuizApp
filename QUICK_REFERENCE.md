# 🚀 Quick Reference Card

## 📁 Project Location
```
c:\Users\pc\reactNativeQuizApp\
```

## ⚡ Quick Start (3 Steps)

### 1. Backend (Terminal 1)
```bash
cd backend
npm install
npm run seed
npm run dev
```
✅ Server: http://localhost:5000

### 2. Mobile (Terminal 2)
```bash
cd mobile
npm install
npm start
```
✅ Press 'a' for Android, 'i' for iOS

### 3. Login & Test
```
Admin: admin@quizapp.com / admin123
User: user@quizapp.com / user123
```

## 🔑 Important Files to Check

**Backend Configuration:**
```
backend/.env - Database & JWT settings
```

**Mobile Configuration:**
```
mobile/src/services/api.ts (Line 5) - API_URL
```

## 📱 API URLs by Device

```typescript
// Android Emulator
const API_URL = 'http://10.0.2.2:5000/api';

// iOS Simulator
const API_URL = 'http://localhost:5000/api';

// Physical Device (replace with your IP)
const API_URL = 'http://192.168.1.XXX:5000/api';
```

## 🛠️ Common Commands

**Backend:**
```bash
npm run dev     # Start dev server
npm run seed    # Load sample data
npm run build   # Build TypeScript
```

**Mobile:**
```bash
npm start       # Start Expo
npm run android # Run Android
npm run ios     # Run iOS
```

**Find Your IP (Windows):**
```bash
ipconfig
```

## 🎯 Features Overview

**User Can:**
- ✅ Register & Login
- ✅ View quizzes
- ✅ Take quizzes
- ✅ See results

**Admin Can:**
- ✅ Everything users can
- ✅ Create quizzes
- ✅ Edit quizzes
- ✅ Delete quizzes

## 📊 Default Accounts

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@quizapp.com     | admin123  |
| User  | user@quizapp.com      | user123   |

## 🆘 Quick Troubleshooting

**Can't connect to backend?**
→ Check API_URL in mobile/src/services/api.ts

**MongoDB error?**
→ Start MongoDB or use MongoDB Atlas

**Port in use?**
→ Change PORT in backend/.env

**Expo errors?**
→ Run: `npx expo start -c`

## 📚 Documentation Files

- `README.md` - Full documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `GETTING_STARTED.md` - Quick start
- `PROJECT_SUMMARY.md` - Complete overview

## 🏗️ Tech Stack

**Backend:** Express + TypeScript + MongoDB  
**Mobile:** React Native + Expo + TypeScript  
**Auth:** JWT + bcrypt  
**API:** RESTful + Axios

## 📂 Key Folders

```
backend/src/
├── models/      # Database models
├── controllers/ # Business logic
├── routes/      # API routes
└── middleware/  # Auth & errors

mobile/src/
├── screens/     # App screens
├── context/     # Auth state
└── services/    # API calls
```

## 🎨 Sample Quizzes Included

1. JavaScript Basics (Easy)
2. React Fundamentals (Medium)
3. General Knowledge (Easy)

## ⚙️ Environment Setup

**backend/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## 🔥 Hot Tips

1. Run `npm run seed` to get sample data
2. Use admin account to create quizzes
3. Use user account to test taking quizzes
4. Check backend terminal for API logs
5. Use Expo Go app for quick testing on phone

## ✅ Testing Checklist

- [ ] Backend server running
- [ ] MongoDB connected
- [ ] Sample data loaded
- [ ] Mobile app starts
- [ ] Can login as user
- [ ] Can login as admin
- [ ] User can take quiz
- [ ] Admin can create quiz

## 🌐 API Endpoints Summary

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/quizzes
GET  /api/quizzes/:id
POST /api/quizzes (Admin)
PUT  /api/quizzes/:id (Admin)
DELETE /api/quizzes/:id (Admin)
POST /api/quizzes/:id/submit
GET  /api/quizzes/submissions
```

---

**Keep this card handy for quick reference! 📌**
