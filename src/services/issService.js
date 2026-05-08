import axios from 'axios';

const PROXY = 'https://api.allorigins.win/raw?url=';
const ISS_BASE = 'http://api.open-notify.org';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

async function fetchFromProxy(baseUrl) {
  const url = `${PROXY}${encodeURIComponent(baseUrl)}`;
  const response = await axios.get(url);
  let data = response.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error('Failed to parse proxy data');
    }
  }
  return data;
}

export async function fetchISSPosition() {
  const data = await fetchFromProxy(`${ISS_BASE}/iss-now.json`);
  const { latitude, longitude } = data.iss_position;
  return {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
    timestamp: data.timestamp * 1000,
  };
}

export async function fetchAstronauts() {
  try {
    const data = await fetchFromProxy(`${ISS_BASE}/astros.json`);
    return {
      number: data.number,
      people: data.people,
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
