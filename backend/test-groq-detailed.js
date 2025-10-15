// Detailed Groq API Test
require('dotenv').config();
const https = require('https');

async function testGroqRaw() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('=== DETAILED GROQ API TEST ===\n');
  console.log('API Key from .env:', apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key starts with "gsk_":', apiKey ? apiKey.startsWith('gsk_') : false);
  console.log('');

  const data = JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [
      {
        role: 'user',
        content: 'Say hello'
      }
    ],
    max_tokens: 50
  });

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('Request details:');
  console.log('URL: https://api.groq.com/openai/v1/chat/completions');
  console.log('Auth Header:', `Bearer ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log('');

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
        console.log('Response Body:', body);
        console.log('');

        if (res.statusCode === 200) {
          console.log('✅ SUCCESS! API key is working!');
          const response = JSON.parse(body);
          console.log('AI Response:', response.choices[0].message.content);
        } else {
          console.log('❌ FAILED! Check the error above.');
          console.log('');
          console.log('Troubleshooting:');
          console.log('1. Make sure you copied the ENTIRE API key from Groq console');
          console.log('2. Check if there are spaces before/after the key in .env');
          console.log('3. Try creating a NEW API key if this one doesn\'t work');
          console.log('4. Make sure your Groq account is verified');
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Request Error:', e);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

testGroqRaw().catch(console.error);
