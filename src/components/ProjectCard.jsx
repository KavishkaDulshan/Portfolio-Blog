import { Link } from 'react-router-dom';
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  const { slug, title, excerpt, tags = [], github, demo, coverImage } = project;

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Thumbnail */}
      {coverImage && (
        <Link to={`/projects/${slug}`} tabIndex={-1} aria-hidden="true">
          <img
            src={coverImage}
            alt=""
            className="w-full h-44 object-cover"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2 group-hover:underline decoration-1 underline-offset-2">
          <Link to={`/projects/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{excerpt}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-auto flex items-center gap-4">
          <Link
            to={`/projects/${slug}`}
            className="text-sm font-medium text-gray-900 hover:text-gray-700 inline-flex items-center gap-1 group/btn"
          >
            View project <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
            >
              <FiGithub className="text-gray-400" /> GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
            >
              <FiExternalLink className="text-gray-400" /> Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
