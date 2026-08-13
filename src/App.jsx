import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog, { EnBlog, SiBlog } from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import ProjectPost from './pages/ProjectPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AcademicRecord from './pages/AcademicRecord';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* ── i18n Blog Routes ─────────────────────────────────────── */}
          {/* Strict locale paths */}
          <Route path="en/blog" element={<EnBlog />} />
          <Route path="en/blog/:slug" element={<BlogPost />} />
          <Route path="si/blog" element={<SiBlog />} />
          <Route path="si/blog/:slug" element={<BlogPost />} />

          {/* Legacy /blog — kept for backward compatibility, shows all posts */}
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />

          {/* ── Other pages ──────────────────────────────────────────── */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectPost />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="academic-record" element={<AcademicRecord />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
