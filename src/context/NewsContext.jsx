import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchNews, fetchNewsByCategories, clearNewsCache, CATEGORIES } from '../services/newsService';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState({});
  const [allArticles, setAllArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadAllNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchNewsByCategories();
      setArticles(results);
      const all = Object.values(results).flat();
      setAllArticles(all);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const loadCategory = useCallback(async (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    try {
      const results = await fetchNews(category);
      setArticles((prev) => ({ ...prev, [category]: results }));
    } catch (err) {
      console.error(`Failed to load ${category}:`, err);
    }
  }, []);

  const searchNews = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
      const results = await fetchNews('general', query);
      setSearchResults(results);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const refreshNews = useCallback(() => {
    clearNewsCache();
    toast.promise(loadAllNews(), {
      loading: 'Refreshing news...',
      success: 'News updated!',
      error: 'Failed to refresh news',
    });
  }, [loadAllNews]);

  const sortArticles = useCallback(
    (articleList) => {
      const sorted = [...articleList];
      if (sortBy === 'date') {
        sorted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      } else if (sortBy === 'source') {
        sorted.sort((a, b) => (a.source || '').localeCompare(b.source || ''));
      }
      return sorted;
    },
    [sortBy]
  );

  const getCurrentArticles = useCallback(() => {
    if (isSearching && searchResults.length > 0) {
      return sortArticles(searchResults);
    }
    const categoryArticles = articles[activeCategory] || [];
    return sortArticles(categoryArticles);
  }, [isSearching, searchResults, articles, activeCategory, sortArticles]);

  const getDistribution = useCallback(() => {
    return CATEGORIES.map((cat) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: (articles[cat] || []).length,
      category: cat,
    })).filter((d) => d.value > 0);
  }, [articles]);

  useEffect(() => {
    loadAllNews();
  }, [loadAllNews]);

  const value = {
    articles,
    allArticles,
    activeCategory,
    setActiveCategory: loadCategory,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchNews,
    isSearching,
    sortBy,
    setSortBy,
    loading,
    error,
    refreshNews,
    getCurrentArticles,
    getDistribution,
    categories: CATEGORIES,
    totalArticles: allArticles.length,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within NewsProvider');
  return context;
}
