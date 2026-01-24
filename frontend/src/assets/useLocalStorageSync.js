import { useState, useEffect } from "react";

/**
 * Syncs state with localStorage.
 * Listens for the 'storage' event for cross-tab sync.
 * Also syncs within the same window if the storage event is manually dispatched.
 */
function useLocalStorageSync(key, initialValue) {
  // Initialize state function
  const readValue = () => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch a custom event to sync within the same tab/window
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      // If e is a StorageEvent (cross-tab), e.key must match.
      // If e is a generic Event (same-tab custom dispatch), we just reload.
      if (e.type === "storage" && e.key !== key && e.key !== null) return;
      
      setStoredValue(readValue());
    };

    // Listen for native storage events (cross-tab) and custom events (same-tab)
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorageSync;