import axios from 'axios';

// Spaceflight News API (v4) - Free, No Key Required, Works on Production
const SPACE_NEWS_API = 'https://api.spaceflightnewsapi.net/v4/articles';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CATEGORIES = ['all', 'news', 'blogs', 'reports'];

function getCacheKey(category, query) {
  return `space_news_cache_${category}_${query || 'default'}`;
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
    localStorage.clear(); // Clear all if full
  }
}

export async function fetchNews(category = 'all', query = '') {
  const cacheKey = getCacheKey(category, query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      limit: 12,
    };

    if (query) {
      params.search = query;
    }

    let url = SPACE_NEWS_API;
    // Note: The API uses different endpoints or params for types, 
    // for simplicity we'll use the main articles endpoint with search if needed
    
    const response = await axios.get(url, { params });

    const articles = (response.data.results || [])
      .map((article) => ({
        id: article.id.toString(),
        title: article.title,
        description: article.summary,
        url: article.url,
        image: article.image_url,
        author: article.news_site,
        source: article.news_site,
        publishedAt: article.published_at,
        category: category,
      }));

    setCache(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error('Space News API error:', error);
    return [];
  }
}

export async function fetchNewsByCategories() {
  const articles = await fetchNews('all');
  return {
    all: articles,
    news: articles.slice(0, 4),
    blogs: articles.slice(4, 8),
    reports: articles.slice(8, 12)
  };
}

export function clearNewsCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('space_news_cache_'))
    .forEach((k) => localStorage.removeItem(k));
}

export { CATEGORIES };
