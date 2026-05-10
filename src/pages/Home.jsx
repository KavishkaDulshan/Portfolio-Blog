import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { getAllPosts } from '../utils/getPosts';
import { getAllProjects } from '../utils/getProjects';
import BlogCard from '../components/BlogCard';
import ProjectCard from '../components/ProjectCard';
import TechStack from '../components/TechStack';
import FadeIn from '../components/FadeIn';
import ParticleCanvas from '../components/ParticleCanvas';
import { GitHubCalendar } from 'react-github-calendar';

// Stagger variants for hero text lines
const heroVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const MotionLink = motion(Link);

export default function Home() {
  const latestPosts    = getAllPosts().slice(0, 3);
  const latestProjects = getAllProjects().slice(0, 3);
  const [liveRepos, setLiveRepos] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/kavishkadulshan/repos?sort=updated&per_page=3')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setLiveRepos(data);
        }
      })
      .catch(err => console.error("Failed to fetch live repos", err));
  }, []);

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — text content */}
          <motion.div variants={heroVariants} initial="hidden" animate="show">
            <motion.p variants={heroItem}
              className="text-xs uppercase tracking-widest text-gray-600 mb-4 font-sans"
            >
              Software Engineering Undergraduate
            </motion.p>

            <motion.h1 variants={heroItem}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-gray-900 leading-tight tracking-tight mb-6"
            >
              Hi, I'm Kavishka<br />Dulshan.
            </motion.h1>

            <motion.p variants={heroItem}
              className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-10"
            >
              I build software, tinker with IoT, write about what I learn, and share projects I care about. This is my corner of the internet. Read the blog, explore the work.
            </motion.p>

            <motion.div variants={heroItem} className="flex flex-wrap gap-3">
              <MotionLink
                to="/blog"
                whileHover="hover"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Read the blog
                <motion.span variants={{ hover: { y: -2 } }}>
                  <FiBookOpen />
                </motion.span>
              </MotionLink>
              <MotionLink
                to="/projects"
                whileHover="hover"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-5 py-2.5 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors group"
              >
                View projects
                <motion.span variants={{ hover: { x: 3 } }}>
                  <FiArrowRight />
                </motion.span>
              </MotionLink>
            </motion.div>

            {/* Tech stack icon row */}
            <motion.div variants={heroItem}>
              <TechStack />
            </motion.div>
          </motion.div>

          {/* Right — interactive particle animation (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="hidden lg:block h-[480px] overflow-hidden bg-white"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)',
            }}
          >
            <ParticleCanvas />
          </motion.div>
        </div>
      </section>

      <div className="border-t border-gray-200" />

      {/* ── GitHub Contributions ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 overflow-hidden">
        <FadeIn>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">GitHub contributions</h2>
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[800px]">
                <GitHubCalendar 
                  username="kavishkadulshan"
                  colorScheme="light"
                  theme={{
                    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
                  }}
                  hideColorLegend={false}
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Live Repositories ── */}
      {liveRepos.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <FadeIn>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Live Repositories</h2>
              <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                View all in Dashboard
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {liveRepos.map((repo, i) => (
              <FadeIn key={repo.id} delay={i * 0.08}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block group h-full">
                  <div className="h-full border border-gray-200 rounded-2xl p-5 hover:border-gray-900 transition-colors flex flex-col">
                    <h3 className="font-medium text-gray-900 mb-2 truncate group-hover:underline">{repo.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{repo.description || "No description provided."}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <span className="font-medium">{repo.language || 'Multiple'}</span>
                      <span>⭐ {repo.stargazers_count}</span>
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-gray-200" />

      {/* ── Latest Posts ── */}
      {latestPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <FadeIn>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Latest writing</h2>
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                All posts <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.08}>
                <BlogCard post={post} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Projects ── */}
      {latestProjects.length > 0 && (
        <>
          <div className="border-t border-gray-200" />
          <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <FadeIn>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Featured projects</h2>
                <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
                  All projects <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestProjects.map((project, i) => (
                <FadeIn key={project.slug} delay={i * 0.08}>
                  <ProjectCard project={project} />
                </FadeIn>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
