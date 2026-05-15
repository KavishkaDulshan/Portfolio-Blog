import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import ProjectPost from './pages/ProjectPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectPost />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
