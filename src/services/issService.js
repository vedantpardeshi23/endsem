import axios from 'axios';

const ISS_API = 'http://api.open-notify.org';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export async function fetchISSPosition() {
  const response = await axios.get(`${ISS_API}/iss-now.json`);
  const { latitude, longitude } = response.data.iss_position;
  return {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
    timestamp: response.data.timestamp * 1000,
  };
}

export async function fetchAstronauts() {
  const response = await axios.get(`${ISS_API}/astros.json`);
  return {
    number: response.data.number,
    people: response.data.people,
  };
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
