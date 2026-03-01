"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // 2.5 seconds baad animation apne aap gayab ho jayega
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl font-extrabold tracking-widest uppercase mb-4"
          >
            Essential Rush
          </motion.div>
          
          {/* Tagline Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-gray-400 tracking-widest font-light"
          >
            Premium. Exclusive. Yours.
          </motion.div>

          {/* Loading Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-1 bg-white mt-8 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}