import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { quizAPI } from '../services/api';

export default function QuizScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(quizId);
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(-1));
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load quiz');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      Alert.alert('Please select an answer', 'You must select an answer before continuing');
      return;
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === -1).length;
    if (unanswered > 0) {
      Alert.alert(
        'Unanswered Questions',
        `You have ${unanswered} unanswered question(s). Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: submitQuiz },
        ]
      );
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await quizAPI.submitQuiz(quizId, answers);
      setResults(response.data);
      setShowResults(true);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Quiz Complete! 🎉</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>{results.score}/{results.totalQuestions}</Text>
            <Text style={styles.percentageText}>{results.percentage.toFixed(1)}%</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Text>
      </View>

      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.questionText}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestion] === index && styles.optionSelected,
              ]}
              onPress={() => handleAnswer(index)}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[currentQuestion] === index && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  percentageText: {
    fontSize: 24,
    color: '#666',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
