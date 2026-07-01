import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Route based on URL path
const path = window.location.pathname;

if (path.startsWith('/admin')) {
  // Lazy load admin app
  import('./admin/AdminApp').then((mod) => {
    const AdminApp = mod.default;
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <AdminApp />
      </StrictMode>
    );
  });
} else {
  // Main public app
  import('./App').then((mod) => {
    const App = mod.default;
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}
