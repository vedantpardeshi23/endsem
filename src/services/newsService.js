import axios from 'axios';

// Spaceflight News API - Most stable for Vercel (No Proxy/Keys needed)
const SPACE_NEWS_API = 'https://api.spaceflightnewsapi.net/v4/articles';

export async function fetchNews(category = 'all', query = '') {
  try {
    const params = { limit: 12 };
    if (query) params.search = query;
    
    const response = await axios.get(SPACE_NEWS_API, { params });
    return (response.data.results || []).map((article) => ({
      id: article.id.toString(),
      title: article.title,
      description: article.summary,
      url: article.url,
      image: article.image_url,
      author: article.news_site,
      source: article.news_site,
      publishedAt: article.published_at,
      category: 'general',
    }));
  } catch (error) {
    console.error('News API error:', error);
    return [];
  }
}

export async function fetchNewsByCategories() {
  const articles = await fetchNews();
  return { general: articles, technology: articles, science: articles, business: articles, health: articles };
}

export const CATEGORIES = ['general', 'technology', 'science', 'business', 'health'];
