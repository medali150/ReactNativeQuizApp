// Test Backend Connection
const axios = require('axios');

const API_URL = 'http://192.168.100.233:5000/api';

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
    console.error('❌ Server is NOT running!');
    console.error('Error:', error.message);
    console.log('');
    console.log('Please start the backend server:');
    console.log('cd backend && npm run dev');
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
    console.log('Response structure:', Object.keys(registerResponse.data));
    console.log('Response data:', JSON.stringify(registerResponse.data, null, 2));
    console.log('');

    // Test 3: Try to login with the test user
    console.log('3. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: registerResponse.data.data.email,
      password: 'test123456'
    });
    console.log('✅ Login works!');
    console.log('Response structure:', Object.keys(loginResponse.data));
    console.log('Response data:', JSON.stringify(loginResponse.data, null, 2));
    console.log('');
    
    console.log('=== SUCCESS ===');
    console.log('Backend authentication is working correctly!');
    console.log('');
    console.log('Make sure your mobile app is using the correct API_URL:');
    console.log(`API_URL = '${API_URL}'`);
    
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
