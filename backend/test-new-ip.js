// Test Backend Connection with correct IP
const axios = require('axios');

const API_URL = 'http://192.168.1.194:5000/api';

async function testBackend() {
  console.log('Testing backend connection...');
  console.log('API URL:', API_URL);
  console.log('');

  // Test 1: Check if server is running
  try {
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Server is running!');
    console.log('Response:', healthResponse.data);
    console.log('');
  } catch (error) {
    console.error('❌ Server is NOT accessible from this IP!');
    console.error('Error:', error.message);
    console.log('');
    console.log('The server is running on localhost:5000 but not accessible from 192.168.1.194');
    console.log('');
    console.log('Solutions:');
    console.log('1. Check Windows Firewall - allow Node.js');
    console.log('2. Make sure your phone and computer are on the SAME WiFi network');
    console.log('3. Try using your phone as a hotspot and connect your computer to it');
    return;
  }

  // Test 2: Try to register a test user
  try {
    console.log('2. Testing registration endpoint...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@test.com`,
      password: 'test123456',
      role: 'user'
    });
    console.log('✅ Registration works!');
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
    console.log('');

    // Test 3: Try to login with the test user
    console.log('3. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: registerResponse.data.data.email,
      password: 'test123456'
    });
    console.log('✅ Login works!');
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    console.log('');
    
    console.log('=== SUCCESS ===');
    console.log('Backend authentication is working correctly!');
    console.log('Your mobile app should now be able to connect.');
    
  } catch (error) {
    console.error('❌ Authentication failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testBackend();
