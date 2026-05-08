import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];

// Smart URL Switching: Use direct API on localhost, Proxy on Vercel
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export async function fetchNews(category = 'general', query = '') {
  try {
    const params = {
      apiKey: NEWS_API_KEY,
      pageSize: 12,
      language: 'en',
    };

    let url;
    if (isLocal) {
      // Direct access on localhost
      if (query) {
        url = 'https://newsapi.org/v2/everything';
        params.q = query;
        params.sortBy = 'publishedAt';
      } else {
        url = 'https://newsapi.org/v2/top-headlines';
        params.category = category;
        params.country = 'us';
      }
    } else {
      // Use Vercel Serverless Function on production
      url = '/api/news';
      if (query) params.q = query;
      else params.category = category;
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

    return articles;
  } catch (error) {
    console.error('News fetch failed:', error);
    return [];
  }
}

export async function fetchNewsByCategories() {
  const results = {};
  for (const cat of CATEGORIES) {
    results[cat] = await fetchNews(cat);
  }
  return results;
}

export { CATEGORIES };
