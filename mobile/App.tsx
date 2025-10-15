import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreenNew from './src/screens/HomeScreenNew';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import QuizScreen from './src/screens/QuizScreen';
import CreateQuizScreen from './src/screens/CreateQuizScreen';
import EditQuizScreenNew from './src/screens/EditQuizScreenNew';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminUsersScreen from './src/screens/AdminUsersScreen';
import AIQuizGeneratorScreen from './src/screens/AIQuizGeneratorScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreenNew}
        options={{ title: 'Quiz App', headerShown: false }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Take Quiz' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuizScreen}
        options={{ title: 'Create Quiz' }}
      />
      <Stack.Screen
        name="EditQuiz"
        component={EditQuizScreenNew}
        options={{ title: 'Edit Quiz' }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen
        name="AIQuizGenerator"
        component={AIQuizGeneratorScreen}
        options={{ title: 'AI Quiz Generator' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'admin' ? (
        <AdminStack />
      ) : (
        <UserStack />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
