import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../services/issService';
import { calculateSpeed, calculateDistance } from '../utils/haversine';
import toast from 'react-hot-toast';

const ISSContext = createContext();

const MAX_POSITIONS = 15;
const MAX_SPEED_HISTORY = 30;
const POLLING_INTERVAL = 30000; // 30s to stay well within rate limits
const MIN_DISTANCE_FOR_GEOCODE = 50; // Only geocode if ISS has moved > 50km

export function ISSProvider({ children }) {
  const [position, setPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Tracking...');
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [astronauts, setAstronauts] = useState({ number: 0, people: [] });
  const [isLive, setIsLive] = useState(true);

  const prevPositionRef = useRef(null);

  const updatePosition = useCallback(async () => {
    try {
      const pos = await fetchISSPosition();

      setPosition(pos);
      setLastUpdate(Date.now());

      // Calculate Speed
      if (prevPositionRef.current) {
        const timeDiff = (pos.timestamp - prevPositionRef.current.timestamp) / 1000;
        if (timeDiff > 0) {
          const newSpeed = calculateSpeed(prevPositionRef.current, pos, timeDiff);
          setSpeed(newSpeed);
          
          setSpeedHistory((prev) => {
            const newHistory = [...prev, { 
              time: new Date(pos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
              speed: parseFloat(newSpeed) 
            }];
            return newHistory.slice(-MAX_SPEED_HISTORY);
          });
        }
      }

      // Update positions list
      setPositions((prev) => {
        const updated = [...prev, pos];
        return updated.slice(-MAX_POSITIONS);
      });

      // Reverse geocode (Optimized)
      try {
        // Only geocode if we haven't yet, or if we've moved significantly
        if (!prevPositionRef.current || calculateDistance(prevPositionRef.current.lat, prevPositionRef.current.lng, pos.lat, pos.lng) > MIN_DISTANCE_FOR_GEOCODE) {
          const name = await reverseGeocode(pos.lat, pos.lng);
          setLocationName(name);
        }
      } catch {
        // Fallback already handled in service
      }

      prevPositionRef.current = pos;
      setIsLive(true);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to sync with ISS telemetry');
      setIsLive(false);
      setLoading(false);
    }
  }, []);

  const fetchAstros = useCallback(async () => {
    try {
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (err) {
      console.error('Failed to fetch astronauts', err);
    }
  }, []);

  useEffect(() => {
    updatePosition();
    fetchAstros();

    const interval = setInterval(() => {
      if (isLive) {
        updatePosition();
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [updatePosition, fetchAstros, isLive]);

  const refresh = () => {
    setLoading(true);
    updatePosition();
    fetchAstros();
    toast.success('ISS data updated!', {
      style: {
        background: '#1a1a24',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
  };

  return (
    <ISSContext.Provider
      value={{
        position,
        positions,
        lastUpdate,
        loading,
        error,
        locationName,
        speed,
        speedHistory,
        astronauts,
        isLive,
        setIsLive,
        refresh,
      }}
    >
      {children}
    </ISSContext.Provider>
  );
}

export const useISS = () => useContext(ISSContext);
