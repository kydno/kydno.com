import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function WaterBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const mediaOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);
  const washOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.92]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ opacity: reduce ? 0 : mediaOpacity }}
      >
        <img
          src="/water.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {reduce ? null : (
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster="/water.jpg"
            aria-hidden
          >
            <source src="/water.webm" type="video/webm" />
            <source src="/water.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-foam"
        style={{ opacity: reduce ? 1 : washOpacity }}
      />
    </div>
  );
}
