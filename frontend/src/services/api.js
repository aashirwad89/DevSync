/* eslint-disable no-unused-vars */
import axios from 'axios'

// Get API URL from environment or use default
const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with configuration
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Track retry attempts
let retryCount = 0
const MAX_RETRIES = 3

// ============= REQUEST INTERCEPTOR =============
API.interceptors.request.use(
  (config) => {
    // Log request (optional)
    console.log(`📤 Request: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// ============= RESPONSE INTERCEPTOR =============
API.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.statusText}`)
    retryCount = 0 // Reset retry count on success
    return response
  },
  (error) => {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request Timeout')
      return Promise.reject(new Error('Request timeout. Server is taking too long to respond.'))
    }

    if (!error.response) {
      // Network error
      console.error('🌐 Network Error:', error.message)
      
      if (error.code === 'ECONNREFUSED') {
        return Promise.reject(new Error(
          `Cannot connect to API server at ${API_BASE_URL}. Please make sure the backend is running.`
        ))
      }

      return Promise.reject(new Error(
        `Network error: ${error.message}. Check if the server is running and accessible.`
      ))
    }

    // Server responded with error status
    const { status, data } = error.response

    if (status === 404) {
      return Promise.reject(new Error(`API endpoint not found: ${error.config.url}`))
    }

    if (status === 500 || status === 502 || status === 503) {
      return Promise.reject(new Error(
        `Server error (${status}): ${data.error || 'Internal server error'}`
      ))
    }

    if (status === 400) {
      return Promise.reject(new Error(
        `Bad request: ${data.error || 'Invalid request parameters'}`
      ))
    }

    if (status === 401) {
      return Promise.reject(new Error('Unauthorized: Authentication required'))
    }

    if (status === 403) {
      return Promise.reject(new Error('Forbidden: You do not have permission'))
    }

    return Promise.reject(error)
  }
)

// ============= SEND MESSAGE =============
/**
 * Send a message to the AI and get response
 * @param {string} message - The user message
 * @returns {Promise} Response from server
 */
export const sendMessage = async (message) => {
  try {
    // Validate input
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string')
    }

    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty')
    }

    if (message.length > 5000) {
      throw new Error('Message is too long (max 5000 characters)')
    }

    console.log('📨 Sending message:', message.substring(0, 50) + '...')

    const response = await API.post('/chat', {
      message: message.trim()
    })

    // Validate response structure
    if (!response.data) {
      throw new Error('Empty response from server')
    }

    console.log('✅ Message sent successfully')
    return response.data

  } catch (error) {
    console.error('❌ Error in sendMessage:', error.message)
    throw error
  }
}

// ============= GET CHAT HISTORY =============
/**
 * Get chat history from server
 * @returns {Promise} Array of chat messages
 */
export const getChatHistory = async () => {
  try {
    console.log('📜 Fetching chat history...')

    const response = await API.get('/chat/history')

    if (!response.data) {
      throw new Error('Empty response from server')
    }

    console.log('✅ Chat history fetched successfully')
    return response.data

  } catch (error) {
    console.error('❌ Error in getChatHistory:', error.message)
    throw error
  }
}

// ============= CLEAR CHAT =============
/**
 * Clear chat history on server
 * @returns {Promise} Clear confirmation
 */
export const clearChat = async () => {
  try {
    console.log('🧹 Clearing chat history...')

    const response = await API.post('/chat/clear')

    if (!response.data) {
      throw new Error('Empty response from server')
    }

    console.log('✅ Chat cleared successfully')
    return response.data

  } catch (error) {
    console.error('❌ Error in clearChat:', error.message)
    throw error
  }
}

// ============= CHECK API CONNECTION =============
/**
 * Check if API server is alive
 * @returns {Promise<boolean>} True if server is running
 */
