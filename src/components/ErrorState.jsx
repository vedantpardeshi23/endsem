import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-8 text-center ${
        isDark
          ? 'bg-red-500/5 border border-red-500/20'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3
        className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        Something went wrong
      </h3>
      <p className={`text-sm mb-5 ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
