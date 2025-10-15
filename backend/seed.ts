import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Quiz from './src/models/Quiz';
import connectDB from './src/config/database';

dotenv.config();

const sampleQuizzes = [
  {
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    category: 'Programming',
    difficulty: 'easy',
    timeLimit: 15,
    questions: [
      {
        questionText: 'What is the correct syntax for creating a function in JavaScript?',
        options: ['function myFunc() {}', 'def myFunc():', 'function:myFunc() {}', 'create myFunc() {}'],
        correctAnswer: 0,
      },
      {
        questionText: 'Which company developed JavaScript?',
        options: ['Microsoft', 'Netscape', 'Google', 'Apple'],
        correctAnswer: 1,
      },
      {
        questionText: 'What does DOM stand for?',
        options: ['Data Object Model', 'Document Object Model', 'Display Object Management', 'Digital Ordinance Model'],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: 'React Fundamentals',
    description: 'Learn about React.js core concepts',
    category: 'Frontend',
    difficulty: 'medium',
    timeLimit: 20,
    questions: [
      {
        questionText: 'What is JSX in React?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript Extra'],
        correctAnswer: 0,
      },
      {
        questionText: 'Which hook is used for side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
      },
      {
        questionText: 'What is the virtual DOM?',
        options: [
          'A copy of the real DOM kept in memory',
          'A database for React',
          'A styling library',
          'A routing system',
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    title: 'General Knowledge',
    description: 'Test your general knowledge across various topics',
    category: 'General',
    difficulty: 'easy',
    timeLimit: 10,
    questions: [
      {
        questionText: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
      },
      {
        questionText: 'How many continents are there?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
      },
      {
        questionText: 'What is the largest planet in our solar system?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 2,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Quiz.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      username: 'admin',
      email: 'admin@quizapp.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // Create regular user
    console.log('Creating regular user...');
    const user = await User.create({
      username: 'testuser',
      email: 'user@quizapp.com',
      password: 'user123',
      role: 'user',
    });
    console.log('User created:', user.email);

    // Create sample quizzes
    console.log('Creating sample quizzes...');
    for (const quizData of sampleQuizzes) {
      const quiz = await Quiz.create({
        ...quizData,
        createdBy: admin._id,
      });
      console.log(`Quiz created: ${quiz.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('-------------------');
    console.log('Admin:');
    console.log('  Email: admin@quizapp.com');
    console.log('  Password: admin123');
    console.log('\nUser:');
    console.log('  Email: user@quizapp.com');
    console.log('  Password: user123');
    console.log('-------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
