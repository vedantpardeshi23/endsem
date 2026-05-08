import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const GLOW_COLORS = {
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  purple: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
  cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  green: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  pink: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]',
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
};

const ICON_BG = {
  blue: 'from-blue-500/20 to-blue-600/10',
  purple: 'from-purple-500/20 to-purple-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/10',
  green: 'from-emerald-500/20 to-emerald-600/10',
  pink: 'from-pink-500/20 to-pink-600/10',
  orange: 'from-orange-500/20 to-orange-600/10',
};

const ICON_TEXT = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  cyan: 'text-cyan-400',
  green: 'text-emerald-400',
  pink: 'text-pink-400',
  orange: 'text-orange-400',
};

export default function StatCard({ icon: Icon, label, value, subtitle, color = 'blue', delay = 0 }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl p-5 overflow-hidden ${
        isDark
          ? `bg-dark-800/60 border border-white/[0.06] ${GLOW_COLORS[color]}`
          : 'bg-white border border-gray-200/60 shadow-sm'
      } backdrop-blur-sm`}
    >
      {/* Subtle gradient overlay */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${ICON_BG[color]} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`text-xs font-medium uppercase tracking-wider mb-2 ${
              isDark ? 'text-dark-300' : 'text-gray-500'
            }`}
          >
            {label}
          </p>
          <motion.p
            key={value}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className={`text-xs mt-1.5 ${isDark ? 'text-dark-300' : 'text-gray-400'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ICON_BG[color]} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={18} className={ICON_TEXT[color]} />
        </div>
      </div>
    </motion.div>
  );
}
