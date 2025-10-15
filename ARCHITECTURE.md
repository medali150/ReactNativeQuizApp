# 📐 System Architecture Diagram

## 🏛️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FULL-STACK QUIZ APP                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   MOBILE APP         │◄───────►│   BACKEND API        │
│  (React Native)      │  HTTP   │   (Express.js)       │
│                      │  REST   │                      │
│  ┌────────────────┐  │         │  ┌────────────────┐  │
│  │   Screens      │  │         │  │   Routes       │  │
│  │   Context      │  │         │  │   Controllers  │  │
│  │   Services     │  │         │  │   Middleware   │  │
│  └────────────────┘  │         │  └────────────────┘  │
│                      │         │          │           │
│  AsyncStorage (JWT)  │         │          ▼           │
└──────────────────────┘         │  ┌────────────────┐  │
                                 │  │   MongoDB      │  │
                                 │  │   (Database)   │  │
                                 │  └────────────────┘  │
                                 └──────────────────────┘
```

## 📱 Mobile App Flow

```
App Start
   │
   ├─► Check AsyncStorage
   │      │
   │      ├─► Token Found? ──Yes──► Verify Token ──► Load User
   │      │                              │
   │      └─► Token Found? ──No───► Show Login Screen
   │
   └─► User Logged In?
          │
          ├─► Role = 'admin' ──► Admin Dashboard
          │                           │
          │                           ├─► Create Quiz
          │                           ├─► Edit Quiz
          │                           └─► Delete Quiz
          │
          └─► Role = 'user' ──► Home Screen
                                    │
                                    ├─► View Quizzes
                                    ├─► Take Quiz
                                    └─► View Results
```

## 🔐 Authentication Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Mobile  │                  │ Backend  │                  │ Database │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                              │                              │
     │ POST /auth/register          │                              │
     ├─────────────────────────────►│                              │
     │ {email, password, username}  │                              │
     │                              │ Hash Password                │
     │                              ├─────────────────────────────►│
     │                              │ Create User                  │
     │                              │                              │
     │                              │◄─────────────────────────────┤
     │                              │ User Created                 │
     │                              │ Generate JWT                 │
     │◄─────────────────────────────┤                              │
     │ {token, user}                │                              │
     │                              │                              │
     │ Store Token in AsyncStorage  │                              │
     │                              │                              │
     │ POST /auth/login             │                              │
     ├─────────────────────────────►│                              │
     │ {email, password}            │ Verify Credentials           │
     │                              ├─────────────────────────────►│
     │                              │                              │
     │                              │◄─────────────────────────────┤
     │                              │ User Found                   │
     │                              │ Generate JWT                 │
     │◄─────────────────────────────┤                              │
     │ {token, user}                │                              │
     │                              │                              │
     │ Authenticated Requests       │                              │
     │ Authorization: Bearer token  │                              │
     ├─────────────────────────────►│                              │
     │                              │ Verify JWT                   │
     │                              │ Check Role                   │
     │◄─────────────────────────────┤                              │
     │ Protected Data               │                              │
```

## 🎯 Quiz Taking Flow

```
User Flow:
┌─────────────┐
│  Home       │
│  Screen     │
│             │
│ Quiz List   │
└──────┬──────┘
       │
       │ Select Quiz
       ▼
┌─────────────┐
│  Quiz       │
│  Screen     │
│             │
│ Question 1  │
│ [Options]   │
└──────┬──────┘
       │
       │ Next/Previous
       ▼
┌─────────────┐
│  Question N │
│  [Options]  │
└──────┬──────┘
       │
       │ Submit
       ▼
┌─────────────┐
│  Results    │
│             │
│ Score: 8/10 │
│ 80%         │
└─────────────┘

Backend Processing:
┌──────────────┐
│ Receive      │
│ Answers      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Compare with │
│ Correct      │
│ Answers      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Calculate    │
│ Score        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Save         │
│ Submission   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Return       │
│ Results      │
└──────────────┘
```

## 🔧 Admin Quiz Management Flow

```
Admin Dashboard
       │
       ├─────────────────┬─────────────────┬
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Create    │   │    Edit     │   │   Delete    │
│   Quiz      │   │    Quiz     │   │   Quiz      │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────────────────────────────────────────┐
│              Backend API                         │
│                                                  │
│  POST /quizzes    PUT /quizzes/:id  DELETE      │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              MongoDB Database                    │
│                                                  │
│  Store/Update/Delete Quiz Document              │
└─────────────────────────────────────────────────┘
```

## 🗄️ Database Schema

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │    Quiz      │         │  Submission  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ _id          │◄────┐   │ _id          │◄────┐   │ _id          │
│ username     │     │   │ title        │     │   │ userId       ├──┐
│ email        │     └───┤ createdBy    │     └───┤ quizId       │  │
│ password     │         │ description  │         │ answers[]    │  │
│ role         │         │ questions[]  │         │ score        │  │
│ createdAt    │         │ category     │         │ totalQs      │  │
└──────────────┘         │ difficulty   │         │ submittedAt  │  │
                         │ timeLimit    │         └──────────────┘  │
                         │ createdAt    │                           │
                         │ updatedAt    │                           │
                         └──────────────┘                           │
                                                                    │
                         Questions Structure:                       │
                         ┌──────────────┐                          │
                         │ questionText │                          │
                         │ options[]    │                          │
                         │ correctAnswer│                          │
                         └──────────────┘                          │
                                                                    │
Reference: userId references User._id ────────────────────────────┘
Reference: quizId references Quiz._id ─────────────────────────────┘
Reference: createdBy references User._id
```

## 🛣️ API Routes Structure

```
/api
│
├── /auth
│   ├── POST   /register        (Public)
│   ├── POST   /login           (Public)
│   ├── GET    /me              (Protected)
│   └── POST   /logout          (Protected)
│
└── /quizzes
    ├── GET    /                (Protected - All Users)
    ├── GET    /:id             (Protected - All Users)
    ├── POST   /                (Protected - Admin Only)
    ├── PUT    /:id             (Protected - Admin Only)
    ├── DELETE /:id             (Protected - Admin Only)
    ├── POST   /:id/submit      (Protected - All Users)
    └── GET    /submissions     (Protected - All Users)
```

## 🔒 Middleware Chain

```
Request → CORS → Body Parser → Route Handler
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  Auth Middleware │
                            │  (protect)       │
                            └────────┬─────────┘
                                     │
                                     ├─ Valid Token? ──No──► 401 Error
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Authorization   │
                            │  (authorize)     │
                            └────────┬─────────┘
                                     │
                                     ├─ Has Role? ──No──► 403 Error
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   Controller     │
                            │   Function       │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │    Response      │
                            │    or Error      │
                            └──────────────────┘
```

## 📦 Project File Tree

```
reactNativeQuizApp/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── quizController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Quiz.ts
│   │   │   └── Submission.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── quizRoutes.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── seed.ts
│
└── mobile/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── screens/
    │   │   ├── LoginScreen.tsx
    │   │   ├── RegisterScreen.tsx
    │   │   ├── HomeScreen.tsx
    │   │   ├── AdminDashboardScreen.tsx
    │   │   ├── QuizScreen.tsx
    │   │   ├── CreateQuizScreen.tsx
    │   │   └── EditQuizScreen.tsx
    │   └── services/
    │       └── api.ts
    ├── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

---

**Use these diagrams to understand the system architecture! 📊**
