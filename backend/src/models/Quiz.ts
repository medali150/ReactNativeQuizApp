import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct answer in options array
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v: string[]) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'Must have between 2 and 6 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
  },
});

const QuizSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
  },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function(v: IQuestion[]) {
        return v.length > 0;
      },
      message: 'Quiz must have at least one question',
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Quiz category is required'],
    enum: [
      'Science',
      'Mathematics',
      'History',
      'Geography',
      'Programming',
      'General Knowledge',
      'Literature',
      'Sports',
      'Entertainment',
      'Technology',
      'Other'
    ],
    default: 'General Knowledge',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  timeLimit: {
    type: Number,
    default: 30, // 30 minutes default
  },
}, {
  timestamps: true,
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
