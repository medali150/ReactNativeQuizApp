# 🤖 AI Quiz Generator - Technical Documentation

## Overview

The AI Quiz Generator is a feature that uses **Groq AI** (with Llama 3.3 70B model) to automatically generate complete quizzes based on a topic, category, difficulty level, and number of questions. This eliminates the need for admins to manually create each question.

---

## 🏗️ Architecture

### System Components

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │
         │ HTTP POST Request
         │ /api/quizzes/generate/ai
         ▼
┌─────────────────┐
│  Backend API    │
│  (Express.js)   │
└────────┬────────┘
         │
         │ OpenAI SDK (Compatible)
         ▼
┌─────────────────┐
│   Groq API      │
│ (Llama 3.3 70B) │
└────────┬────────┘
         │
         │ JSON Response
         ▼
┌─────────────────┐
│  Quiz Data      │
│  Structured     │
└─────────────────┘
```

---

## 📁 File Structure

### Backend Files

```
backend/
├── .env                                    # Environment variables (API keys)
├── src/
│   ├── controllers/
│   │   └── aiQuizController.ts            # AI generation logic
│   └── routes/
│       └── quizRoutes.ts                  # API endpoints
```

### Frontend Files

```
mobile/
└── src/
    ├── screens/
    │   ├── AIQuizGeneratorScreen.tsx      # AI generator UI
    │   ├── CreateQuizScreen.tsx           # Quiz creation/saving
    │   └── AdminDashboardScreen.tsx       # Admin dashboard
    └── services/
        └── api.ts                         # API calls
```

---

## 🔧 Backend Implementation

### 1. Environment Configuration (`.env`)

```env
# Groq API Configuration
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
AI_MODEL=llama-3.3-70b-versatile
```

**Key Points:**
- `GROQ_API_KEY`: Your API key from https://console.groq.com/keys
- `AI_MODEL`: The AI model to use (Llama 3.3 70B is recommended for quality)

---

### 2. AI Controller Logic (`aiQuizController.ts`)

#### **Function: `generateQuizWithAI()`**

**Input (Request Body):**
```typescript
{
  topic: string,              // e.g., "World War 2"
  category: string,           // e.g., "History"
  difficulty: string,         // e.g., "Medium"
  numberOfQuestions: number   // e.g., 10
}
```

**Process Flow:**

```
1. Validate Input
   ├─ Check if topic is provided
   ├─ Set defaults: 5 questions, Medium difficulty
   └─ Validate API key exists

2. Initialize Groq Client
   ├─ Use OpenAI SDK (compatible with Groq)
   ├─ Set API key from environment
   └─ Set base URL: https://api.groq.com/openai/v1

3. Build Prompt
   ├─ Create structured prompt with requirements
   ├─ Specify JSON format expected
   └─ Include quiz specifications

4. Call Groq API
   ├─ Model: llama-3.3-70b-versatile
   ├─ Temperature: 0.7 (creative but focused)
   ├─ Max tokens: 2000
   └─ System message: "You are a quiz generator expert"

