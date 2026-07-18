import { useState, useCallback } from 'react';

/**
 * Custom hook to manage state synchronized with window.localStorage.
 * Identical API to React's useState. Handles private browsing limitations,
 * JSON parsing errors, and functions as initial values.
 *
 * @template T
 * @param {string} key - The localStorage key name.
 * @param {T | (() => T)} initialValue - The fallback initial value or a function that returns it.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A stateful value and a function to update it.
 */
export function useLocalStorage(key, initialValue) {
  // Read value from local storage on initial mount
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      
      // If item does not exist, initialize it
      const valueToStore = typeof initialValue === 'function' ? initialValue() : initialValue;
      
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (writeError) {
        console.warn(`Error setting localStorage key "${key}":`, writeError);
      }
      
      return valueToStore;
    } catch (error) {
      // Handles security errors (private mode) or JSON parsing errors
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback((value) => {
    try {
      // Support functional updates just like useState
      setStoredValue((prevValue) => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (writeError) {
            console.warn(`Error setting localStorage key "${key}":`, writeError);
          }
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error updating state for localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
