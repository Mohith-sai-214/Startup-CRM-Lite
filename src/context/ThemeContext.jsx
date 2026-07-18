import React, { createContext, useContext, useEffect } from 'react'; // Import React core hooks
import { useLocalStorage } from '../hooks/useLocalStorage'; // Import custom localStorage hook

// Instantiate global Context object for Theme states
export const ThemeContext = createContext();

/**
 * JSDoc comments explaining ThemeProvider component:
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child elements wrapped inside the provider
 * @returns {React.JSX.Element} Provider component managing dark mode boolean states
 */
export const ThemeProvider = ({ children }) => {
  // Initialize isDarkMode state synchronized via useLocalStorage hook
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false);

  // Apply dark mode styling class configurations to document root dynamically
  useEffect(() => {
    const root = window.document.documentElement; // Fetch document root HTML element reference
    if (isDarkMode) {
      root.classList.add('dark'); // Add .dark class name
      root.style.colorScheme = 'dark'; // Force dark color scheme rendering
    } else {
      root.classList.remove('dark'); // Remove .dark class name
      root.style.colorScheme = 'light'; // Force light color scheme rendering
    }
  }, [isDarkMode]);

  // Handler function to toggle boolean states
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev); // Negate active boolean values
  };

  return (
    // Render provider exposing theme hooks
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom Hook to consume ThemeContext safely
 * @returns {Object} Theme states and toggle actions
 * @throws {Error} Descriptive error if hook is consumed outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext); // Retrieve Context
  if (!context) {
    throw new Error('useTheme must be consumed within a ThemeProvider wrapper'); // Descriptive boundary error
  }
  return context; // Return states
};
