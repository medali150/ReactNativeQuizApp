import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import { colors } from '../theme/colors';

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  'Science': '🔬',
  'Mathematics': '📐',
  'History': '📜',
  'Geography': '🌍',
  'Programming': '💻',
  'General Knowledge': '🧠',
  'Literature': '📚',
  'Sports': '⚽',
  'Entertainment': '🎬',
  'Technology': '📱',
  'Other': '📌',
};

export default function HomeScreenNew({ navigation }: any) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadQuizzesByCategory(selectedCategory);
    } else {
      loadAllQuizzes();
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadCategories(), loadAllQuizzes()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await quizAPI.getCategories();
      setCategories(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const loadAllQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load quizzes');
    } finally {
      setRefreshing(false);
    }
  };

  const loadQuizzesByCategory = async (category: string) => {
    try {
      const response = await quizAPI.getQuizzesByCategory(category);
      setQuizzes(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load quizzes for this category');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedCategory) {
      loadQuizzesByCategory(selectedCategory);
    } else {
      loadAllQuizzes();
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const renderCategoryItem = ({ item }: any) => {
    const isSelected = selectedCategory === item.name;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isSelected && styles.categoryChipSelected,
        ]}
        onPress={() => handleCategoryPress(item.name)}
      >
        <Text style={styles.categoryIcon}>{categoryIcons[item.name] || '📌'}</Text>
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {item.name}
        </Text>
        <View style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected]}>
          <Text style={[styles.categoryCount, isSelected && styles.categoryCountSelected]}>
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.accent;
      case 'hard':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const renderQuizItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.quizCard}
      onPress={() => navigation.navigate('Quiz', { quizId: item._id })}
    >
      <View style={styles.quizHeader}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagIcon}>{categoryIcons[item.category] || '📌'}</Text>
          <Text style={styles.categoryTagText}>{item.category}</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) + '20' },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(item.difficulty) },
            ]}
          >
            {item.difficulty || 'medium'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.quizTitle}>{item.title}</Text>
      <Text style={styles.quizDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.quizFooter}>
        <View style={styles.quizMeta}>
          <Text style={styles.metaText}>📝 {item.questions?.length || 0} questions</Text>
          <Text style={styles.metaText}>⏱️ {item.timeLimit || 30} min</Text>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.username}>{user?.username}! 👋</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}
        >
          <Text style={styles.profileButtonText}>
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item: any) => item.name}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Quizzes */}
      <View style={styles.quizzesSection}>
        <View style={styles.quizzesHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Quizzes` : 'All Quizzes'} ({quizzes.length})
          </Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilter}>Clear ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {quizzes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No quizzes available</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory
                ? `No quizzes in ${selectedCategory} category yet`
                : 'Check back later!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={quizzes}
            renderItem={renderQuizItem}
            keyExtractor={(item: any) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quizzesList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: colors.surface,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  categoriesSection: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 8,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  categoryBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeSelected: {
    backgroundColor: colors.white + '40',
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  categoryCountSelected: {
    color: colors.white,
  },
  quizzesSection: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  quizzesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearFilter: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  quizzesList: {
    paddingBottom: 20,
  },
  quizCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizMeta: {
    flexDirection: 'row',
  },
  metaText: {
    fontSize: 13,
    color: colors.textLight,
    marginRight: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
