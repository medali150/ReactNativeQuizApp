import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';

export default function AdminDashboardScreen({ navigation }: any) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load quizzes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuizzes();
  };

  const handleDeleteQuiz = (quizId: string, quizTitle: string) => {
    Alert.alert(
      'Delete Quiz',
      `Are you sure you want to delete "${quizTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await quizAPI.deleteQuiz(quizId);
              Alert.alert('Success', 'Quiz deleted successfully');
              loadQuizzes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete quiz');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const renderQuizItem = ({ item }: any) => (
    <View style={styles.quizCard}>
      <TouchableOpacity
        style={styles.quizContent}
        onPress={() => navigation.navigate('EditQuiz', { quiz: item })}
      >
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.quizMeta}>
          <Text style={styles.metaText}>📝 {item.questions?.length || 0} questions</Text>
          <Text style={styles.metaText}>⏱️ {item.timeLimit || 30} min</Text>
          <Text style={styles.metaText}>🎯 {item.difficulty || 'Medium'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditQuiz', { quiz: item })}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuiz(item._id, item.title)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#6366F1' }]}
            onPress={() => navigation.navigate('CreateQuiz')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Create Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('AIQuizGenerator')}
          >
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionText}>AI Generator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#EC4899' }]}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>All Quizzes</Text>
      </View>

      {quizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No quizzes yet</Text>
          <Text style={styles.emptySubtext}>Create your first quiz!</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
  },
  quickActionsScroll: {
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionCard: {
    width: 140,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizContent: {
    padding: 20,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  editButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
});
