import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FloatingSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  // Trigger entry animation once elements are slightly visible (margin: -100px)
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full ${className}`}
    >
      {/* Floating container loop */}
      <motion.div
        animate={isInView ? {
          y: [0, -8, 0],
        } : { y: 0 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
