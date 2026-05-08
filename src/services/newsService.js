import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];

// Proxy to allow NewsAPI to work on Vercel production
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

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
    localStorage.clear();
  }
}

export async function fetchNews(category = 'general', query = '') {
  const cacheKey = getCacheKey(category, query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      pageSize: 12,
      language: 'en',
    });

    let targetUrl = 'https://newsapi.org/v2/top-headlines';

    if (query) {
      targetUrl = 'https://newsapi.org/v2/everything';
      params.append('q', query);
      params.append('sortBy', 'publishedAt');
    } else {
      params.append('category', category);
      params.append('country', 'us');
    }

    // Use proxy for production/Vercel
    const finalUrl = `${PROXY_URL}${encodeURIComponent(`${targetUrl}?${params.toString()}`)}`;
    
    const response = await axios.get(finalUrl);

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
    console.error('News fetch failed:', error);
    return [];
  }
}

export async function fetchNewsByCategories() {
  const results = {};
  for (const cat of CATEGORIES) {
    try {
      results[cat] = await fetchNews(cat);
    } catch {
      results[cat] = [];
    }
  }
  return results;
}

export function clearNewsCache() {
  CATEGORIES.forEach((cat) => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(`news_cache_${cat}`));
    keys.forEach((k) => localStorage.removeItem(k));
  });
}

export { CATEGORIES };
