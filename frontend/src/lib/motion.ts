"use client";
// Re-export framer-motion with "use client" directive so it
// doesn't cause SSR issues in Next.js 15 App Router
export {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
