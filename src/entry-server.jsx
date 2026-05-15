import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';

/**
 * Server-side render function used by the SSG prerender script.
 * Returns the HTML string and collected Helmet metadata for a given URL path.
 */
export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return { html, helmet };
}
