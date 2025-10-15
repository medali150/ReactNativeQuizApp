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
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import { colors } from '../theme/colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
  });

  useEffect(() => {
    fetchUserSubmissions();
  }, []);

  const fetchUserSubmissions = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getUserSubmissions();
      setSubmissions(response.data);
      
      // Calculate stats
      if (response.data.length > 0) {
        const scores = response.data.map((s: any) => s.score);
        const total = scores.reduce((a: number, b: number) => a + b, 0);
        setStats({
          totalQuizzes: response.data.length,
          averageScore: Math.round(total / response.data.length),
          bestScore: Math.max(...scores),
        });
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>Your Statistics</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalQuizzes}
            </Text>
            <Text style={styles.statLabel}>Quizzes Taken</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.accent + '15' }]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {stats.averageScore}%
            </Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.secondary + '15' }]}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              {stats.bestScore}%
            </Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        {/* Recent Submissions */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝 No quizzes taken yet</Text>
            <Text style={styles.emptySubtext}>Start taking quizzes to see your progress!</Text>
          </View>
        ) : (
          submissions.slice(0, 5).map((submission, index) => (
            <View key={index} style={styles.submissionCard}>
              <View style={styles.submissionHeader}>
                <Text style={styles.submissionTitle}>{submission.quiz?.title || 'Quiz'}</Text>
                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor:
                        submission.score >= 80
                          ? colors.accent + '20'
                          : submission.score >= 60
                          ? colors.warning + '20'
                          : colors.error + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      {
                        color:
                          submission.score >= 80
                            ? colors.accent
                            : submission.score >= 60
                            ? colors.warning
                            : colors.error,
                      },
                    ]}
                  >
                    {submission.score}%
                  </Text>
                </View>
              </View>
              <Text style={styles.submissionDate}>
                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          ))
        )}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
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
  headerCard: {
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
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
  submissionCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  submissionDate: {
    fontSize: 13,
    color: colors.textLight,
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
