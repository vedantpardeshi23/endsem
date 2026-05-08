import axios from 'axios';

// HTTPS ISS API - Stable for Vercel
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export async function fetchISSPosition() {
  const response = await axios.get(ISS_API);
  return {
    lat: response.data.latitude,
    lng: response.data.longitude,
    timestamp: response.data.timestamp * 1000,
    velocity: response.data.velocity,
    altitude: response.data.altitude
  };
}

export async function fetchAstronauts() {
  try {
    // Stable HTTPS source for astronauts
    const response = await axios.get('https://corquaid.github.io/international-space-station-api/api/v1/astros.json');
    return {
      number: response.data.number,
      people: response.data.people,
    };
  } catch (err) {
    return { number: 7, people: [{ name: 'Sunita Williams', craft: 'ISS' }] };
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: { lat, lon: lng, format: 'json', zoom: 5 },
      headers: { 'User-Agent': 'ISS-Dashboard/1.0' },
    });
    return response.data?.display_name?.split(', ').slice(0, 2).join(', ') || 'Over Ocean';
  } catch {
    return 'Over Ocean';
  }
}
