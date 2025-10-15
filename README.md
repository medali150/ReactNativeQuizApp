# 📱 Full-Stack Quiz App

A complete full-stack Quiz application with Express.js backend and React Native (Expo) mobile frontend.

## 🏗️ Project Structure

```
reactNativeQuizApp/
├── backend/           # Express.js + TypeScript + MongoDB
└── mobile/            # React Native + Expo
```

## ✨ Features

### Backend (Express.js + TypeScript + MongoDB)
- ✅ JWT Authentication (Register, Login, Logout)
- ✅ Role-based access control (Admin & User)
- ✅ RESTful API with MVC architecture
- ✅ MongoDB with Mongoose ODM
- ✅ Quiz CRUD operations
- ✅ Quiz submission and scoring
- ✅ Request validation and error handling

### Mobile (React Native + Expo)
- ✅ User authentication screens
- ✅ Role-based navigation (Admin vs User)
- ✅ Quiz taking interface
- ✅ Admin dashboard for quiz management
- ✅ AsyncStorage for JWT token management
- ✅ Clean and intuitive UI

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn
- Expo CLI (optional): `npm install -g expo-cli`

### 1️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/quizapp
# JWT_SECRET=your_secret_key
# JWT_EXPIRE=7d

# Run development server
npm run dev
```

The backend will run at `http://localhost:5000`

### 2️⃣ Mobile Setup

```bash
# Navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Update API URL in src/services/api.ts
# For Android emulator: http://10.0.2.2:5000/api
# For iOS simulator: http://localhost:5000/api
# For physical device: http://YOUR_COMPUTER_IP:5000/api

# Start Expo development server
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Quizzes
- `GET /api/quizzes` - Get all quizzes (Protected)
- `GET /api/quizzes/:id` - Get single quiz (Protected)
- `POST /api/quizzes` - Create quiz (Admin only)
- `PUT /api/quizzes/:id` - Update quiz (Admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin only)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (Protected)
- `GET /api/quizzes/submissions` - Get user submissions (Protected)

## 👥 User Roles

### Admin
- Create, edit, and delete quizzes
- View all quizzes
- Manage quiz content

### User
- View available quizzes
- Take quizzes
- View quiz results
- View submission history

## 🔐 Creating Admin Account

Register via API or mobile app with role field:

```json
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

Regular users are created with default role "user".

## 🗄️ Database Models

### User
```typescript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'admin' | 'user',
  createdAt: Date
}
```

### Quiz
```typescript
{
  title: String,
  description: String,
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  createdBy: ObjectId (User),
  category: String,
  difficulty: 'easy' | 'medium' | 'hard',
  timeLimit: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Submission
```typescript
{
  userId: ObjectId (User),
  quizId: ObjectId (Quiz),
  answers: [Number],
  score: Number,
  totalQuestions: Number,
  submittedAt: Date
}
```

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage

## 📱 Screenshots & Flow

### User Flow
1. Login/Register → 2. Home (Quiz List) → 3. Take Quiz → 4. View Results

### Admin Flow
1. Login → 2. Admin Dashboard → 3. Create/Edit/Delete Quizzes

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev      # Run with nodemon
npm run build    # Build TypeScript
npm start        # Run production
```

### Mobile Development
```bash
cd mobile
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
```

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running and MONGODB_URI is correct
- **Port Already in Use**: Change PORT in .env file
- **JWT Error**: Set JWT_SECRET in .env

### Mobile Issues
- **Cannot connect to backend**: Check API_URL in `mobile/src/services/api.ts`
- **Module not found**: Run `npm install` or `npx expo install`
- **AsyncStorage error**: Run `npx expo install @react-native-async-storage/async-storage`

## 📝 License

MIT

## 👤 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Coding! 🚀**
