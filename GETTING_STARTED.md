# Quiz App - Getting Started

## Quick Setup Guide

### 1. Install MongoDB
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Backend Setup (5 minutes)

```bash
# Open terminal and navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Start the server
npm run dev
```

Server will start at: http://localhost:5000

### 3. Mobile Setup (5 minutes)

```bash
# Open a NEW terminal and navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Important: Update API URL in mobile/src/services/api.ts
# Line 5: Change to your computer's IP address
# For Android emulator: http://10.0.2.2:5000/api
# For iOS simulator: http://localhost:5000/api
# For physical device: http://YOUR_IP:5000/api (find with ipconfig on Windows)

# Start Expo
npm start
```

Then press:
- `a` for Android emulator
- `i` for iOS simulator
- Scan QR code for physical device

### 4. Create Admin Account

In the mobile app:
1. Register with any email/username
2. Use the backend API to update user role to "admin":

```bash
# First login to get token, then update role via MongoDB or API
```

Or use a tool like Postman to register with role "admin" directly.

### 5. Test the App

**As User:**
- View available quizzes
- Take quizzes
- See results

**As Admin:**
- Create new quizzes
- Edit existing quizzes
- Delete quizzes

## Common Issues

**Cannot connect to backend from mobile:**
- Update API_URL in `mobile/src/services/api.ts`
- For physical device, use your computer's IP address (run `ipconfig` in terminal)
- Make sure backend is running

**MongoDB connection error:**
- Start MongoDB service
- Or use MongoDB Atlas connection string

**Port already in use:**
- Change PORT in backend/.env

## File Structure

```
backend/
├── src/
│   ├── models/         # Database models
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & error handling
│   └── config/         # Database connection
└── .env               # Configuration

mobile/
├── src/
│   ├── screens/       # App screens
│   ├── context/       # Auth context
│   └── services/      # API service
└── App.tsx           # Main app
```

## Need Help?

Check the main README.md for detailed documentation.
