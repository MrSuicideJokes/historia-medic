import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import { LangProvider } from './state/lang';
import App from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </StrictMode>
);

// Pages are prerendered in French and unfiltered (scripts/prerender.mjs).
// When the first render will match that, hydrate and keep the already-painted photos;
// otherwise (Arabic, checkout, a filtered URL) render over it.
const matchesPrerender =
  root.hasChildNodes() && document.documentElement.lang === 'fr' && !location.search && !/^\/checkout/.test(location.pathname);
if (matchesPrerender) hydrateRoot(root, app);
else createRoot(root).render(app);
