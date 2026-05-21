import { Link } from 'react-router-dom';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

export default function BlogCard({ post, lang }) {
  const { slug, title, date, excerpt, tags = [], coverImage } = post;

  // Always use the canonical /blog/:slug path to avoid GSC "Duplicate without
  // user-selected canonical" issues. The SEO component declares /blog/:slug as
  // the canonical URL, so internal links must match it exactly.
  const postPath = `/blog/${slug}`;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Thumbnail */}
      {coverImage && (
        <Link to={postPath} tabIndex={-1} aria-hidden="true">
          <img
            src={coverImage}
            alt=""
            className="w-full h-44 object-cover"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <time className="text-xs text-gray-600 tabular-nums flex items-center gap-1.5">
            <FiCalendar className="text-gray-400" />
            {formattedDate}
          </time>
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2 group-hover:underline decoration-1 underline-offset-2">
          <Link to={postPath}>{title}</Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{excerpt}</p>
        )}

        {/* CTA */}
        <Link
          to={postPath}
          className="mt-auto text-sm font-medium text-gray-900 hover:text-gray-700 inline-flex items-center gap-1 group/btn"
        >
          Read article <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
