'use client';

import { motion } from 'framer-motion';

export function AuroraBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}>
      <motion.div
        className="absolute left-[-10%] top-[-15%] h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[10%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[20%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -25, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  );
}
