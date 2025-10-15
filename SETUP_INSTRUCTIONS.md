# 🚀 Complete Setup Instructions

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version
- Verify installation: Open terminal and run `node --version`

### 2. Install MongoDB
**Option A: Local Installation**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update in backend/.env

### 3. Install Expo CLI (Optional but Recommended)
```bash
npm install -g expo-cli
```

## Step-by-Step Setup

### STEP 1: Clone/Navigate to Project
```bash
cd c:\Users\pc\reactNativeQuizApp
```

### STEP 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Edit backend/.env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Seed sample data (Optional but Recommended):**
```bash
npm run seed
```

This creates:
- Admin account: admin@quizapp.com / admin123
- User account: user@quizapp.com / user123
- 3 sample quizzes

**Start the backend server:**
```bash
npm run dev
```

✅ Backend should now be running at http://localhost:5000

### STEP 3: Mobile App Setup

**Open a NEW terminal window:**

```bash
# Navigate to mobile folder
cd c:\Users\pc\reactNativeQuizApp\mobile

# Install dependencies
npm install
```

**Update API URL:**

Edit `mobile/src/services/api.ts` (Line 5):

```typescript
// For testing on different devices:

// Android Emulator:
const API_URL = 'http://10.0.2.2:5000/api';

// iOS Simulator:
const API_URL = 'http://localhost:5000/api';

// Physical Device (find your IP with 'ipconfig' command):
const API_URL = 'http://192.168.1.XXX:5000/api';
```

**Start Expo development server:**
```bash
npm start
```

### STEP 4: Run the Mobile App

After running `npm start`, you'll see a QR code and options:

**For Android Emulator:**
- Have Android Studio installed with an emulator
- Press `a` in the terminal

**For iOS Simulator (Mac only):**
- Have Xcode installed
- Press `i` in the terminal

**For Physical Device:**
1. Install "Expo Go" app from:
   - Google Play Store (Android)
   - Apple App Store (iOS)
2. Scan the QR code with:
   - Android: Expo Go app
   - iOS: Camera app
3. Make sure your phone and computer are on the same WiFi network
4. Update API_URL to your computer's IP address

## Testing the App

### Login Credentials (after seeding):

**Admin Account:**
- Email: admin@quizapp.com
- Password: admin123
- Access: Create, edit, delete quizzes

**User Account:**
- Email: user@quizapp.com
- Password: user123
- Access: Take quizzes, view results

### Features to Test:

**As Admin:**
1. Login with admin credentials
2. View Admin Dashboard
3. Create a new quiz
4. Edit existing quiz
5. Delete a quiz

**As User:**
1. Login with user credentials
2. View available quizzes
3. Take a quiz
4. Submit and view results

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution:
- Start MongoDB service
- Or use MongoDB Atlas connection string

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution:
- Change PORT in backend/.env to 5001 or another port
- Update API_URL in mobile app accordingly

### Mobile Issues

**Cannot Connect to Backend:**
- Check API_URL in mobile/src/services/api.ts
- For physical device, use your computer's IP (not localhost)
- Find your IP: Run `ipconfig` in terminal (Windows) or `ifconfig` (Mac/Linux)
- Ensure both devices are on the same WiFi network
- Check if firewall is blocking the connection

**Module Not Found Errors:**
```bash
# Clear cache and reinstall
cd mobile
rm -rf node_modules
npm install
```

**Expo Issues:**
```bash
# Clear Expo cache
npx expo start -c
```

### Finding Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter

**Mac/Linux:**
```bash
ifconfig | grep inet
```

## Folder Structure Reference

```
reactNativeQuizApp/
├── backend/
│   ├── src/
│   │   ├── models/         # User, Quiz, Submission
│   │   ├── controllers/    # authController, quizController
│   │   ├── routes/         # authRoutes, quizRoutes
│   │   ├── middleware/     # auth, error
│   │   ├── config/         # database
│   │   └── server.ts       # Main server file
│   ├── .env               # Configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── seed.ts            # Sample data seeder
│
└── mobile/
    ├── src/
    │   ├── screens/        # All app screens
    │   ├── context/        # AuthContext
    │   └── services/       # API service
    ├── App.tsx            # Main app entry
    ├── app.json           # Expo config
    └── package.json
```

## API Testing with Postman (Optional)

You can test the API endpoints using Postman:

**Base URL:** http://localhost:5000/api

**Test Register:**
```
POST /auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}
```

**Test Login:**
```
POST /auth/login
Body (JSON):
{
  "email": "admin@quizapp.com",
  "password": "admin123"
}
```

Copy the token from response and use in headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Next Steps

1. ✅ Backend running on http://localhost:5000
2. ✅ Mobile app running on Expo
3. ✅ Test with sample accounts
4. 🎯 Create your own quizzes as admin
5. 🎯 Take quizzes as a user
6. 🎯 Customize the app to your needs

## Need Help?

- Check README.md for detailed documentation
- Review GETTING_STARTED.md for quick reference
- Check backend/README.md for backend-specific info
- Check mobile/README.md for mobile-specific info

**Common Commands Reference:**

Backend:
```bash
cd backend
npm run dev      # Start development server
npm run seed     # Seed sample data
npm run build    # Build TypeScript
```

Mobile:
```bash
cd mobile
npm start        # Start Expo
npm run android  # Run on Android
npm run ios      # Run on iOS
```

---

**Happy Coding! 🎉**