export const checkConnection = async () => {
  try {
    console.log('🔍 Checking API connection...')

    const response = await API.get('/health', {
      timeout: 5000 // Shorter timeout for health check
    })

    console.log('✅ API connection successful')
    return true

  } catch (error) {
    console.error('❌ API connection failed:', error.message)
    return false
  }
}

// ============= RETRY WRAPPER =============
/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Max number of retries
 * @returns {Promise} Result from function
 */
const retryWithBackoff = async (fn, maxRetries = MAX_RETRIES) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      // Don't retry on validation errors
      if (error.message.includes('must be') || error.message.includes('cannot')) {
        throw error
      }

      if (i === maxRetries - 1) throw error

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000
      console.log(`⏳ Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// ============= SEND MESSAGE WITH RETRY =============
/**
 * Send message with automatic retry on failure
 * @param {string} message - The user message
 * @returns {Promise} Response from server
 */
export const sendMessageWithRetry = async (message) => {
  return retryWithBackoff(() => sendMessage(message))
}

// ============= BATCH REQUEST =============
/**
 * Send multiple messages and get responses (if API supports it)
 * @param {Array<string>} messages - Array of messages
 * @returns {Promise} Response from server
 */
export const sendBatch = async (messages) => {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array')
    }

    console.log(`📨 Sending ${messages.length} messages...`)

    const response = await API.post('/chat/batch', {
      messages: messages
    })

    console.log('✅ Batch sent successfully')
    return response.data

  } catch (error) {
    console.error('❌ Error in sendBatch:', error.message)
    throw error
  }
}

// ============= STREAM MESSAGE (if backend supports) =============
/**
 * Send message and stream response (for real-time streaming)
 * @param {string} message - The user message
 * @param {Function} onChunk - Callback for each chunk received
 * @returns {Promise} Final response
 */
export const streamMessage = async (message, onChunk) => {
  try {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string')
    }

    console.log('📨 Streaming message...')

    const response = await API.post('/chat/stream', 
      { message: message.trim() },
      {
        responseType: 'stream',
        onDownloadProgress: (event) => {
          if (onChunk) {
            onChunk(event.currentTarget.response)
          }
        }
      }
    )

    console.log('✅ Stream completed successfully')
    return response.data

  } catch (error) {
    console.error('❌ Error in streamMessage:', error.message)
    throw error
  }
}

// ============= GET API STATUS =============
/**
 * Get detailed API server status
 * @returns {Promise} Server status information
 */
export const getApiStatus = async () => {
  try {
    console.log('📊 Fetching API status...')

    const response = await API.get('/status')

    console.log('✅ API status fetched')
    return response.data

  } catch (error) {
    console.error('❌ Error getting API status:', error.message)
    throw error
  }
}

// ============= HANDLE ERRORS GRACEFULLY =============
/**
 * Parse error and return user-friendly message
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Unknown error occurred'

  // Network errors
  if (error.code === 'ECONNREFUSED') {
    return '❌ Cannot connect to backend. Please make sure the server is running on port 8000.'
  }

  if (error.code === 'ENOTFOUND') {
    return '❌ Cannot reach API server. Check your API URL configuration.'
  }

  if (error.message.includes('timeout')) {
    return '⏱️ Request timeout. The server is taking too long to respond.'
  }

  if (error.message.includes('Network')) {
    return '🌐 Network error. Check your internet connection.'
  }

  // HTTP errors
  if (error.response?.status === 404) {
    return '❌ API endpoint not found. Check server configuration.'
  }

  if (error.response?.status === 500) {
    return '❌ Server error. Check server logs for details.'
  }

  if (error.response?.status === 503) {
    return '❌ Server is unavailable. Please try again later.'
  }

  // Validation errors
  if (error.message.includes('cannot be empty')) {
    return '⚠️ Please enter a message.'
  }

  if (error.message.includes('too long')) {
    return '⚠️ Message is too long (max 5000 characters).'
  }

  // Default
  return error.message || 'Something went wrong. Please try again.'
}

// ============= EXPORT EVERYTHING =============
export default API