// Build-time only (see scripts/prerender.mjs): renders a route to static HTML so the first paint
// and the product photos don't wait for JavaScript. The client then renders over it.
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { LangProvider } from './state/lang';
import { CartProvider } from './state/cart';
import App from './App';

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <LangProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LangProvider>
      </StaticRouter>
    </StrictMode>,
  );
  return new Response(prelude).text();
}
