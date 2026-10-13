import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useLang } from './state/lang';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDock } from './components/CartDock';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

// Checkout carries the wilaya/commune dataset, so it loads on demand (the map is lazy on its own).
// Suspense wraps only this route: a boundary around the other pages would make the
// prerendered HTML hide them in a deferred segment.
const Checkout = lazy(() => import('./pages/Checkout'));
const pending = <div className="min-h-[60vh]" />;

export default function App() {
  const { t } = useLang();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // braces matter: newer browsers return a Promise here
  }, [pathname]);
  // The client render has replaced the prerendered HTML (see index.html, scripts/prerender.mjs).
  useEffect(() => {
    document.getElementById('root')!.dataset.ready = '';
  }, []);

  return (
    <>
      <a href="#main" className="sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:start-2 focus:top-2">
        {t.skip}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Suspense fallback={pending}><Checkout /></Suspense>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDock />
    </>
  );
}
