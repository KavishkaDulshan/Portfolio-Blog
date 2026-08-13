import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// The `.dark` class on <html> is the single source of truth. It is set by the
// pre-paint script in index.html (reading localStorage), so React just has to
// subscribe to changes — no state-syncing effect is required and hydration
// stays consistent (the server snapshot is always 'light').
function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerThemeSnapshot() {
  return 'light';
}

function subscribeTheme(callback) {
  window.addEventListener('theme-change', callback);
  return () => window.removeEventListener('theme-change', callback);
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = useCallback(() => {
    const next = getThemeSnapshot() === 'dark' ? 'light' : 'dark';

    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore storage errors */
    }
    window.dispatchEvent(new Event('theme-change'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
