import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { getPostBySlug } from '../utils/getPosts';

// Renders ![alt](src "title") — if a title is present it renders as a visible caption.
function ImageWithCaption({ src, alt, title }) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        title={title}
        className="rounded-xl shadow-sm w-full"
      />
      {title && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

const mdComponents = { img: ImageWithCaption };

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const { title, date, tags = [], coverImage, body } = post;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      {/* Back */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-10"
      >
        <span aria-hidden="true">←</span> All posts
      </Link>

      {/* Cover image */}
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="w-full rounded-xl object-cover mb-10 aspect-video"
        />
      )}

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {formattedDate && (
            <time className="text-xs text-gray-600 tabular-nums">{formattedDate}</time>
          )}
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 leading-tight">
          {title}
        </h1>
      </header>

      {/* Body */}
      <div
        className="prose prose-gray max-w-none
          prose-headings:font-serif prose-headings:font-medium prose-headings:text-gray-900
          prose-p:text-gray-800 prose-p:leading-relaxed
          prose-a:text-gray-900 prose-a:underline prose-a:underline-offset-2
          prose-strong:text-gray-900
          prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-300 prose-pre:rounded-xl
          prose-blockquote:border-l-gray-400 prose-blockquote:text-gray-700
          prose-li:text-gray-800
          prose-img:rounded-xl prose-img:shadow-sm"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={mdComponents}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
