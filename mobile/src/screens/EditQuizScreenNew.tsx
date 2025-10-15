import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { quizAPI } from '../services/api';
import { colors } from '../theme/colors';

export default function EditQuizScreenNew({ route, navigation }: any) {
  const { quiz } = route.params;
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [questions, setQuestions] = useState(quiz.questions);
  const [loading, setLoading] = useState(false);

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleUpdateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const newOptions = [...updatedQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: newOptions };
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) {
      Alert.alert('Error', 'Quiz must have at least one question');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedQuestions = questions.filter((_: any, i: number) => i !== index);
            setQuestions(updatedQuestions);
          },
        },
      ]
    );
  };

  const handleUpdateQuiz = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || q.questionText.trim() === '') {
        Alert.alert('Error', `Question ${i + 1} text is required`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j] || q.options[j].trim() === '') {
          Alert.alert('Error', `Question ${i + 1}, Option ${j + 1} is required`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      await quizAPI.updateQuiz(quiz._id, { title, description, questions });
      Alert.alert('Success', 'Quiz updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Quiz Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter quiz title"
            placeholderTextColor={colors.textLight}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter quiz description"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
            <Text style={styles.addButtonText}>+ Add Question</Text>
          </TouchableOpacity>
        </View>

        {questions.map((question: any, qIndex: number) => (
          <View key={qIndex} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {qIndex + 1}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveQuestion(qIndex)}
              >
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Question Text</Text>
            <TextInput
              style={[styles.input, styles.questionInput]}
              value={question.questionText}
              onChangeText={(value) => handleUpdateQuestion(qIndex, 'questionText', value)}
              placeholder="Enter question text"
              placeholderTextColor={colors.textLight}
              multiline
            />

            <Text style={styles.fieldLabel}>Options</Text>
            {question.options.map((option: string, oIndex: number) => (
              <View key={oIndex} style={styles.optionRow}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    question.correctAnswer === oIndex && styles.radioButtonSelected,
                  ]}
                  onPress={() => handleUpdateQuestion(qIndex, 'correctAnswer', oIndex)}
                >
                  {question.correctAnswer === oIndex && <View style={styles.radioButtonInner} />}
                </TouchableOpacity>
                <TextInput
                  style={styles.optionInput}
                  value={option}
                  onChangeText={(value) => handleUpdateOption(qIndex, oIndex, value)}
                  placeholder={`Option ${oIndex + 1}`}
                  placeholderTextColor={colors.textLight}
                />
              </View>
            ))}
            <Text style={styles.hint}>Tap the circle to select the correct answer</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateQuiz}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.updateButtonText}>💾 Update Quiz</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 13,
  },
  questionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    color: colors.textPrimary,
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
