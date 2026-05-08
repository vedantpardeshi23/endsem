import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Satellite,
  Newspaper,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  Rocket,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'ISS Tracker', icon: Satellite },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          isDark
            ? 'bg-dark-900/80 border-b border-white/5'
            : 'bg-white/80 border-b border-black/5'
        } backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Rocket size={18} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-dark-900 pulse-dot" />
              </div>
              <div className="hidden sm:block">
                <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Orbital
                </span>
                <span className="text-base font-bold gradient-text">HQ</span>
              </div>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? 'text-white'
                          : 'text-indigo-600'
                        : isDark
                        ? 'text-dark-200 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className={`absolute inset-0 rounded-xl ${
                          isDark
                            ? 'bg-white/[0.06] border border-white/10'
                            : 'bg-indigo-50 border border-indigo-100'
                        }`}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon size={16} className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isDark
                    ? 'hover:bg-white/5 text-dark-200 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2.5 rounded-xl transition-all duration-200 ${
                  isDark
                    ? 'hover:bg-white/5 text-dark-200'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-16 left-0 right-0 z-40 md:hidden ${
              isDark
                ? 'bg-dark-900/95 border-b border-white/5'
                : 'bg-white/95 border-b border-black/5'
            } backdrop-blur-xl`}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-white/[0.06] text-white border border-white/10'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : isDark
                        ? 'text-dark-200 hover:bg-white/[0.03]'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
