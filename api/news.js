const axios = require('axios');

export default async function handler(req, res) {
  const { category = 'general', q = '' } = req.query;
  const apiKey = process.env.VITE_NEWS_API_KEY;

  try {
    let url = 'https://newsapi.org/v2/top-headlines';
    const params = {
      apiKey,
      language: 'en',
      pageSize: 12,
    };

    if (q) {
      url = 'https://newsapi.org/v2/everything';
      params.q = q;
      params.sortBy = 'publishedAt';
    } else {
      params.category = category;
      params.country = 'us';
    }

    const response = await axios.get(url, { params });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
