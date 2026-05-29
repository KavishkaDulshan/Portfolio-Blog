import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiFolder, FiGrid, FiUser, FiMail } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Blog', to: '/blog', icon: FiBookOpen },
  { label: 'Projects', to: '/projects', icon: FiFolder },
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
  { label: 'About', to: '/about', icon: FiUser },
  { label: 'Contact', to: '/contact', icon: FiMail },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-150 ${
      isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 md:sticky md:top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-12 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center" aria-label="Kavishka Dulshan – Go to home">
              <img
                src="/favicon.svg"
                alt="Kavishka Dulshan"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(({ label, to }) => (
                <NavLink key={to} to={to} className={linkClass} end={to === '/'}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] print:hidden">
        <div className="flex justify-around items-center h-14">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
