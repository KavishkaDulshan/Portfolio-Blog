// Giscus configuration values (sourced from Vite env variables at build time)
export const GISCUS = {
  repo: import.meta.env.VITE_GISCUS_REPO || 'KavishkaDulshan/Portfolio-Blog',
  repoId: import.meta.env.VITE_GISCUS_REPO_ID || 'R_kgDORnBi0g',
  category: import.meta.env.VITE_GISCUS_CATEGORY || 'General',
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID || 'DIC_kwDORnBi0s4C-lRX',
  mapping: import.meta.env.VITE_GISCUS_MAPPING || 'pathname',
  reactionsEnabled: import.meta.env.VITE_GISCUS_REACTIONS_ENABLED || '1',
  emitMetadata: import.meta.env.VITE_GISCUS_EMIT_METADATA || '0',
  theme: import.meta.env.VITE_GISCUS_THEME || 'light',
  lang: import.meta.env.VITE_GISCUS_LANG || 'en',
};

export default GISCUS;
