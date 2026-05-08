import axios from 'axios';

// Call internal Vercel API proxy
const API_BASE = '/api';
const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];

export async function fetchNews(category = 'general', query = '') {
  try {
    const params = {};
    if (query) {
      params.q = query;
    } else {
      params.category = category;
    }

    const response = await axios.get(`${API_BASE}/news`, { params });

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
