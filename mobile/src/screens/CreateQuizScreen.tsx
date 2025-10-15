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

const CATEGORIES = [
  'Science', 'Mathematics', 'History', 'Geography', 'Programming',
  'General Knowledge', 'Literature', 'Sports', 'Entertainment', 'Technology', 'Other'
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function CreateQuizScreen({ route, navigation }: any) {
  const prefilledData = route?.params?.prefilledData;
  
  const [title, setTitle] = useState(prefilledData?.title || '');
  const [description, setDescription] = useState(prefilledData?.description || '');
  const [category, setCategory] = useState(prefilledData?.category || 'General Knowledge');
  const [difficulty, setDifficulty] = useState(prefilledData?.difficulty || 'medium');
  const [timeLimit, setTimeLimit] = useState(prefilledData?.timeLimit?.toString() || '30');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(
    prefilledData?.questions || [{ questionText: '', options: ['', ''], correctAnswer: 0 }]
  );

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    const hasEmptyQuestion = questions.some((q: any) => !q.questionText.trim());
    const hasEmptyOption = questions.some((q: any) => q.options.some((o: any) => !o.trim()));

    if (hasEmptyQuestion || hasEmptyOption) {
      Alert.alert('Error', 'Please fill in all questions and options');
      return;
    }

    setLoading(true);
    try {
      await quizAPI.createQuiz({
        title,
        description,
        category,
        difficulty,
        timeLimit: parseInt(timeLimit) || 30,
        questions,
      });
      Alert.alert('Success', 'Quiz created successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Quiz Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter quiz title"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter quiz description"
          multiline
        />

        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryOption, category === cat && styles.categoryOptionSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryOptionText, category === cat && styles.categoryOptionTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Difficulty *</Text>
        <View style={styles.difficultyContainer}>
          {DIFFICULTIES.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[styles.difficultyOption, difficulty === diff && styles.difficultyOptionSelected]}
              onPress={() => setDifficulty(diff)}
            >
              <Text style={[styles.difficultyOptionText, difficulty === diff && styles.difficultyOptionTextSelected]}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Time Limit (minutes) *</Text>
        <TextInput
          style={styles.input}
          value={timeLimit}
          onChangeText={setTimeLimit}
          placeholder="30"
          keyboardType="number-pad"
        />

        <Text style={styles.sectionTitle}>Questions</Text>

        {questions.map((question: any, qIndex: number) => (
          <View key={qIndex} style={styles.questionCard}>
            <Text style={styles.questionNumber}>Question {qIndex + 1}</Text>
            <TextInput
              style={styles.input}
              value={question.questionText}
              onChangeText={(text) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].questionText = text;
                setQuestions(newQuestions);
              }}
              placeholder="Enter question"
            />

            <Text style={styles.optionsLabel}>Options:</Text>
            {question.options.map((option: any, oIndex: number) => (
              <View key={oIndex} style={styles.optionRow}>
                <TouchableOpacity
                  onPress={() => {
                    const newQuestions = [...questions];
                    newQuestions[qIndex].correctAnswer = oIndex;
                    setQuestions(newQuestions);
                  }}
                  style={styles.radio}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      question.correctAnswer === oIndex && styles.radioSelected,
                    ]}
                  />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, styles.optionInput]}
                  value={option}
                  onChangeText={(text) => {
                    const newQuestions = [...questions];
                    newQuestions[qIndex].options[oIndex] = text;
                    setQuestions(newQuestions);
                  }}
                  placeholder={`Option ${oIndex + 1}`}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOptionButton}
              onPress={() => handleAddOption(qIndex)}
            >
              <Text style={styles.addOptionText}>+ Add Option</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Text style={styles.addButtonText}>+ Add Question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateQuiz}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Quiz</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerScroll: {
    marginBottom: 15,
  },
  categoryOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  categoryOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryOptionTextSelected: {
    color: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  difficultyOption: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  difficultyOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  difficultyOptionTextSelected: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    marginRight: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionInput: {
    flex: 1,
    marginBottom: 0,
  },
  addOptionButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  addOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
