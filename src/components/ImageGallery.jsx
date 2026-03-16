import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Normalise gallery items — accepts either strings or { src, caption } objects
function normalise(items = []) {
  return items.map((item) =>
    typeof item === 'string' ? { src: item, caption: '' } : item
  );
}

// ── Lightbox ────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const img = images[index];

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 text-white/80 hover:text-white text-3xl leading-none font-light"
        aria-label="Close"
      >
        ×
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {index + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-6 text-white/70 hover:text-white text-4xl leading-none font-light px-2 py-4 select-none"
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="flex flex-col items-center max-w-[90vw] max-h-[90vh] gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.caption || ''}
          className="max-w-[90vw] max-h-[80vh] rounded-lg object-contain shadow-2xl"
          draggable={false}
        />
        {img.caption && (
          <p className="text-white/70 text-sm text-center px-4">{img.caption}</p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-6 text-white/70 hover:text-white text-4xl leading-none font-light px-2 py-4 select-none"
          aria-label="Next"
        >
          ›
        </button>
      )}
    </div>,
    document.body
  );
}

// ── Gallery grid ─────────────────────────────────────────────────────
export default function ImageGallery({ images: raw = [] }) {
  const images = normalise(raw);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const open  = useCallback((i) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev  = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next  = useCallback(() =>
    setLightboxIndex((i) => (i + 1) % images.length), [images.length]);

  if (images.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-xl font-medium text-gray-900 mb-4">Screenshots</h2>

      <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="group relative overflow-hidden rounded-xl border border-gray-200 aspect-video bg-gray-50 hover:border-gray-400 transition-colors"
            aria-label={img.caption || `Screenshot ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.caption || `Screenshot ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm3-8H8m3-3v6" />
              </svg>
            </div>
            {img.caption && (
              <span className="absolute bottom-0 inset-x-0 px-2 py-1 text-xs text-white bg-black/50 truncate text-left">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
