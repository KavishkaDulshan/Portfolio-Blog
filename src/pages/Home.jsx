import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/getPosts';
import { getAllProjects } from '../utils/getProjects';
import BlogCard from '../components/BlogCard';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);
  const latestProjects = getAllProjects().slice(0, 3);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 font-sans">
          Software Engineering Undergraduate
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-gray-900 leading-tight tracking-tight mb-6">
          Hi, I'm Kavishka<br />Dulshan.
        </h1>
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
          I build software, write about what I learn, and share projects I care about.
          This is my corner of the internet — read the blog, explore the work.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Read the blog
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-5 py-2.5 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            View projects
          </Link>
        </div>
      </section>

      <div className="border-t border-gray-200" />

      {/* ── Latest Posts ── */}
      {latestPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Latest writing</h2>
            <Link to="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              All posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Projects ── */}
      {latestProjects.length > 0 && (
        <>
          <div className="border-t border-gray-200" />
          <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Featured projects</h2>
              <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                All projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
