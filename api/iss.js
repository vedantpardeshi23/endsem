const axios = require('axios');

export default async function handler(req, res) {
  const { type = 'now' } = req.query;
  const baseUrl = 'http://api.open-notify.org';

  try {
    const endpoint = type === 'astros' ? 'astros.json' : 'iss-now.json';
    const response = await axios.get(`${baseUrl}/${endpoint}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
