import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

const LOOK = { stiffness: 170, damping: 20, mass: 0.45 };
const LID = { stiffness: 820, damping: 32, mass: 0.35 };
const DESKTOP = "(min-width: 768px)";
const REST_SCROLL = 0.92;
const REST_LOOK = { x: -0.82, y: -0.72 };

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function BotEyes({ layout }: { layout: "mobile" | "desktop" }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const x = useSpring(lookX, LOOK);
  const y = useSpring(lookY, LOOK);
  const rotate = useTransform(
    [x, y],
    ([lx, ly]) => 16 + Number(lx) * 0.22 + Number(ly) * 0.12,
  );
  const lid = useMotionValue(1);
  const scaleY = useSpring(lid, LID);

  const gaze = useRef({
    layout,
    reduce: Boolean(reduce),
    scrollYProgress,
    lookX,
    lookY,
  });
  gaze.current = {
    layout,
    reduce: Boolean(reduce),
    scrollYProgress,
    lookX,
    lookY,
  };

  const layoutActive = () => {
    const desktop = window.matchMedia(DESKTOP).matches;
    return gaze.current.layout === "desktop" ? desktop : !desktop;
  };

  const shouldRest = () => {
    const g = gaze.current;
    return (
      g.reduce ||
      !hasMoved.current ||
      g.scrollYProgress.get() >= REST_SCROLL
    );
  };

  const lookRest = () => {
    const node = wrapRef.current;
    const size = node ? node.getBoundingClientRect().width : 275;
    const travel = size * 0.16;
    gaze.current.lookX.set(REST_LOOK.x * travel);
    gaze.current.lookY.set(REST_LOOK.y * travel * 0.92);
  };

  const applyLook = (clientX: number, clientY: number) => {
    const node = wrapRef.current;
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const travel = rect.width * 0.16;
    gaze.current.lookX.set(clamp(nx, -1, 1) * travel);
    gaze.current.lookY.set(clamp(ny, -1, 1) * travel * 0.92);
  };

  const syncGaze = () => {
    if (!layoutActive()) {
      return;
    }
    if (shouldRest()) {
      lookRest();
      return;
    }
    applyLook(lastPointer.current.x, lastPointer.current.y);
  };

  useMotionValueEvent(scrollYProgress, "change", () => {
    syncGaze();
  });

  useEffect(() => {
    lookRest();

    const onMove = (event: PointerEvent) => {
      lastPointer.current = { x: event.clientX, y: event.clientY };
      if (!layoutActive()) {
        return;
      }
      if (gaze.current.reduce) {
        lookRest();
        return;
      }
      hasMoved.current = true;
      syncGaze();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (reduce) {
      return;
    }

    let cancelled = false;
    let timer = 0;

    const blink = async () => {
      if (!layoutActive()) {
        return;
      }
      lid.set(0.06);
      await wait(70 + Math.random() * 90);
      if (cancelled) {
        return;
      }
      lid.set(1);
      if (Math.random() < 0.16) {
        await wait(70 + Math.random() * 90);
        if (cancelled) {
          return;
        }
        lid.set(0.06);
        await wait(60 + Math.random() * 70);
        if (cancelled) {
          return;
        }
        lid.set(1);
      }
    };

    const loop = () => {
      const gap = 1600 + Math.random() * 6400;
      timer = window.setTimeout(async () => {
        await blink();
        if (!cancelled) {
          loop();
        }
      }, gap);
    };

    timer = window.setTimeout(() => {
      void blink().then(() => {
        if (!cancelled) {
          loop();
        }
      });
    }, 900 + Math.random() * 1800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [layout, lid, reduce]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="flex items-center justify-center"
        style={{
          x,
          y,
          rotate,
          width: "36%",
          height: "24%",
        }}
      >
        <motion.span
          className="block h-full w-[22%] rounded-full bg-ink"
          style={{
            scaleY: reduce ? 1 : scaleY,
            transformOrigin: "center",
          }}
        />
        <motion.span
          className="ml-[18%] block h-full w-[22%] rounded-full bg-ink"
          style={{
            scaleY: reduce ? 1 : scaleY,
            transformOrigin: "center",
          }}
        />
      </motion.div>
    </div>
  );
}
