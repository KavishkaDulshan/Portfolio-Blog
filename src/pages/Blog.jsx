import { Link, NavLink } from 'react-router-dom';
import { getEnPosts, getSiPosts, getAllPosts } from '../utils/getPosts';
import SEO, { SITE_URL } from '../components/SEO';
import BlogCard from '../components/BlogCard';
import FadeIn from '../components/FadeIn';

const HREFLANG = [
  { lang: 'en', href: `${SITE_URL}/en/blog` },
  { lang: 'si', href: `${SITE_URL}/si/blog` },
  { lang: 'x-default', href: `${SITE_URL}/en/blog` },
];

/**
 * Shared blog listing UI.
 * @param {'en'|'si'|'all'} lang  — which set of posts to show
 */
function BlogList({ lang }) {
  const posts =
    lang === 'en' ? getEnPosts()
    : lang === 'si' ? getSiPosts()
    : getAllPosts();

  const isEn = lang === 'en' || lang === 'all';
  const isSi = lang === 'si';

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
      <SEO
        title={lang === 'si' ? 'බ්ලොග් — සිංහල' : 'Blog'}
        description={
          lang === 'si'
            ? 'Kavishka Dulshan ගේ සිංහල ලිපි — IoT, Raspberry Pi, සහ software engineering ගැන.'
            : 'Articles on software engineering, IoT, microcontrollers, and learning in public — by Kavishka Dulshan.'
        }
        path={lang === 'si' ? '/si/blog' : '/en/blog'}
        hreflang={HREFLANG}
      />

      <FadeIn>
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-3">
            {lang === 'si' ? 'බ්ලොග්' : 'Blog'}
          </h1>
          <p className="text-gray-500 text-sm">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            {lang === 'si' ? ' — සිංහල' : ' on software engineering, learning, and building.'}
          </p>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-1 mb-10 border border-gray-200 rounded-full p-1 w-fit">
          <NavLink
            to="/en/blog"
            id="blog-lang-en"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive || lang === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            English
          </NavLink>
          <NavLink
            to="/si/blog"
            id="blog-lang-si"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            සිංහල
          </NavLink>
        </div>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-sm">
              {lang === 'si'
                ? 'සිංහල ලිපි නොමැත. lang: "si" frontmatter field එකක් සහිත .md file එකක් src/posts/ ෆෝල්ඩරයට දමන්න.'
                : <>No posts yet. Drop a <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">.md</code> file in <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">src/posts/</code> to get started.</>
              }
            </p>
          </div>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.02}>
              <BlogCard post={post} lang={lang} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

/** /en/blog — English posts */
export function EnBlog() {
  return <BlogList lang="en" />;
}

/** /si/blog — Sinhala posts */
export function SiBlog() {
  return <BlogList lang="si" />;
}

/** /blog — legacy combined view, still works */
export default function Blog() {
  return <BlogList lang="all" />;
}
