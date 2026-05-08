import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../services/issService';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

const ISSContext = createContext();

const MAX_POSITIONS = 15;
const MAX_SPEED_HISTORY = 30;
const FETCH_INTERVAL = 15000;

export function ISSProvider({ children }) {
  const [position, setPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [locationName, setLocationName] = useState('Calculating...');
  const [astronauts, setAstronauts] = useState({ number: 0, people: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const prevPositionRef = useRef(null);
  const intervalRef = useRef(null);

  const updatePosition = useCallback(async () => {
    try {
      const newPos = fetchISSPosition();
      const pos = await newPos;

      setPosition(pos);
      setLastUpdate(Date.now());
      setError(null);

      // Calculate speed
      if (prevPositionRef.current) {
        const timeDiff = (pos.timestamp - prevPositionRef.current.timestamp) / 1000;
        if (timeDiff > 0) {
          const newSpeed = calculateSpeed(prevPositionRef.current, pos, timeDiff);
          const speedNum = parseFloat(newSpeed);
          // Filter out unrealistic speeds (ISS orbits at ~27,600 km/h)
          if (speedNum > 0 && speedNum < 50000) {
            setSpeed(speedNum);
            setSpeedHistory((prev) => {
              const updated = [
                ...prev,
                {
                  time: new Date(pos.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  }),
                  speed: speedNum,
                  timestamp: pos.timestamp,
                },
              ];
              return updated.slice(-MAX_SPEED_HISTORY);
            });
          }
        }
      }

      prevPositionRef.current = pos;

      // Update positions list
      setPositions((prev) => {
        const updated = [...prev, pos];
        return updated.slice(-MAX_POSITIONS);
      });

      // Reverse geocode (throttled)
      try {
        const name = await reverseGeocode(pos.lat, pos.lng);
        setLocationName(name);
      } catch {
        setLocationName('Over Ocean');
      }

      setIsLive(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLive(false);
      setLoading(false);
    }
  }, []);

  const loadAstronauts = useCallback(async () => {
    try {
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (err) {
      console.error('Failed to fetch astronauts:', err);
    }
  }, []);

  const refresh = useCallback(() => {
    toast.promise(updatePosition(), {
      loading: 'Refreshing ISS data...',
      success: 'ISS data updated!',
      error: 'Failed to refresh',
    });
  }, [updatePosition]);

  // Auto-fetch ISS position
  useEffect(() => {
    updatePosition();
    loadAstronauts();

    intervalRef.current = setInterval(updatePosition, FETCH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updatePosition, loadAstronauts]);

  const value = {
    position,
    positions,
    speed,
    speedHistory,
    locationName,
    astronauts,
    loading,
    error,
    isLive,
    lastUpdate,
    refresh,
    positionCount: positions.length,
  };

  return <ISSContext.Provider value={value}>{children}</ISSContext.Provider>;
}

export function useISS() {
  const context = useContext(ISSContext);
  if (!context) throw new Error('useISS must be used within ISSProvider');
  return context;
}
