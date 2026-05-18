import { motion } from 'framer-motion';

/**
 * Vertical chronological timeline component.
 *
 * @param {Array}  events  - Array of { year, title, subtitle, description, highlight }
 * @param {string} [className]
 */
export default function Timeline({ events = [], className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical stem */}
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" aria-hidden="true" />

      <ol className="space-y-8 relative">
        {events.map((event, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
            className="flex gap-5 pl-1"
          >
            {/* Node dot */}
            <div className="relative shrink-0 mt-1">
              <div
                className={`w-[11px] h-[11px] rounded-full border-2 ${
                  event.highlight
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-400 bg-white'
                }`}
              />
            </div>

            {/* Content */}
            <div className="pb-2">
              <p className="text-xs font-mono text-gray-500 mb-1 leading-none">{event.year}</p>
              <p className="text-sm font-semibold text-gray-900 leading-snug">{event.title}</p>
              {event.subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{event.subtitle}</p>
              )}
              {event.description && (
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed max-w-lg">
                  {event.description}
                </p>
              )}
              {event.highlight && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white font-medium">
                  {event.highlight}
                </span>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
