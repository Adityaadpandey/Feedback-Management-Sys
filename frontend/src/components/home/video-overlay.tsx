"use client";

import { motion } from "framer-motion";
import { memo } from "react";

const VideoOverlay = memo(() => {
  return (
    <>
      <div className="absolute inset-0 bg-grid-white/10 pointer-events-none mix-blend-overlay" />

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ willChange: "opacity" }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0], scale: [1, 1.1, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.5,
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.4) 0%, transparent 70%)",
          willChange: "opacity, transform",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 mix-blend-overlay" />
      </motion.div>
    </>
  );
});

VideoOverlay.displayName = "VideoOverlay";
export default VideoOverlay;
