import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initCloud } from './core/cloud';
import { initEggs } from './core/eggs';
import { initStore } from './core/store';
import './styles.css';
import './fx.css';

initStore();
initCloud();
initEggs();
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
