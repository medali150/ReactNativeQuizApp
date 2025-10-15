// Test Groq API Key
require('dotenv').config();
const OpenAI = require('openai').default;

async function testGroq() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('Testing Groq API...');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'MISSING');
  console.log('Base URL:', process.env.OPENAI_BASE_URL);
  console.log('Model:', process.env.AI_MODEL);
  console.log('');

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.error('❌ API key not configured!');
    console.log('Please add your Groq API key to .env file');
    console.log('Get your key from: https://console.groq.com/keys');
    return;
  }

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1',
    });

    console.log('Sending test request to Groq...');
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello from Groq!" and nothing else.',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0].message.content;
    console.log('✅ Success! Groq API is working!');
    console.log('Response:', response);
    console.log('');
    console.log('Model used:', completion.model);
    console.log('Tokens used:', completion.usage);
  } catch (error) {
    console.error('❌ Error testing Groq API:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('');
    
    if (error.status === 401) {
      console.log('The API key is INVALID or EXPIRED.');
      console.log('Please:');
      console.log('1. Go to https://console.groq.com/keys');
      console.log('2. Create a new API key');
      console.log('3. Update the OPENAI_API_KEY in your .env file');
      console.log('4. Restart the server');
    }
  }
}

testGroq();
