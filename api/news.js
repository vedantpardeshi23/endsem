export default async function handler(req, res) {
  const { category = 'general', q = '' } = req.query;
  const apiKey = process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing VITE_NEWS_API_KEY environment variable' });
  }

  try {
    let url = 'https://newsapi.org/v2/top-headlines';
    const params = new URLSearchParams({
      apiKey,
      language: 'en',
      pageSize: '12',
    });

    if (q) {
      url = 'https://newsapi.org/v2/everything';
      params.append('q', q);
      params.append('sortBy', 'publishedAt');
    } else {
      params.append('category', category);
      params.append('country', 'us');
    }

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('News Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
}
