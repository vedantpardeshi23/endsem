import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];

function getCacheKey(category, query) {
  return `news_cache_${category}_${query || 'default'}`;
}

function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage full, clear old caches
    CATEGORIES.forEach((cat) => {
      localStorage.removeItem(getCacheKey(cat, ''));
    });
  }
}

export async function fetchNews(category = 'general', query = '') {
  const cacheKey = getCacheKey(category, query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      apiKey: NEWS_API_KEY,
      pageSize: 12,
      language: 'en',
    };

    let url = 'https://newsapi.org/v2/top-headlines';

    if (query) {
      url = 'https://newsapi.org/v2/everything';
      params.q = query;
      params.sortBy = 'publishedAt';
    } else {
      params.category = category;
      params.country = 'us';
    }

    const response = await axios.get(url, { params });

    const articles = (response.data.articles || [])
      .filter((a) => a.title && a.title !== '[Removed]')
      .map((article, index) => ({
        id: `${category}-${index}-${Date.now()}`,
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        author: article.author,
        source: article.source?.name || 'Unknown',
        publishedAt: article.publishedAt,
        category,
      }));

    setCache(cacheKey, articles);
    return articles;
  } catch (error) {
    // If API fails (e.g., CORS on production), try proxy
    if (error.response?.status === 426 || error.message?.includes('CORS')) {
      throw new Error('NewsAPI requires a paid plan for production. Using cached data if available.');
    }
    throw error;
  }
}

export async function fetchNewsByCategories() {
  const results = {};
  const promises = CATEGORIES.map(async (category) => {
    try {
      const articles = await fetchNews(category);
      results[category] = articles;
    } catch {
      results[category] = [];
    }
  });

  await Promise.allSettled(promises);
  return results;
}

export function clearNewsCache() {
  CATEGORIES.forEach((cat) => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(`news_cache_${cat}`));
    keys.forEach((k) => localStorage.removeItem(k));
  });
  // Also clear any query caches
  Object.keys(localStorage)
    .filter((k) => k.startsWith('news_cache_'))
    .forEach((k) => localStorage.removeItem(k));
}

export { CATEGORIES };
