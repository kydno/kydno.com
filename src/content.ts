export type SocialId = "x" | "youtube" | "twitch" | "github";

export type SocialLink = {
  id: SocialId;
  label: string;
  href: string;
  /** Desktop diamond rest: clockwise from NE. */
  corner: "ne" | "se" | "sw" | "nw";
};

export type TimelineEntry = {
  date: string;
  text: string;
  href?: string;
};

export const socials: SocialLink[] = [
  {
    id: "x",
    label: "X",
    href: "https://x.com/KYDNO_",
    corner: "ne",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@KYDNO",
    corner: "se",
  },
  {
    id: "twitch",
    label: "Twitch",
    href: "https://www.twitch.tv/kydno_",
    corner: "sw",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/kydno",
    corner: "nw",
  },
];

export const timeline: TimelineEntry[] = [
  {
    date: "06.15.26",
    text: "First open source GitHub PR merged",
    href: "https://github.com/odysseus-dev/odysseus/pull/3549",
  },
  { date: "03.07.26", text: "First used Claude Code" },
  { date: "10.29.25", text: "Started FlexCheck" },
  { date: "10.15.25", text: "First used Cursor", href: "https://cursor.com/@kadin" },
  { date: "08.26.25", text: "First GitHub commit" },
  {
    date: "09.17.21",
    text: "First X post",
    href: "https://x.com/KYDNO_/status/1438866786611511300",
  },
];
