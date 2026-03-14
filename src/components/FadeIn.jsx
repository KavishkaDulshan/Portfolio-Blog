import { motion } from 'framer-motion';

/**
 * Wraps children in a fade-up scroll animation.
 * Animates once when the element enters the viewport.
 *
 * Props:
 *  delay     – stagger offset in seconds (default 0)
 *  y         – initial vertical offset in px (default 20)
 *  className – passed to the motion wrapper div
 */
export default function FadeIn({ children, delay = 0, y = 20, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
