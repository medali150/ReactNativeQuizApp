import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: number[]; // array of selected answer indices
  score: number;
  totalQuestions: number;
  submittedAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: {
    type: [Number],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