5. Parse AI Response
   ├─ Remove markdown code blocks (```json)
   ├─ Parse JSON
   └─ Validate structure

6. Add Metadata
   ├─ Calculate timeLimit (2 min per question)
   ├─ Set generatedByAI = true
   └─ Return structured quiz data

7. Error Handling
   ├─ 400: Missing topic
   ├─ 401: Invalid API key
   ├─ 500: Parsing error or AI failure
   └─ Log all errors for debugging
```

**Prompt Structure:**

```typescript
const prompt = `Generate a quiz about "${topic}" with the following specifications:
- Category: ${category}
- Difficulty: ${difficulty}
- Number of questions: ${numberOfQuestions}

Please generate a quiz in the following JSON format:
{
  "title": "Quiz title based on the topic",
  "description": "Brief description of the quiz",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "questionText": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Requirements:
- Make questions clear and educational
- Ensure all options are plausible
- The correctAnswer should be the index (0-3) of the correct option
- Questions should be appropriate for ${difficulty} difficulty level
- Generate exactly ${numberOfQuestions} questions

Return ONLY the JSON object, no additional text.`;
```

**Output (Response):**
```typescript
{
  success: true,
  data: {
    title: "World War 2 Quiz",
    description: "Test your knowledge about World War 2",
    category: "History",
    difficulty: "medium",
    timeLimit: 20,  // 2 min per question
    generatedByAI: true,
    questions: [
      {
        questionText: "When did World War 2 start?",
        options: ["1939", "1940", "1941", "1942"],
        correctAnswer: 0
      },
      // ... more questions
    ]
  },
  message: "Quiz generated successfully using AI"
}
```

---

### 3. API Endpoints (`quizRoutes.ts`)

```typescript
// Generate quiz with AI (Admin only)
POST /api/quizzes/generate/ai
Authorization: Bearer <admin_token>
Body: { topic, category, difficulty, numberOfQuestions }

// Check AI status (Admin only)
GET /api/quizzes/ai/status
Authorization: Bearer <admin_token>
```

**Middleware:**
- `protect`: Verifies JWT token
- `authorize('admin')`: Ensures only admins can access

---

## 📱 Frontend Implementation

### 1. AI Generator Screen (`AIQuizGeneratorScreen.tsx`)

**Features:**
- Topic input (multiline text)
- Category selection (10 predefined categories)
- Difficulty buttons (Easy/Medium/Hard)
- Question count selector (5/10/15/20)
- AI status check on mount
- Generate button with loading state
- Warning if API key not configured

**State Management:**
```typescript
const [topic, setTopic] = useState('');
const [category, setCategory] = useState('General Knowledge');
const [difficulty, setDifficulty] = useState('Medium');
const [numberOfQuestions, setNumberOfQuestions] = useState(10);
const [loading, setLoading] = useState(false);
const [aiEnabled, setAiEnabled] = useState(false);
```

**Generation Flow:**

```
1. User fills in form
   ├─ Enters topic
   ├─ Selects category
   ├─ Chooses difficulty
   └─ Picks number of questions

2. User clicks "Generate Quiz"
   ├─ Validate topic is not empty
   ├─ Show loading indicator
   └─ Call API

3. API Call (quizAPI.generateQuizWithAI)
   ├─ POST to /api/quizzes/generate/ai
   ├─ Send { topic, category, difficulty, numberOfQuestions }
   └─ Wait for response

4. Process Response
   ├─ Success: Extract quiz data
   ├─ Navigate to CreateQuizScreen
   └─ Pass prefilledData as route params

5. Error Handling
   ├─ Network error: Show connection message
   ├─ 401: Show API key error
   └─ Other: Show generic error
```

**Navigation:**
```typescript
navigation.navigate('CreateQuiz', {
  prefilledData: {
    title: response.data.title,
    description: response.data.description,
    category: response.data.category,
    difficulty: response.data.difficulty,
    timeLimit: response.data.timeLimit,
    questions: response.data.questions
  }
});
```

---

### 2. Create Quiz Screen Integration (`CreateQuizScreen.tsx`)

**Prefilled Data Handling:**

```typescript
const prefilledData = route?.params?.prefilledData;

const [title, setTitle] = useState(prefilledData?.title || '');
const [description, setDescription] = useState(prefilledData?.description || '');
const [category, setCategory] = useState(prefilledData?.category || 'General Knowledge');
const [difficulty, setDifficulty] = useState(prefilledData?.difficulty || 'medium');
const [timeLimit, setTimeLimit] = useState(prefilledData?.timeLimit?.toString() || '30');
const [questions, setQuestions] = useState(
  prefilledData?.questions || [{ questionText: '', options: ['', ''], correctAnswer: 0 }]
);
```

**User Actions:**
1. Review AI-generated quiz
2. Edit any questions/options if needed
3. Add/remove questions
4. Save quiz to database

---

### 3. API Service (`api.ts`)

```typescript
export const quizAPI = {
  // Generate quiz with AI
  generateQuizWithAI: async (data: {
    topic: string;
    category: string;
    difficulty: string;
    numberOfQuestions: number;
  }) => {
    const response = await api.post('/quizzes/generate/ai', data);
    return response.data;
  },

  // Check AI status
  getAIStatus: async () => {
    const response = await api.get('/quizzes/ai/status');
    return response.data;
  },
};
```

---

## 🔐 Security & Authorization

### Role-Based Access Control

```typescript
// Only admins can generate quizzes with AI
router.post('/generate/ai', protect, authorize('admin'), generateQuizWithAI);
router.get('/ai/status', protect, authorize('admin'), getAIStatus);
```

**Flow:**
1. User must be logged in (JWT token required)
2. User must have `role: 'admin'` in database
3. Token is verified by `protect` middleware
4. Role is checked by `authorize('admin')` middleware

---

## 🚀 Setup Instructions

### 1. Get Groq API Key

1. Go to https://console.groq.com/keys
2. Sign up/Login
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### 2. Configure Backend

Edit `backend/.env`:
```env
GROQ_API_KEY=gsk_your_actual_api_key_here
AI_MODEL=llama-3.3-70b-versatile
```

### 3. Install Dependencies

```bash
cd backend
npm install openai
```

### 4. Start Backend

```bash
npm run dev
```

Verify in terminal:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

### 5. Test AI Status

From mobile app, navigate to:
Admin Dashboard → AI Quiz Generator

Should show: "AI is enabled using llama-3.3-70b-versatile"

---

## 🧪 Testing

### Test AI Generation (Node.js)

Create `test-ai-generation.js`:

```javascript
require('dotenv').config();
const OpenAI = require('openai').default;

async function testAI() {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: 'Generate a simple quiz question about JavaScript.' }
    ],
  });

  console.log(completion.choices[0].message.content);
}

testAI();
```

Run: `node test-ai-generation.js`

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **401 Invalid API Key**
**Cause:** API key not configured or invalid
**Solution:**
- Check `.env` file has correct `GROQ_API_KEY`
- Verify key is valid at https://console.groq.com/keys
- Restart backend server after changing `.env`

#### 2. **Loading Forever**
**Cause:** IP address mismatch or server not running
**Solution:**
- Check backend is running: `npm run dev`
- Verify IP in `mobile/src/services/api.ts` matches computer IP
- Run `ipconfig` to get correct IP
- Ensure phone and computer on same WiFi

#### 3. **Failed to Parse AI Response**
**Cause:** AI returned invalid JSON
**Solution:**
- Check console logs for actual AI response
- Adjust prompt to be more specific
- Try different model or temperature

#### 4. **Questions Too Generic**
**Cause:** Topic too broad or prompt not specific enough
**Solution:**
- Use more specific topics (e.g., "Photosynthesis in Plants" vs "Biology")
- Adjust difficulty level
- Increase temperature for more creative questions

---

## 📊 Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                     AI Quiz Generator Flow                     │
└───────────────────────────────────────────────────────────────┘

Mobile App (AIQuizGeneratorScreen)
    │
    │ 1. User enters topic: "Python Programming"
    │    Category: "Programming"
    │    Difficulty: "Medium"
    │    Questions: 10
    │
    ▼
[Generate Button Clicked]
    │
    │ 2. POST /api/quizzes/generate/ai
    │    Body: { topic, category, difficulty, numberOfQuestions }
    │    Headers: { Authorization: "Bearer <token>" }
    │
    ▼
Backend (aiQuizController.ts)
    │
    │ 3. Validate JWT token → Check admin role
    │
    ▼
    │ 4. Initialize Groq client
    │    API Key: GROQ_API_KEY from .env
    │    Base URL: https://api.groq.com/openai/v1
    │
    ▼
    │ 5. Build structured prompt with requirements
    │
    ▼
Groq API (Llama 3.3 70B)
    │
    │ 6. Process prompt with AI
    │    - Understand topic and requirements
    │    - Generate educational questions
    │    - Create plausible options
    │    - Format as JSON
    │
    ▼
    │ 7. Return AI response (JSON string)
    │
    ▼
Backend (aiQuizController.ts)
    │
    │ 8. Parse and validate JSON
    │    - Remove markdown blocks
    │    - Verify structure
    │    - Add metadata
    │
    ▼
    │ 9. Return to mobile app
    │    Status: 200 OK
    │    Data: { title, description, questions, ... }
    │
    ▼
Mobile App (AIQuizGeneratorScreen)
    │
    │ 10. Navigate to CreateQuizScreen
    │     Pass prefilledData
    │
    ▼
CreateQuizScreen
    │
    │ 11. Display AI-generated quiz
    │     Allow editing
    │
    ▼
    │ 12. User clicks "Create Quiz"
    │     POST /api/quizzes
    │
    ▼
Database (MongoDB)
    │
    │ 13. Save quiz with all questions
    │     Set generatedByAI: true
    │
    ▼
[Quiz Created Successfully]
```

---

## 💡 Best Practices

### 1. **Prompt Engineering**
- Be specific about requirements
- Request exact JSON structure
- Set clear rules for correctAnswer index
- Specify difficulty expectations

### 2. **Error Handling**
- Always validate AI response structure
- Have fallback for parsing errors
- Log errors for debugging
- Provide user-friendly error messages

### 3. **Performance**
- Set reasonable max_tokens (2000)
- Use appropriate temperature (0.7)
- Cache AI status check
- Show loading states

### 4. **Security**
- Never expose API keys in frontend
- Validate all inputs on backend
- Restrict to admin users only
- Sanitize AI-generated content

### 5. **User Experience**
- Show clear loading indicators
- Allow editing AI-generated content
- Provide topic suggestions
- Show preview before saving

---

## 🔮 Future Enhancements

### Potential Features

1. **Multiple AI Providers**
   - Support OpenAI GPT-4
   - Support Anthropic Claude
   - Allow user to choose provider

2. **Advanced Options**
   - Custom number of options (2-6)
   - Include explanations for answers
   - Generate hints for questions
   - Add images/diagrams

3. **Template System**
   - Save favorite generation settings
   - Quick generate from templates
   - Share templates with other admins

4. **Batch Generation**
   - Generate multiple quizzes at once
   - Schedule automatic generation
   - Generate quiz series

5. **Quality Control**
   - AI confidence scores
   - Automatic fact-checking
   - Duplicate question detection
   - Difficulty calibration

---

## 📚 References

- **Groq API Documentation:** https://console.groq.com/docs/overview
- **OpenAI SDK (used for compatibility):** https://github.com/openai/openai-node
- **Llama 3.3 Model:** https://www.llama.com/
- **React Navigation:** https://reactnavigation.org/
- **Express.js:** https://expressjs.com/

---

## 📝 License

This feature is part of the Quiz App project. All rights reserved.

---

## 👥 Contributors

- AI Integration: GitHub Copilot
- Backend Development: Quiz App Team
- Frontend Development: Quiz App Team

---

**Last Updated:** October 15, 2025
**Version:** 1.0.0
