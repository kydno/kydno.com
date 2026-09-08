import type { ReactNode } from "react";
import { motion, useReducedMotion, type MotionValue } from "motion/react";
import type { SocialLink } from "../content";

type GlassBubbleProps = {
  social: SocialLink;
  size: number;
  children: ReactNode;
  restX?: number;
  restY?: number;
  pullX?: MotionValue<number>;
  pullY?: MotionValue<number>;
  anchored?: boolean;
};

export function GlassBubble({
  social,
  size,
  children,
  restX = 0,
  restY = 0,
  pullX,
  pullY,
  anchored = false,
}: GlassBubbleProps) {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      aria-label={social.label}
      className={`glass-bubble group flex items-center justify-center text-ink hover:border-white/90 ${anchored ? "absolute" : "relative"}`}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={
            anchored
          ? {
              position: "absolute",
              width: size,
              height: size,
              left: `calc(50% + ${restX}px)`,
              top: `calc(50% + ${restY}px)`,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              x: pullX,
              y: pullY,
            }
          : { width: size, height: size }
      }
    >
      <span className="relative z-[1] flex items-center justify-center">
        {children}
      </span>
      <span className="pointer-events-none absolute top-[calc(100%+0.45rem)] left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap font-sans text-[0.72rem] tracking-[0.04em] text-ink/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        {social.label}
      </span>
    </motion.a>
  );
}
