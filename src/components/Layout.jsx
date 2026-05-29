import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-14 md:pb-0" style={{ fontFamily: 'var(--font-sans)' }}>
      <ScrollToTop />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
