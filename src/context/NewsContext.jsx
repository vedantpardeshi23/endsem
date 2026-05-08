import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNews, CATEGORIES } from '../services/newsService';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = useCallback(async (cat = 'general', query = '') => {
    setLoading(true);
    try {
      const data = await fetchNews(cat, query);
      setArticles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch latest intelligence');
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews(category, searchQuery);
  }, [category, searchQuery, loadNews]);

  const refresh = () => {
    loadNews(category, searchQuery);
    toast.success('Intelligence feed updated', {
      style: {
        background: '#1a1a24',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
  };

  const getDistribution = () => {
    if (articles.length === 0) return [];
    
    const counts = articles.reduce((acc, art) => {
      acc[art.source] = (acc[art.source] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 6);
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        category,
        setCategory,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        refresh,
        getDistribution,
        categories: CATEGORIES
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export const useNews = () => useContext(NewsContext);
