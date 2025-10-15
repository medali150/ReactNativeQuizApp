import { Response } from 'express';
import Quiz from '../models/Quiz';
import Submission from '../models/Submission';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
export const getAllQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username').select('-questions.correctAnswer');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Hide correct answers for regular users
    let quizData = quiz.toObject();
    if (req.user?.role !== 'admin') {
      quizData.questions = quizData.questions.map((q: any) => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
    }

    res.status(200).json({
      success: true,
      data: quizData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, questions, category, difficulty, timeLimit } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      category,
      difficulty,
      timeLimit,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers',
      });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Save submission
    const submission = await Submission.create({
      userId: req.user?._id,
      quizId: quiz._id,
      answers,
      score,
      totalQuestions: quiz.questions.length,
    });

    res.status(200).json({
      success: true,
      data: {
        score,
        totalQuestions: quiz.questions.length,
        percentage: (score / quiz.questions.length) * 100,
        submission,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user submissions
// @route   GET /api/quizzes/submissions
// @access  Private
export const getUserSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const submissions = await Submission.find({ userId: req.user?._id })
      .populate('quizId', 'title description')
      .sort('-submittedAt');

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get available quiz categories
// @route   GET /api/quizzes/categories
// @access  Private
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = [
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
    ];

    // Get quiz count per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Quiz.countDocuments({ category });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quizzes by category
// @route   GET /api/quizzes/category/:category
// @access  Private
export const getQuizzesByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find({ category: req.params.category })
      .populate('createdBy', 'username')
      .select('-questions.correctAnswer')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
