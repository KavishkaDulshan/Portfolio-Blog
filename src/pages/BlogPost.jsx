import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';
import { getPostBySlug } from '../utils/getPosts';

mermaid.initialize({ startOnLoad: true, theme: 'default' });

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

// Renders mermaid diagrams with fullscreen option
function MermaidBlock({ code }) {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const diagramId = useRef(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!code || !code.trim()) {
      setError('No diagram code provided');
      return;
    }

    const renderDiagram = async () => {
      try {
        const trimmedCode = code.trim();
        console.log('Rendering mermaid:', trimmedCode.substring(0, 100));
        const { svg: mermaidSvg } = await mermaid.render(diagramId.current, trimmedCode);
        setSvg(mermaidSvg);
        setError('');
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(`Failed to render diagram: ${err.message}`);
      }
    };
    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const DiagramContent = () => (
    <div 
      className="w-full flex justify-center items-start p-4" 
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );

  return (
    <>
      <div ref={ref} className="my-8 flex flex-col gap-3">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.2))}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Zoom out"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm bg-gray-100 rounded min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(2, scale + 0.2))}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Zoom in"
            >
              +
            </button>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-4 py-1 text-sm bg-gray-900 text-white hover:bg-gray-700 rounded transition-colors"
          >
            Fullscreen
          </button>
        </div>
        <div className="overflow-auto bg-white rounded-lg border border-gray-200 max-h-[600px]">
          {svg ? <DiagramContent /> : <div className="text-gray-500 py-12 text-center">Rendering diagram...</div>}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-screen flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Architecture Diagram</h3>
              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.2))}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    title="Zoom out"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm bg-gray-100 rounded min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(Math.min(2, scale + 0.2))}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    title="Zoom in"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-1 text-sm bg-gray-900 text-white hover:bg-gray-700 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-start justify-center p-4">
              <DiagramContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const mdComponents = {
  img: ImageWithCaption,
  code: ({ inline, className, children }) => {
    const match = className?.match(/language-([\w-]+)/);
    const language = match?.[1];
    
    // Extract text content from children
    const codeText = Array.isArray(children)
      ? children.map(child => typeof child === 'string' ? child : child?.props?.children || '').join('')
      : typeof children === 'string'
        ? children
        : String(children);

    if (language === 'mermaid' && !inline) {
      return <MermaidBlock code={codeText} />;
    }
    
    return <code className={className}>{children}</code>;
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const { title, date, tags = [], coverImage, body } = post;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
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
