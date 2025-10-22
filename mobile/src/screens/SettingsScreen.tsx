import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getApiUrl, updateApiUrl, testApiConnection } from '../services/api';

export default function SettingsScreen({ navigation }: any) {
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadCurrentUrl();
  }, []);

  const loadCurrentUrl = () => {
    const currentUrl = getApiUrl();
    // Remove '/api' suffix to show just the base URL
    const baseUrl = currentUrl.replace('/api', '');
    setApiUrl(baseUrl);
  };

  const handleTest = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }

    setTesting(true);
    try {
      const fullUrl = apiUrl.includes('/api') ? apiUrl : `${apiUrl}/api`;
      const result = await testApiConnection(fullUrl);
      
      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Connection Failed', result.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to test connection');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'Please enter a server URL');
      return;
    }

    // Validate URL format
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      Alert.alert('Error', 'URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      // Test connection first
      const fullUrl = apiUrl.includes('/api') ? apiUrl : `${apiUrl}/api`;
      const result = await testApiConnection(fullUrl);
      
      if (result.success) {
        await updateApiUrl(fullUrl);
        Alert.alert(
          'Success',
          'API URL updated successfully! Please restart the app.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          `${result.message}\n\nDo you still want to save this URL?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save Anyway',
              onPress: async () => {
                await updateApiUrl(fullUrl);
                Alert.alert('Saved', 'URL saved. Make sure the server is running before using the app.');
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save URL');
    } finally {
      setLoading(false);
    }
  };

  const getIpInstructions = () => {
    return `To find your computer's IP address:

Windows:
1. Open Command Prompt
2. Run: ipconfig
3. Look for "IPv4 Address"

Mac/Linux:
1. Open Terminal
2. Run: ifconfig
3. Look for "inet" under your WiFi adapter

Format: http://YOUR_IP:5000`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Server Settings</Text>
        <Text style={styles.subtitle}>Configure backend server connection</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Current URL</Text>
          <Text style={styles.infoText}>{getApiUrl()}</Text>
        </View>

        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>📋 How to get your IP address:</Text>
          <Text style={styles.instructionsText}>{getIpInstructions()}</Text>
        </View>

        <Text style={styles.label}>Server URL *</Text>
        <TextInput
          style={styles.input}
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder="http://192.168.1.194:5000"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <Text style={styles.hint}>
          Enter your computer's IP address with port 5000
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={handleTest}
          disabled={testing || loading}
        >
          {testing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🔍 Test Connection</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading || testing}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Save & Apply</Text>
          )}
        </TouchableOpacity>

        <View style={styles.examplesBox}>
          <Text style={styles.examplesTitle}>📝 Examples:</Text>
          <Text style={styles.exampleText}>• http://192.168.1.194:5000</Text>
          <Text style={styles.exampleText}>• http://192.168.100.20:5000</Text>
          <Text style={styles.exampleText}>• http://10.0.0.5:5000</Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Make sure your phone and computer are on the same WiFi network!
          </Text>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#0D47A1',
    fontFamily: 'monospace',
  },
  instructionsBox: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#34C759',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  examplesBox: {
    backgroundColor: '#F3E5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 13,
    color: '#6A1B9A',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  warningText: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: '600',
  },
});
