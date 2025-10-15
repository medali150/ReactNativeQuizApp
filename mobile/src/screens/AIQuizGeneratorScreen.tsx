import React, { useState, useEffect } from 'react';
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

const CATEGORIES = [
  'General Knowledge',
  'Science',
  'History',
  'Geography',
  'Mathematics',
  'Programming',
  'Literature',
  'Sports',
  'Entertainment',
  'Technology',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15, 20];

export default function AIQuizGeneratorScreen({ navigation }: any) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('General Knowledge');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await quizAPI.getAIStatus();
      setAiEnabled(response.data.enabled);
      if (!response.data.enabled) {
        Alert.alert('AI Not Configured', response.data.message);
      }
    } catch (error) {
      console.error('Error checking AI status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic for the quiz');
      return;
    }

    if (!aiEnabled) {
      Alert.alert(
        'AI Not Available',
        'OpenAI API key is not configured. Please contact your administrator to set up AI quiz generation.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await quizAPI.generateQuizWithAI({
        topic: topic.trim(),
        category,
        difficulty,
        numberOfQuestions,
      });

      Alert.alert(
        'Quiz Generated Successfully! 🎉',
        'Review and save the AI-generated quiz',
        [
          {
            text: 'Review Quiz',
            onPress: () => {
              // Navigate to create quiz screen with pre-filled data
              navigation.navigate('CreateQuiz', {
                prefilledData: response.data,
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      Alert.alert(
        'Generation Failed',
        error.response?.data?.message || 'Failed to generate quiz with AI. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const CategoryButton = ({ cat }: { cat: string }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        category === cat && styles.optionButtonSelected,
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text
        style={[
          styles.optionText,
          category === cat && styles.optionTextSelected,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const DifficultyButton = ({ diff }: { diff: string }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        difficulty === diff && styles.optionButtonSelected,
      ]}
      onPress={() => setDifficulty(diff)}
    >
      <Text
        style={[
          styles.optionText,
          difficulty === diff && styles.optionTextSelected,
        ]}
      >
        {diff}
      </Text>
    </TouchableOpacity>
  );

  const QuestionCountButton = ({ count }: { count: number }) => (
    <TouchableOpacity
      style={[
        styles.countButton,
        numberOfQuestions === count && styles.countButtonSelected,
      ]}
      onPress={() => setNumberOfQuestions(count)}
    >
      <Text
        style={[
          styles.countText,
          numberOfQuestions === count && styles.countTextSelected,
        ]}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );

  if (checkingStatus) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking AI availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.headerTitle}>AI Quiz Generator</Text>
          <Text style={styles.headerSubtitle}>
            Let AI create a complete quiz for you instantly!
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: aiEnabled ? colors.accent + '20' : colors.error + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: aiEnabled ? colors.accent : colors.error }
            ]}>
              {aiEnabled ? '✓ AI Enabled' : '✕ AI Disabled'}
            </Text>
          </View>
        </View>

        {/* Topic Input */}
        <View style={styles.card}>
          <Text style={styles.label}>Quiz Topic *</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g., Ancient Egypt, Python Programming, World War II..."
            placeholderTextColor={colors.textLight}
            multiline
          />
          <Text style={styles.hint}>💡 Be specific for better results</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionsGrid}>
            {CATEGORIES.map((cat) => (
              <CategoryButton key={cat} cat={cat} />
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.card}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.optionsRow}>
            {DIFFICULTIES.map((diff) => (
              <DifficultyButton key={diff} diff={diff} />
            ))}
          </View>
        </View>

        {/* Number of Questions */}
        <View style={styles.card}>
          <Text style={styles.label}>Number of Questions</Text>
          <View style={styles.optionsRow}>
            {QUESTION_COUNTS.map((count) => (
              <QuestionCountButton key={count} count={count} />
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (loading || !aiEnabled) && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerateQuiz}
          disabled={loading || !aiEnabled}
        >
          {loading ? (
            <>
              <ActivityIndicator color={colors.white} style={styles.buttonLoader} />
              <Text style={styles.generateButtonText}>Generating Quiz...</Text>
            </>
          ) : (
            <>
              <Text style={styles.generateButtonIcon}>✨</Text>
              <Text style={styles.generateButtonText}>Generate Quiz with AI</Text>
            </>
          )}
        </TouchableOpacity>

        {!aiEnabled && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              AI quiz generation requires an OpenAI API key.{'\n'}
              Add OPENAI_API_KEY to your backend .env file to enable this feature.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  countButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  countButtonSelected: {
    backgroundColor: colors.secondary + '20',
    borderColor: colors.secondary,
  },
  countText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  countTextSelected: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  buttonLoader: {
    marginRight: 8,
  },
  generateButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  generateButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  warningCard: {
    backgroundColor: colors.warning + '15',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.warning + '40',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
