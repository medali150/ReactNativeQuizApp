import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { userAPI } from '../services/api';
import { colors } from '../theme/colors';

export default function AdminUsersScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleDeleteUser = (userId: string, username: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userAPI.deleteUser(userId);
              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const userCount = users.filter((u) => u.role === 'user').length;
    return { totalUsers, adminCount, userCount };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.secondary + '15' }]}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{stats.adminCount}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.accent + '15' }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>{stats.userCount}</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or role..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Users List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? '🔍 No users found' : '👥 No users yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Users will appear here'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user, index) => (
            <View key={user._id || index} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarTextSmall}>
                    {user.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor:
                            user.role === 'admin'
                              ? colors.secondary + '20'
                              : colors.primary + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          {
                            color: user.role === 'admin' ? colors.secondary : colors.primary,
                          },
                        ]}
                      >
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDate}>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user._id, user.username)}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearIcon: {
    fontSize: 20,
    color: colors.textLight,
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
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
  },
  userCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTextSmall: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
});
