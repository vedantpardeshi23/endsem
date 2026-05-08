import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import { useTheme } from '../context/ThemeContext';
import NewsCard from '../components/NewsCard';
import ErrorState from '../components/ErrorState';
import { SkeletonNewsCard } from '../components/Skeleton';
import { 
  Search, 
  RefreshCw, 
  Filter, 
  Newspaper, 
  Calendar, 
  LayoutGrid, 
  ArrowUpDown,
  XCircle,
  Hash
} from 'lucide-react';

export default function NewsDashboard() {
  const { 
    getCurrentArticles, 
    loading, 
    error, 
    refreshNews, 
    categories, 
    activeCategory, 
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    searchNews,
    isSearching,
    sortBy,
    setSortBy,
    totalArticles
  } = useNews();
  const { isDark } = useTheme();
  const [searchInput, setSearchInput] = useState('');

  const articles = useMemo(() => getCurrentArticles(), [getCurrentArticles]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    searchNews(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    searchNews('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Hash size={14} />
            <span>Intelligence Feed</span>
          </div>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Global <span className="gradient-text">News Brief</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
            Aggregated intelligence from across the globe. Analyzing trends in technology, science, and space exploration.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={refreshNews}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10' 
                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm'
            }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Data</span>
          </button>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : isDark
                    ? 'bg-white/[0.03] text-dark-300 border-white/5 hover:border-white/10'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              isDark ? 'text-dark-400 group-focus-within:text-indigo-400' : 'text-gray-400 group-focus-within:text-indigo-500'
            }`} size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search intelligence..."
              className={`pl-11 pr-10 py-2.5 w-full sm:w-64 rounded-xl text-xs font-medium transition-all ${
                isDark 
                  ? 'bg-dark-800 border-white/5 text-white placeholder:text-dark-400 focus:border-indigo-500/50' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500'
              } border`}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
              >
                <XCircle size={16} />
              </button>
            )}
          </form>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                isDark 
                  ? 'bg-dark-800 border-white/5 text-dark-200 focus:border-indigo-500/50' 
                  : 'bg-white border-gray-200 text-gray-600 focus:border-indigo-500'
              }`}
            >
              <option value="date">Latest First</option>
              <option value="source">By Source</option>
            </select>
            <div className={`pointer-events-none -ml-9 flex items-center ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
              <ArrowUpDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {error ? (
        <ErrorState message={error} onRetry={refreshNews} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkeletonNewsCard />
                </motion.div>
              ))
            ) : articles.length > 0 ? (
              articles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                 <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                   <Newspaper size={40} className="text-dark-400" />
                 </div>
                 <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                   No articles found
                 </h3>
                 <p className={`text-sm ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
                   Try adjusting your search query or switching categories.
                 </p>
                 <button 
                  onClick={clearSearch}
                  className="mt-6 text-sm font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-widest underline decoration-2 underline-offset-4"
                 >
                   Clear filters
                 </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
