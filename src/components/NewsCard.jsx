import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Calendar, User, Globe } from 'lucide-react';
import { formatDate, truncateText } from '../utils/helpers';

export default function NewsCard({ article, index }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group rounded-2xl overflow-hidden flex flex-col h-full ${
        isDark
          ? 'bg-dark-800/60 border border-white/[0.06] hover:border-indigo-500/30'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      } transition-all duration-300`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop`}
          alt={article.title}
          className="w-full h-full object-cover news-card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
            isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-500 text-white'
          }`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3 text-[10px] font-medium uppercase tracking-tight">
          <div className="flex items-center gap-1 text-indigo-400">
            <Globe size={12} />
            <span>{article.source}</span>
          </div>
          <div className={`flex items-center gap-1 ${isDark ? 'text-dark-300' : 'text-gray-400'}`}>
            <Calendar size={12} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        <h3 className={`text-lg font-bold leading-tight mb-3 line-clamp-2 ${isDark ? 'text-white group-hover:text-indigo-300' : 'text-gray-900 group-hover:text-indigo-600'} transition-colors`}>
          {article.title}
        </h3>

        <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-dark-200' : 'text-gray-600'}`}>
          {truncateText(article.description, 150)}
        </p>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[60%]">
             <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
               <User size={12} className={isDark ? 'text-dark-300' : 'text-gray-400'} />
             </div>
             <span className={`text-xs font-medium truncate ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
               {article.author || 'Editorial Team'}
             </span>
          </div>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
            } transition-colors`}
          >
            Read More
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
