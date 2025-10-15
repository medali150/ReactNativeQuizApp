# Quiz App Backend

Backend server for the Quiz App built with Express.js, TypeScript, and MongoDB.

## Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 👥 Role-based access control (Admin & User)
- 📝 Quiz management (CRUD operations)
- ✅ Quiz submission and scoring
- 🗄️ MongoDB database with Mongoose ODM
- 🛡️ Request validation and error handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

Development mode:
```bash
npm run dev
```

Build TypeScript:
```bash
npm run build
```

Production mode:
```bash
npm start
```

## API Endpoints

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

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── quizController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Quiz.ts
│   │   └── Submission.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── quizRoutes.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Models

### User
- username, email, password, role (admin/user)

### Quiz
- title, description, questions[], createdBy, category, difficulty, timeLimit

### Submission
- userId, quizId, answers[], score, totalQuestions

## Default Admin Account

To create an admin account, register with role field:
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```
