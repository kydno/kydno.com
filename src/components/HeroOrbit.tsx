import {
  GithubLogo,
  TwitchLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { socials, type SocialId, type SocialLink } from "../content";
import { BotEyes } from "./BotEyes";
import { GlassBubble } from "./GlassBubble";

const ORBIT = 760;
const SAT_SIZE = 105;
const PHOTO_SIZE = 275;
const RADIUS = 285;
const SAT_CAP = 36;
const PHOTO_CAP = SAT_CAP * (SAT_SIZE / PHOTO_SIZE);
const DIAG = RADIUS / Math.SQRT2;

const SPRING = { stiffness: 140, damping: 22, mass: 0.55 };

const REST: Record<SocialLink["corner"], { x: number; y: number }> = {
  ne: { x: DIAG, y: -DIAG },
  se: { x: DIAG, y: DIAG },
  sw: { x: -DIAG, y: DIAG },
  nw: { x: -DIAG, y: -DIAG },
};

const ICONS: Record<
  SocialId,
  typeof XLogo
> = {
  x: XLogo,
  youtube: YoutubeLogo,
  twitch: TwitchLogo,
  github: GithubLogo,
};

function pullToward(
  pointerX: number,
  pointerY: number,
  restX: number,
  restY: number,
  cap: number,
) {
  const dx = pointerX - restX;
  const dy = pointerY - restY;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) {
    return { x: 0, y: 0 };
  }
  const mag = Math.min(cap, dist * 0.18);
  return { x: (dx / dist) * mag, y: (dy / dist) * mag };
}

function useDesktop() {
  const matches = useMotionValue(0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      matches.set(media.matches ? 1 : 0);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [matches]);

  return matches;
}

function useCappedOffset(
  restX: number,
  restY: number,
  cap: number,
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>,
  tracking: MotionValue<number>,
) {
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const springX = useSpring(pullX, SPRING);
  const springY = useSpring(pullY, SPRING);

  useEffect(() => {
    const apply = () => {
      if (tracking.get() === 0) {
        pullX.set(0);
        pullY.set(0);
        return;
      }
      const next = pullToward(
        pointerX.get(),
        pointerY.get(),
        restX,
        restY,
        cap,
      );
      pullX.set(next.x);
      pullY.set(next.y);
    };

    const unsubX = pointerX.on("change", apply);
    const unsubY = pointerY.on("change", apply);
    const unsubTrack = tracking.on("change", apply);
    return () => {
      unsubX();
      unsubY();
      unsubTrack();
    };
  }, [cap, pointerX, pointerY, pullX, pullY, restX, restY, tracking]);

  return { x: springX, y: springY };
}

function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return null;
  }
  return (
    <img
      src="/me.jpg"
      alt=""
      className="absolute inset-0 z-[1] h-full w-full rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function PhotoWell({
  size,
  x,
  y,
}: {
  size: number;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-label="Profile photo"
      className="glass-bubble overflow-hidden"
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        x,
        y,
      }}
    >
      <ProfilePhoto />
      <BotEyes layout="desktop" />
    </motion.div>
  );
}

function OrbitSatellite({
  social,
  pointerX,
  pointerY,
  tracking,
}: {
  social: SocialLink;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  tracking: MotionValue<number>;
}) {
  const rest = REST[social.corner];
  const { x, y } = useCappedOffset(
    rest.x,
    rest.y,
    SAT_CAP,
    pointerX,
    pointerY,
    tracking,
  );
  const Icon = ICONS[social.id];

  return (
    <GlassBubble
      social={social}
      size={SAT_SIZE}
      anchored
      restX={rest.x}
      restY={rest.y}
      pullX={x}
      pullY={y}
    >
      <Icon size={38} weight="light" />
    </GlassBubble>
  );
}

export function HeroOrbit() {
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const orbitRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tracking = useMotionValue(0);
  const photo = useCappedOffset(
    0,
    0,
    PHOTO_CAP,
    pointerX,
    pointerY,
    tracking,
  );

  const physicsOn = !reduce;

  return (
    <section className="flex min-h-[100dvh] items-center justify-center px-4">
      <div className="flex w-full max-w-lg flex-col items-center md:hidden">
        <div
          aria-label="Profile photo"
          className="glass-bubble relative overflow-hidden"
          style={{ width: 220, height: 220 }}
        >
          <ProfilePhoto />
          <BotEyes layout="mobile" />
        </div>
        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-4 gap-y-10">
          {socials.map((social) => {
            const Icon = ICONS[social.id];
            return (
              <GlassBubble key={social.id} social={social} size={85}>
                <Icon size={33} weight="light" />
              </GlassBubble>
            );
          })}
        </div>
      </div>

      <div
        ref={orbitRef}
        className="relative hidden md:block"
        style={{ width: ORBIT, height: ORBIT }}
        onPointerMove={
          physicsOn
            ? (event) => {
                const node = orbitRef.current;
                if (!node || desktop.get() === 0) {
                  return;
                }
                const rect = node.getBoundingClientRect();
                pointerX.set(event.clientX - (rect.left + rect.width / 2));
                pointerY.set(event.clientY - (rect.top + rect.height / 2));
                tracking.set(1);
              }
            : undefined
        }
        onPointerLeave={
          physicsOn
            ? () => {
                tracking.set(0);
              }
            : undefined
        }
      >
        <PhotoWell size={PHOTO_SIZE} x={photo.x} y={photo.y} />
        {socials.map((social) => (
          <OrbitSatellite
            key={social.id}
            social={social}
            pointerX={pointerX}
            pointerY={pointerY}
            tracking={tracking}
          />
        ))}
      </div>
    </section>
  );
}
