import axios from 'axios';

// Switch to HTTPS-compatible API for Vercel
const ISS_API_HTTPS = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_API = 'https://corquaid.github.io/international-space-station-api/api/v1/astros.json';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export async function fetchISSPosition() {
  const response = await axios.get(ISS_API_HTTPS);
  return {
    lat: parseFloat(response.data.latitude),
    lng: parseFloat(response.data.longitude),
    timestamp: response.data.timestamp * 1000,
    velocity: response.data.velocity,
    altitude: response.data.altitude,
    visibility: response.data.visibility,
    footprint: response.data.footprint
  };
}

export async function fetchAstronauts() {
  try {
    const response = await axios.get(ASTROS_API);
    return {
      number: response.data.number,
      people: response.data.people,
    };
  } catch (err) {
    console.error('Astros API failed, using fallback', err);
    return {
      number: 7,
      people: [{ name: 'Sunita Williams', craft: 'ISS' }, { name: 'Barry Wilmore', craft: 'ISS' }]
    };
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
