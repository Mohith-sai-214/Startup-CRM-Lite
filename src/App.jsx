import React from 'react'; // Import React module
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter history context
import AppRoutes from './routes'; // Import route paths mapping declarations

function App() {
  return (
    // Render BrowserRouter wrapping all routes config
    <BrowserRouter>
      {/* Mount application route boundaries */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App; // Default export App container
