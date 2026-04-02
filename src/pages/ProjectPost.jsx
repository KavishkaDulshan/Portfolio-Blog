import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';
import { getProjectBySlug } from '../utils/getProjects';
import ImageGallery from '../components/ImageGallery';

mermaid.initialize({ startOnLoad: true, theme: 'default' });

// Renders ![alt](src "title") with optional caption
function ImageWithCaption({ src, alt, title }) {
  return (
    <figure className="my-8">
      <img src={src} alt={alt} title={title} className="rounded-xl shadow-sm w-full" />
      {title && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">{title}</figcaption>
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

// Detect direct video files vs embed URLs
function isDirectVideo(url = '') {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// Inline video — <video> for direct files, <iframe> for embeds
function InlineVideo({ src }) {
  if (!src) return null;

  if (isDirectVideo(src)) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 my-8">
        <video
          src={src}
          controls
          className="w-full block max-h-[480px]"
          playsInline
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video my-8">
      <iframe
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full block"
        title="Demo video"
      />
    </div>
  );
}

export default function ProjectPost() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/projects" replace />;

  const {
    title,
    excerpt,
    tags = [],
    github,
    demo,
    demoVideo,
    inlineVideo,
    coverImage,
    gallery,
    body,
  } = project;

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      {/* Back */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-10"
      >
        <span aria-hidden="true">←</span> All projects
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
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 leading-tight mb-4">
          {title}
        </h1>
        {excerpt && (
          <p className="text-gray-700 leading-relaxed mb-6">{excerpt}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Live demo
            </a>
          )}
          {demoVideo && (
            <a
              href={demoVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              Watch demo video
            </a>
          )}
        </div>
      </header>

      <div className="border-t border-gray-200 my-8" />

      {/* Inline video — embedded player for short/medium videos */}
      {inlineVideo && <InlineVideo src={inlineVideo} />}

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

      {/* Image gallery */}
      {gallery?.length > 0 && <ImageGallery images={gallery} />}
    </div>
  );
}
