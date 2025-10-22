
# � React Native Quiz App

An advanced full-stack quiz application featuring:
- **React Native (Expo) mobile frontend**
- **Express.js + TypeScript backend**
- **MongoDB database**
- **AI-powered quiz generation (Groq Llama 3.3 70B, OpenAI-compatible API)**
- **Dynamic backend IP configuration for seamless network changes**


## 🏗️ Project Structure

```
reactNativeQuizApp/
├── backend/        # Express.js, TypeScript, MongoDB, Groq/OpenAI integration
├── mobile/         # React Native (Expo), dynamic API config
├── AI_GENERATOR_README.md
├── WIFI_IP_GUIDE.md
└── README.md
```


## ✨ Features

### Backend
- JWT Authentication (Register, Login, Logout)
- Role-based access control (Admin & User)
- RESTful API (MVC architecture)
- MongoDB with Mongoose ODM
- Quiz CRUD operations
- Quiz submission and automatic scoring
- AI quiz generation (Groq Llama 3.3 70B, OpenAI-compatible)
- Request validation and error handling

### Mobile
- User authentication screens
- Role-based navigation (Admin/User)
- Quiz taking interface
- Admin dashboard for quiz management
- Dynamic backend IP configuration (Settings screen)
- AsyncStorage for JWT token management
- Clean, intuitive UI


## � Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Groq API Key (for AI quiz generation)

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies:
  ```sh
  npm install
  ```
3. Create `.env` file:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_secret_key
  JWT_EXPIRE=7d
  GROQ_API_KEY=your_groq_api_key
  AI_MODEL=llama3-70b-8192
  ```
4. Start the server:
  ```sh
  npm run dev
  ```
5. Backend runs at `http://localhost:5000`

### Mobile Setup
1. Navigate to `mobile/`
2. Install dependencies:
  ```sh
  npm install
  ```
3. Start Expo development server:
  ```sh
  npm start
  ```
4. Run on device/emulator:
  - Press `a` for Android emulator
  - Press `i` for iOS simulator
  - Scan QR code with Expo Go app

### Dynamic Backend IP Configuration
- Use the **Settings** screen in the mobile app to update the backend server IP address.
- No code changes needed when switching WiFi networks.
- See `WIFI_IP_GUIDE.md` for details.


## 📋 API Endpoints (Highlights)

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (Protected)
- `POST /api/auth/logout` — Logout user (Protected)

### Quizzes
- `GET /api/quizzes` — Get all quizzes (Protected)
- `GET /api/quizzes/:id` — Get single quiz (Protected)
- `POST /api/quizzes` — Create quiz (Admin only)
- `PUT /api/quizzes/:id` — Update quiz (Admin only)
- `DELETE /api/quizzes/:id` — Delete quiz (Admin only)
- `POST /api/quizzes/:id/submit` — Submit quiz answers (Protected)
- `GET /api/quizzes/submissions` — Get user submissions (Protected)


## 👥 User Roles

**Admin:**
- Create, edit, delete quizzes
- Manage quiz content

**User:**
- Take quizzes
- View results and submission history


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

**User**
```typescript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'admin' | 'user',
  createdAt: Date
}
```

**Quiz**
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

**Submission**
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

**Backend:**
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv
- Groq/OpenAI SDK

**Mobile:**
- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- AsyncStorage


## 📱 User & Admin Flow

**User:**
1. Login/Register → 2. Home (Quiz List) → 3. Take Quiz → 4. View Results

**Admin:**
1. Login → 2. Admin Dashboard → 3. Create/Edit/Delete Quizzes


## 🔧 Development

**Backend:**
```sh
cd backend
npm run dev      # Run with nodemon
npm run build    # Build TypeScript
npm start        # Run production
```

**Mobile:**
```sh
cd mobile
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
```


## 🐛 Troubleshooting

**Backend:**
- MongoDB Connection Error: Ensure MongoDB is running and MONGO_URI is correct
- Port Already in Use: Change PORT in .env
- JWT Error: Set JWT_SECRET in .env
- API Key Error: Set GROQ_API_KEY in .env

**Mobile:**
- Cannot connect to backend: Update backend IP in Settings screen
- Module not found: Run `npm install` or `npx expo install`
- AsyncStorage error: Run `npx expo install @react-native-async-storage/async-storage`


## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


## 👤 Author

Mohamedali Gharbi

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📚 Documentation
- [AI_GENERATOR_README.md](./AI_GENERATOR_README.md): AI quiz logic
- [ARCHITECTURE.md](./ARCHITECTURE.md): Architecture of the project  

---

**Happy Coding! 🚀**
