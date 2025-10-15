# Quiz App Mobile

React Native mobile application for the Quiz App built with Expo.

## Features

- 🔐 User authentication (Login/Register)
- 👥 Role-based access (Admin & User)
- 📝 Quiz taking with real-time scoring
- 👨‍💼 Admin dashboard for quiz management
- 📱 Clean and intuitive UI
- 💾 Token-based authentication with AsyncStorage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/services/api.ts`:
```typescript
const API_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

For local development:
- Android emulator: `http://10.0.2.2:5000/api`
- iOS simulator: `http://localhost:5000/api`
- Physical device: `http://YOUR_COMPUTER_IP:5000/api`

## Running the App

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web
```

## Project Structure

```
mobile/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── screens/
│   │   ├── LoginScreen.tsx       # Login screen
│   │   ├── RegisterScreen.tsx    # Registration screen
│   │   ├── HomeScreen.tsx        # User home screen
│   │   ├── AdminDashboardScreen.tsx  # Admin dashboard
│   │   ├── QuizScreen.tsx        # Quiz taking screen
│   │   ├── CreateQuizScreen.tsx  # Create quiz screen (Admin)
│   │   └── EditQuizScreen.tsx    # Edit quiz screen (Admin)
│   └── services/
│       └── api.ts                # API service with Axios
├── App.tsx                       # Main app with navigation
├── app.json                      # Expo configuration
├── package.json
└── tsconfig.json
```

## Navigation Flow

### User Flow:
Login → Home (List of Quizzes) → Quiz (Take Quiz) → Results

### Admin Flow:
Login → Admin Dashboard → Create/Edit/Delete Quizzes

## API Configuration

The app connects to the Express backend. Make sure:
1. Backend server is running
2. MongoDB is connected
3. API URL is correctly configured

## Authentication

- JWT tokens stored in AsyncStorage
- Automatic token refresh on app launch
- Role-based navigation (admin vs user)

## Default Credentials

Create an admin account via backend registration with role "admin":
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

Regular users register with default role "user".

## Troubleshooting

**Cannot connect to backend:**
- Check API_URL in `src/services/api.ts`
- Ensure backend is running
- For physical devices, use computer's IP address

**AsyncStorage errors:**
- Run `npx expo install @react-native-async-storage/async-storage`

**Navigation errors:**
- Run `npx expo install react-native-screens react-native-safe-area-context`
