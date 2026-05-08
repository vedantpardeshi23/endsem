import axios from 'axios';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export async function fetchISSPosition() {
  const url = isLocal ? 'http://api.open-notify.org/iss-now.json' : '/api/iss';
  const response = await axios.get(url);
  const data = response.data;
  
  // Handle different response formats (Direct vs Proxy)
  const position = data.iss_position || data; 
  return {
    lat: parseFloat(position.latitude),
    lng: parseFloat(position.longitude),
    timestamp: (data.timestamp || Date.now() / 1000) * 1000,
  };
}

export async function fetchAstronauts() {
  try {
    const url = isLocal ? 'http://api.open-notify.org/astros.json' : '/api/iss?type=astros';
    const response = await axios.get(url);
    return {
      number: response.data.number,
      people: response.data.people,
    };
  } catch (err) {
    console.error('Astros API failed', err);
    return { number: 0, people: [] };
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        zoom: 5,
        'accept-language': 'en',
      },
      headers: {
        'User-Agent': 'ISS-Dashboard/1.0',
      },
    });

    if (response.data && response.data.display_name) {
      const parts = response.data.display_name.split(', ');
      return parts.slice(0, 2).join(', ');
    }
    return getOceanName(lat, lng);
  } catch {
    return getOceanName(lat, lng);
  }
}

function getOceanName(lat, lng) {
  if (lat > 60) return 'Arctic Ocean';
  if (lat < -60) return 'Southern Ocean';
  
  if (lng > -20 && lng < 100) {
    if (lat > 30) return 'Mediterranean / Europe';
    if (lat > -35) return 'Indian Ocean';
    return 'Southern Indian Ocean';
  }
  
  if (lng >= 100 || lng < -100) {
    if (lat > 0) return 'North Pacific Ocean';
    return 'South Pacific Ocean';
  }
  
  if (lat > 0) return 'North Atlantic Ocean';
  return 'South Atlantic Ocean';
}
