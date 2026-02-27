// Store messages in memory (replace with database later)
let chatHistory = []

// ============= SEND MESSAGE =============
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required',
        status: 'error'
      })
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message cannot be empty',
        status: 'error'
      })
    }

    if (message.length > 5000) {
      return res.status(400).json({ 
        error: 'Message too long (max 5000 characters)',
        status: 'error'
      })
    }

    console.log(`📩 User message: ${message}`)

    // Save user message
    chatHistory.push({
      id: chatHistory.length,
      role: 'user',
      message: message,
      timestamp: new Date()
    })

    // Generate response
    const reply = generateResponse(message)

    // Save AI response
    chatHistory.push({
      id: chatHistory.length,
      role: 'assistant',
      message: reply,
      timestamp: new Date()
    })

    console.log(`🤖 AI response: ${reply}`)

    res.json({
      reply: reply,
      status: 'success',
      messageCount: chatHistory.length
    })

  } catch (error) {
    console.error('❌ Error in sendMessage:', error)
    res.status(500).json({
      error: error.message || 'Internal server error',
      status: 'error'
    })
  }
}

// ============= GET CHAT HISTORY =============
exports.getChatHistory = (req, res) => {
  try {
    res.json({
      history: chatHistory,
      count: chatHistory.length,
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: 'error'
    })
  }
}

// ============= CLEAR CHAT =============
exports.clearChat = (req, res) => {
  try {
    chatHistory = []
    res.json({
      message: 'Chat cleared successfully',
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: 'error'
    })
  }
}

// ============= GET MESSAGE BY ID =============
exports.getMessageById = (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (id < 0 || id >= chatHistory.length) {
      return res.status(404).json({ 
        error: 'Message not found',
        status: 'error'
      })
    }

    res.json({
      message: chatHistory[id],
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: 'error'
    })
  }
}

// ============= GENERATE RESPONSE (Logic) =============
function generateResponse(message) {
  const msg = message.toLowerCase()

  // Keyword-based responses
  if (msg.includes('hello') || msg.includes('hi')) {
    return '👋 Hello! How can I help you with coding today?'
  }
  
  if (msg.includes('help') || msg.includes('what can you do')) {
    return `💚 I can help you with:
    • Code explanation
    • Debugging errors
    • Code optimization
    • Best practices
    • React tips
    • JavaScript help
    
    Just ask me anything!`
  }

  if (msg.includes('javascript')) {
    return '🎯 JavaScript! Great choice. I can help with ES6+, async/await, promises, closures, etc. What do you need?'
  }

  if (msg.includes('react')) {
    return '⚛️ React! I can help with components, hooks, state management, context API, and more. What\'s your question?'
  }

  if (msg.includes('debug') || msg.includes('error')) {
    return '🐛 Let\'s debug this! Share the error message or code snippet and I\'ll help you fix it.'
  }

  if (msg.includes('optimize') || msg.includes('performance')) {
    return '⚡ Performance optimization! Share your code and I\'ll suggest improvements for better performance.'
  }

  if (msg.includes('best practices')) {
    return '✅ Best practices are important! Tell me what area you want to learn about (React, JavaScript, etc.)'
  }

  if (msg.includes('thanks') || msg.includes('thank you')) {
    return '🙏 You\'re welcome! Feel free to ask more questions anytime!'
  }

  if (msg.includes('bye') || msg.includes('goodbye')) {
    return '👋 Goodbye! Happy coding!'
  }

  // Default response
  return `✨ That\'s interesting! "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}". Tell me more or ask a specific question about code!`
}