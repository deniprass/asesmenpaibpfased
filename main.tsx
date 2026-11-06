import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for full offline execution
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] Versi terbaru aplikasi siap diperbarui.');
  },
  onOfflineReady() {
    console.log('[PWA] Aplikasi PAIBP 2026 siap berjalan dalam mode offline tanpa koneksi internet.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
