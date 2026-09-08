import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { timeline } from "../content";

function TimelineItem({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className="origin-left"
      initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px 80px 0px" }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.li>
  );
}

export function Timeline() {
  return (
    <section className="relative z-[1] mx-auto w-full max-w-xl px-6 pt-8 pb-40">
      <ol className="flex flex-col gap-5">
        {timeline.map((entry) => (
          <TimelineItem key={entry.date + entry.text}>
            <div className="grid grid-cols-[6.6rem_minmax(0,1fr)] items-baseline gap-x-6">
              <time className="font-mono text-[0.8rem] font-medium tabular-nums tracking-tight text-mute">
                {entry.date}
              </time>
              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[1.02rem] leading-snug text-ink underline decoration-ink/25 underline-offset-[0.22em] transition-colors hover:decoration-ink"
                >
                  {entry.text}
                </a>
              ) : (
                <p className="text-[1.02rem] leading-snug text-ink">
                  {entry.text}
                </p>
              )}
            </div>
          </TimelineItem>
        ))}
      </ol>
    </section>
  );
}
