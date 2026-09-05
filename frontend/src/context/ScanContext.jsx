import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { scanAPI } from '../services/api';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentScan, setCurrentScan] = useState(null);
  const [userScans, setUserScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(false);

  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Daily water tracking
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const savedDate = localStorage.getItem('glowaura_water_date');
    const today = new Date().toISOString().split('T')[0];
    if (savedDate === today) {
      const savedCount = localStorage.getItem('glowaura_water_count');
      return savedCount ? parseInt(savedCount, 10) : 4;
    }
    localStorage.setItem('glowaura_water_date', today);
    return 4;
  });

  const waterGoal = 10;

  // Sync scan data whenever user changes (login, logout, switch account)
  useEffect(() => {
    if (user && user.id) {
      setLoadingScans(true);
      // Fetch this specific user's latest scan and history from backend
      scanAPI.getLatestScan()
        .then(res => {
          if (res.data && res.data.scan) {
            setCurrentScan(res.data.scan);
          } else {
            setCurrentScan(null);
          }
        })
        .catch(() => {
          setCurrentScan(null);
        })
        .finally(() => setLoadingScans(false));

      scanAPI.getUserScans()
        .then(res => {
          if (res.data && res.data.scans) {
            setUserScans(res.data.scans);
          } else {
            setUserScans([]);
          }
        })
        .catch(() => {
          setUserScans([]);
        });
    } else {
      // User logged out or guest - completely clean session scan state
      setCurrentScan(null);
      setUserScans([]);
      localStorage.removeItem('glowaura_last_scan');
    }
  }, [user?.id]);

  const hasCompletedScan = Boolean(currentScan || userScans.length > 0);

  const incrementWater = () => {
    setWaterGlasses(prev => {
      const next = Math.min(prev + 1, 16);
      localStorage.setItem('glowaura_water_count', next.toString());
      return next;
    });
  };

  const decrementWater = () => {
    setWaterGlasses(prev => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem('glowaura_water_count', next.toString());
      return next;
    });
  };

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <ScanContext.Provider value={{
      currentScan,
      setCurrentScan,
      userScans,
      hasCompletedScan,
      loadingScans,
      compareList,
      toggleCompare,
      clearCompare,
      isCompareOpen,
      setIsCompareOpen,
      waterGlasses,
      waterGoal,
      incrementWater,
      decrementWater
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
