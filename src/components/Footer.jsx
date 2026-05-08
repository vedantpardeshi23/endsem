import { useTheme } from '../context/ThemeContext';
import { Rocket, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`mt-auto border-t ${
        isDark ? 'bg-dark-900/50 border-white/5' : 'bg-white/50 border-black/5'
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Rocket size={14} className="text-white" />
            </div>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              OrbitalHQ
            </span>
            <span className={`text-xs ${isDark ? 'text-dark-300' : 'text-gray-400'}`}>
              — ISS & News Intelligence
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://api.open-notify.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs ${
                isDark
                  ? 'text-dark-300 hover:text-white'
                  : 'text-gray-400 hover:text-gray-700'
              } transition-colors`}
            >
              <ExternalLink size={12} />
              Open Notify API
            </a>
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs ${
                isDark
                  ? 'text-dark-300 hover:text-white'
                  : 'text-gray-400 hover:text-gray-700'
              } transition-colors`}
            >
              <ExternalLink size={12} />
              NewsAPI
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs ${
                isDark
                  ? 'text-dark-300 hover:text-white'
                  : 'text-gray-400 hover:text-gray-700'
              } transition-colors`}
            >
              <Github size={12} />
              GitHub
            </a>
          </div>

          <p className={`text-xs ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} OrbitalHQ. Built for Engineering Endsem.
          </p>
        </div>
      </div>
    </footer>
  );
}
