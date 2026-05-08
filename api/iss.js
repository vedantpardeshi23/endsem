export default async function handler(req, res) {
  const { type = 'now' } = req.query;
  const baseUrl = 'http://api.open-notify.org';

  try {
    const endpoint = type === 'astros' ? 'astros.json' : 'iss-now.json';
    const response = await fetch(`${baseUrl}/${endpoint}`);
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('ISS Proxy Error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
