const axios = require('axios');

// ============= GEMINI API SETUP =============
// ✅ API Key - .env file se aayega
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ API URL - Google ka Gemini endpoint
const GEMINI_API_URL = 
'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

console.log('🔧 Chat Controller Initialized');
console.log('✅ GEMINI_API_KEY Status:', GEMINI_API_KEY ? 'Present' : '❌ Missing from .env');

// ============= CHAT CONTROLLER =============

/**
 * ✅ Send message to Gemini AI and get response
 */
const sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message must be a non-empty string'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message cannot be empty'
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        error: 'Message is too long (max 5000 characters)'
      });
    }

    console.log(`📨 Chat Message: ${message.substring(0, 50)}...`);

    // ✅ Check if API key exists - CRITICAL!
    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env file');
      return res.status(500).json({
        error: 'API configuration error',
        message: 'GEMINI_API_KEY is not configured. Please add it to .env file'
      });
    }

    console.log('🤖 Calling Gemini API...');

    // ✅ Call Gemini API - yeh fix hai! (getGeminiResponse function use kar raha hai)
    const aiResponse = await getGeminiResponse(message);

    res.status(200).json({
      success: true,
      message: message,
      reply: aiResponse,
      timestamp: new Date().toISOString(),
      model: 'Gemini Pro'
    });

  } catch (error) {
    console.error('❌ Error in sendMessage:', error.message);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
};

/**
 * ✅ Get chat history from database
 */
const getChatHistory = async (req, res) => {
  try {
    console.log('📜 Fetching chat history...');

    // TODO: Fetch from database
    const history = [];

    res.status(200).json({
      success: true,
      history: history,
      count: history.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in getChatHistory:', error.message);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      message: error.message
    });
  }
};

/**
 * ✅ Clear chat history from database
 */
const clearChat = async (req, res) => {
  try {
    console.log('🧹 Clearing chat history...');

    // TODO: Clear from database
    
    res.status(200).json({
      success: true,
      message: 'Chat history cleared',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in clearChat:', error.message);
    res.status(500).json({
      error: 'Failed to clear chat history',
      message: error.message
    });
  }
};

/**
 * ✅ MAIN FUNCTION: Call Gemini API and extract response
 * @param {string} message - User ka message
 * @returns {Promise<string>} Gemini ka response
 */
const getGeminiResponse = async (message) => {
  try {
    console.log('📡 Preparing Gemini API request...');
    console.log('   URL:', GEMINI_API_URL);
    console.log('   Message length:', message.length);

    // ✅ Step 1: Build request body - Exact format required by Gemini
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,      // How creative (0-1)
        topK: 40,              // Diversity control
        topP: 0.95,            // Nucleus sampling
        maxOutputTokens: 1024, // Max response length
      }
    };

    console.log('📤 Sending request to Gemini API...');

    // ✅ Step 2: Make POST request to Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('✅ Response received from Gemini API');
    console.log('   Status:', response.status);

    // ✅ Step 3: Extract text from Gemini's response
    // Gemini returns: response.data.candidates[0].content.parts[0].text
    if (response.data && 
        response.data.candidates && 
        response.data.candidates.length > 0 &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0) {
      
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini Response extracted successfully');
      console.log('   Response length:', aiResponse.length, 'characters');
      
      return aiResponse; // ✅ Return actual Gemini response
    } else {
      console.error('❌ Unexpected Gemini response format');
      console.error('   Response:', JSON.stringify(response.data, null, 2));
      return 'Error: Gemini returned unexpected response format. Please try again.';
    }

  } catch (error) {
    console.error('❌ Gemini API Error occurred');
    console.error('   Error type:', error.constructor.name);
    console.error('   Error message:', error.message);
    
    // ✅ Better error handling for different status codes
    if (error.response?.status === 400) {
      console.error('   Status 400: Bad Request');
      return `❌ Bad Request (400): ${error.response.data?.error?.message || 'Invalid message format'}`;
    } 
    else if (error.response?.status === 401) {
      console.error('   Status 401: Unauthorized - Invalid API Key');
      return '❌ Authentication failed (401): Invalid or expired Gemini API key. Check your .env file.';
    } 
    else if (error.response?.status === 403) {
      console.error('   Status 403: Forbidden');
      return '❌ Forbidden (403): Your API key doesn\'t have permission. Enable Generative Language API.';
    }
    else if (error.response?.status === 404) {
      console.error('   Status 404: Not Found');
      return '❌ Not Found (404): API endpoint not found. Check your API key or enable the API.';
    }
    else if (error.response?.status === 429) {
      console.error('   Status 429: Rate Limited');
      return '❌ Rate Limited (429): Too many requests. Wait and try again.';
    } 
    else if (error.response?.status === 500) {
      console.error('   Status 500: Server Error');
      return '❌ Server Error (500): Google API server error. Try again later.';
    }
    else if (error.code === 'ECONNREFUSED') {
      console.error('   Error: Connection Refused');
      return '❌ Connection Error: Cannot reach Gemini API. Check your internet connection.';
    } 
    else if (error.code === 'ENOTFOUND') {
      console.error('   Error: Domain Not Found');
      return '❌ DNS Error: Cannot resolve Gemini API server. Check your internet.';
    }
    else if (error.message?.includes('timeout')) {
      console.error('   Error: Request Timeout');
      return '❌ Timeout: Gemini API took too long to respond. Try again.';
    }
    else {
      console.error('   Error: Unknown error');
      return `❌ Error: ${error.message}`;
    }
  }
};

// ============= EXPORTS =============
module.exports = {
  sendMessage,
  getChatHistory,
  clearChat,
  getGeminiResponse
};