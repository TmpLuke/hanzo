import { useState, useEffect } from 'react';

export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = () => {
      try {
        const settings = localStorage.getItem('maintenanceMode');
        if (settings) {
          const parsed = JSON.parse(settings);
          setIsMaintenanceMode(parsed.enabled ?? false);
        }
      } catch (e) {
        console.error('Failed to parse maintenance mode', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();

    // Listen for changes from admin panel
    const handleStorageChange = () => {
      checkMaintenanceMode();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isMaintenanceMode, isLoading };
}
