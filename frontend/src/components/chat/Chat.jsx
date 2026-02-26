/* eslint-disable react-hooks/purity */
import React, { useState, useRef, useEffect } from 'react'
import { Send, Menu, Plus, MessageCircle, Loader, Copy, Settings, Code, Zap, Terminal, ArrowRight } from 'lucide-react'

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messageJustCopied, setMessageJustCopied] = useState(null)
  const [showEmptyState, setShowEmptyState] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQueries = [
    {
      icon: <Code size={18} />,
      title: 'Explain Code',
      description: 'Help me understand this code snippet'
    },
    {
      icon: <Terminal size={18} />,
      title: 'Debug Issue',
      description: 'Debug this error in my application'
    },
    {
      icon: <Zap size={18} />,
      title: 'Optimize Code',
      description: 'How can I optimize this function?'
    },
    {
      icon: <ArrowRight size={18} />,
      title: 'Best Practices',
      description: 'Show me best practices for React'
    }
  ]

  const handleSuggestedQuery = (query) => {
    setInput(query.description)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setShowEmptyState(false)

    const userMessage = {
      id: messages.length + 1,
      author: 'You',
      content: input,
      timestamp: new Date(),
      type: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        author: 'AI Assistant',
        content: '> Connected to AI service. Your response will appear here when API is integrated. 💚',
        timestamp: new Date(),
        type: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
      setLoading(false)
    }, 1500)
  }

  const clearChat = () => {
    setMessages([])
    setShowEmptyState(true)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setMessageJustCopied(id)
    setTimeout(() => setMessageJustCopied(null), 2000)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black overflow-hidden">
      {/* ============= SIDEBAR ============= */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 text-emerald-50 transition-all duration-300 ease-in-out border-r border-emerald-900/30 flex flex-col shadow-2xl relative overflow-hidden`}>
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Logo */}
        <div className="p-4 border-b border-emerald-900/30 flex items-center justify-between relative z-10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70 transition-all">
                &lt;/&gt;
              </div>
              <div>
                <span className="font-mono font-bold text-base tracking-wider block text-emerald-400">Dev AI</span>
                <span className="text-xs text-emerald-600">v1.0.0</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-900/30 rounded-lg transition-all hover:scale-110 hover:rotate-90 text-emerald-400"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        {sidebarOpen && (
          <button
            onClick={clearChat}
            className="m-4 flex items-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-mono font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95 group overflow-hidden relative text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer"></div>
            <Plus size={18} />
            <span className="relative">$ new_chat</span>
          </button>
        )}

        {/* Chat History */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 relative z-10">
            <p className="text-xs text-emerald-600 uppercase tracking-widest font-mono px-2 mb-3">// Recent Chats</p>
            
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-100 transition-all truncate group font-mono"
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="flex-shrink-0 text-emerald-500 group-hover:animate-pulse" />
                  <span className="truncate text-xs">$ chat_{i}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Settings */}
        {sidebarOpen && (
          <div className="border-t border-emerald-900/30 p-4 relative z-10">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-100 transition-all font-mono">
              <Settings size={16} />
              settings
            </button>
          </div>
        )}
      </div>

      {/* ============= MAIN AREA ============= */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 to-slate-950 relative overflow-hidden">
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, 0.05) 25%, rgba(34, 197, 94, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.05) 75%, rgba(34, 197, 94, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, 0.05) 25%, rgba(34, 197, 94, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.05) 75%, rgba(34, 197, 94, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* TOP BAR */}
        <div className="border-b border-emerald-900/20 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-20">
          <div>
            <h1 className="text-2xl font-mono font-bold text-emerald-400">
              $ Dev AI --help
            </h1>
            <p className="text-sm text-emerald-600 mt-1 font-mono">
              {'>'} AI-powered coding assistant
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
            <span className="text-sm font-mono text-emerald-400">status: online</span>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth relative z-10">
          
          {/* Empty State with Query Suggestions */}
          {showEmptyState && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {/* Welcome Message */}
              <div className="max-w-2xl w-full animate-fadeIn">
                <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-950 border border-emerald-900/50 rounded-lg p-8 backdrop-blur-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/50">
                      <Terminal className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-mono font-bold text-emerald-400 mb-2">
                        Hello, Developer! 👋
                      </h2>
                      <p className="text-emerald-300 font-mono text-sm leading-relaxed">
                        {">"} I'm your AI coding assistant. Ask me anything about code, debugging, best practices, or optimization. Let's code together! 💚
                      </p>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="space-y-2 text-xs font-mono text-emerald-500 mb-6 border-l-2 border-emerald-600 pl-4">
                    <div>$ system status: ready</div>
                    <div>$ connection: established</div>
                    <div>$ api: awaiting integration</div>
                  </div>
                </div>
              </div>

              {/* Query Suggestion Boxes */}
              <div className="max-w-2xl w-full">
                <p className="text-emerald-600 font-mono text-xs mb-4 ml-2">// Suggested Queries</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedQueries.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuery(query)}
                      className="group bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 border border-emerald-900/50 hover:border-emerald-700/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-900/40 text-left relative overflow-hidden"
                      style={{
                        animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-900/50 border border-emerald-700 flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                          {query.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-emerald-300 font-mono font-semibold text-sm mb-1">
                            {query.title}
                          </h3>
                          <p className="text-emerald-600 font-mono text-xs leading-relaxed">
                            {query.description}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-emerald-600 group-hover:translate-x-1 transition-transform mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} group`}
              style={{
                animation: `slideInMessage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s both`
              }}
            >
              {msg.type === 'bot' && (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70 transition-all group-hover:scale-110">
                  <Terminal className="text-white" size={18} />
                </div>
              )}
              
              <div className="max-w-xs lg:max-w-2xl group/msg">
                <div className={`${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg rounded-tr-sm shadow-lg shadow-emerald-500/30'
                    : 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-100 rounded-lg rounded-tl-sm'
                } px-5 py-3 transition-all group-hover/msg:shadow-xl relative overflow-hidden font-mono text-sm`}>
                  
                  <p className="leading-relaxed">
                    {msg.type === 'bot' && '> '}
                    {msg.content}
                  </p>
                  
                  {msg.type === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="absolute top-2 right-2 p-1.5 opacity-0 group-hover/msg:opacity-100 bg-emerald-900/50 hover:bg-emerald-800 rounded-lg transition-all"
                      title="Copy message"
                    >
                      {messageJustCopied === msg.id ? (
                        <span className="text-xs text-emerald-400">✓</span>
                      ) : (
                        <Copy size={14} className="text-emerald-400" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className={`text-xs mt-2 font-mono ${
                  msg.type === 'user' ? 'text-right' : 'text-left'
                } text-emerald-700`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>

              {msg.type === 'user' && (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-400/70 transition-all group-hover:scale-110 font-mono">
                  $
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start" style={{ animation: 'slideInMessage 0.4s ease-out' }}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/50 animate-pulse">
                <Terminal className="text-white" size={18} />
              </div>
              <div className="bg-emerald-950/50 border border-emerald-900/50 rounded-lg rounded-tl-sm px-5 py-3 shadow-md font-mono text-sm text-emerald-300">
                <div className="flex gap-2 items-center">
                  <Loader size={14} className="animate-spin text-emerald-400" />
                  <span>$ processing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="border-t border-emerald-900/20 bg-slate-950/80 backdrop-blur-md px-6 py-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3 group">
              <div className="flex-1 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-sm px-4 pointer-events-none">
                  $
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your query here..."
                  className="w-full pl-8 pr-5 py-3 bg-emerald-950/50 border border-emerald-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-emerald-700 text-emerald-100 font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-mono font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 group-hover/btn:animate-shimmer"></div>
                {loading ? (
                  <Loader size={18} className="animate-spin relative z-10" />
                ) : (
                  <Send size={18} className="relative z-10" />
                )}
              </button>
            </form>
            <p className="text-xs text-emerald-700 text-center mt-3 font-mono">
              $ Connected to Dev AI | Type /help for commands
            </p>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(52, 211, 153, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 211, 153, 0.5);
        }
      `}</style>
    </div>
  )
}

export default Chat