import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { sendChatMessage } from '../services/aiService';
import { useISS } from './ISSContext';
import { useNews } from './NewsContext';

const ChatContext = createContext();

const MAX_MESSAGES = 30;
const STORAGE_KEY = 'chat_messages';

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { position, speed, locationName, astronauts, positionCount } = useISS();
  const { allArticles, totalArticles } = useNews();

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // Storage full
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text) => {
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setIsTyping(true);

      const issData = {
        position,
        speed,
        locationName,
        astronautCount: astronauts.number,
        astronauts: astronauts.people,
        positionCount,
      };

      try {
        const response = await sendChatMessage(text, issData, allArticles);

        const botMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg].slice(-MAX_MESSAGES));
      } catch (error) {
        const errorMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ ${error.message || 'Failed to get response. Please try again.'}`,
          timestamp: new Date().toISOString(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMsg].slice(-MAX_MESSAGES));
      } finally {
        setIsTyping(false);
      }
    },
    [position, speed, locationName, astronauts, positionCount, allArticles]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    messages,
    isOpen,
    isTyping,
    sendMessage,
    clearChat,
    toggleChat,
    setIsOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
