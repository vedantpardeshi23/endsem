import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertCircle } from 'lucide-react';
import { formatTimestamp } from '../../utils/helpers';

export default function ChatMessage({ message }) {
  const { isDark } = useTheme();
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] gap-2.5 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
          isBot 
            ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-md shadow-indigo-500/20' 
            : isDark ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          {isBot ? <Bot size={16} className="text-white" /> : <User size={16} className={isDark ? 'text-white' : 'text-gray-700'} />}
        </div>

        <div className="flex flex-col gap-1">
          <div className={`px-4 py-2.5 rounded-2xl text-sm ${
            isBot
              ? isDark 
                ? 'bg-dark-700 border border-white/5 text-dark-100 rounded-tl-none' 
                : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none'
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}>
            {message.isError && (
              <div className="flex items-center gap-1.5 text-red-400 mb-1 font-bold uppercase text-[10px] tracking-widest">
                <AlertCircle size={12} />
                <span>Error</span>
              </div>
            )}
            
            <div className={`chat-markdown ${isBot ? '' : 'text-white'}`}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
          
          <span className={`text-[10px] ${isBot ? 'text-left' : 'text-right'} ${isDark ? 'text-dark-400' : 'text-gray-400'} font-medium px-1`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
