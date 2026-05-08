import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const CACHE_DURATION = 15 * 60 * 1000;

const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];

// More reliable proxy for production
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function fetchNews(category = 'general', query = '') {
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

    const finalUrl = `${PROXY_URL}${encodeURIComponent(`${targetUrl}?${params.toString()}`)}`;
    const response = await axios.get(finalUrl);
    
    // Robust parsing: Proxy might return a string or an object
    let data = response.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse proxy response', e);
        return [];
      }
    }

    if (!data || !data.articles) return [];

    return data.articles
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
