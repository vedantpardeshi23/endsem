import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { MessageSquare, X, Send, Trash2, Bot, Minus, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

export default function Chatbot() {
  const { messages, isOpen, isTyping, sendMessage, clearChat, toggleChat, setIsOpen } = useChat();
  const { isDark } = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`mb-4 w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl ${
              isDark ? 'bg-dark-900 border border-white/10 shadow-indigo-500/10' : 'bg-white border border-gray-100'
            }`}
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between ${
              isDark ? 'bg-white/[0.03] border-b border-white/5' : 'bg-indigo-50 border-b border-indigo-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Orbital Intelligence</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    Dashboard Specialist
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/5 text-dark-300 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                  }`}
                  title="Clear Chat"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/5 text-dark-300 hover:text-white' : 'hover:bg-indigo-100 text-gray-400 hover:text-indigo-600'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className={`w-16 h-16 rounded-3xl mb-4 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                     <Sparkles size={32} className="text-indigo-400" />
                  </div>
                  <h4 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    How can I help you?
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                    I'm trained specifically on your dashboard data. Ask me about ISS location, speed, astronauts, or latest news!
                  </p>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {['Where is ISS?', 'Latest news?', 'ISS Speed?'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                          isDark ? 'bg-white/5 hover:bg-indigo-500/20 text-dark-200 border border-white/5' : 'bg-gray-100 hover:bg-indigo-100 text-gray-600'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
              )}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className={`flex gap-2.5 items-end`}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-indigo-400" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-none ${isDark ? 'bg-dark-700' : 'bg-gray-100'}`}>
                      <div className="flex gap-1">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-4 ${isDark ? 'bg-white/[0.02] border-t border-white/5' : 'bg-white border-t border-gray-100'}`}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the dashboard..."
                  className={`w-full pl-4 pr-12 py-3 rounded-2xl text-sm transition-all ${
                    isDark 
                      ? 'bg-dark-800 border-white/5 text-white placeholder:text-dark-400 focus:border-indigo-500/50' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500'
                  } border`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    input.trim() && !isTyping
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-400/10 text-gray-400 pointer-events-none'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? isDark ? 'bg-white text-dark-900' : 'bg-dark-900 text-white'
            : 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-indigo-500/40'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <Minus size={28} />
             </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
               <MessageSquare size={28} />
               {!messages.length && (
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
