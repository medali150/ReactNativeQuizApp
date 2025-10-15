// Test Groq API with correct env variable
require('dotenv').config();
const OpenAI = require('openai').default;

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY; // Using GROQ_API_KEY instead of OPENAI_API_KEY
  
  console.log('Testing Groq API with correct configuration...');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'MISSING');
  console.log('');

  if (!apiKey) {
    console.error('❌ GROQ_API_KEY not found in .env file!');
    return;
  }

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    console.log('Sending test request to Groq...');
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello from Groq!" and nothing else.',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0].message.content;
    console.log('✅ SUCCESS! Groq API is working!');
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
      console.log('The API key is still INVALID.');
      console.log('');
      console.log('Please double-check:');
      console.log('1. You copied the COMPLETE API key from https://console.groq.com/keys');
      console.log('2. There are no spaces or hidden characters in the .env file');
      console.log('3. The API key starts with "gsk_"');
      console.log('4. Try creating a BRAND NEW API key if this one doesn\'t work');
    }
  }
}

testGroq();
