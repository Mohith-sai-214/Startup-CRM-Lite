import { StrictMode } from 'react'; // Import React StrictMode container
import { createRoot } from 'react-dom/client'; // Import DOM renderer mounting trigger
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider wrapper
import { LeadProvider } from './context/LeadContext'; // Import LeadProvider wrapper
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider wrapper
import './index.css'; // Import global Tailwind imports
import App from './App.jsx'; // Import core App container

// Initialize React DOM root mounting context
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider acts as the outermost context wrapper */}
    <AuthProvider>
      {/* LeadProvider acts as outer global state provider */}
      <LeadProvider>
        {/* ThemeProvider acts as inner global styling theme provider */}
        <ThemeProvider>
          {/* Mount core App shell layouts */}
          <App />
        </ThemeProvider>
      </LeadProvider>
    </AuthProvider>
  </StrictMode>
);
