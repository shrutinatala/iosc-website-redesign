import upcomingEvents from "./upcoming-events.json";

export type RecruitingMode = "coffee" | "applications-soon";

export const siteConfig = {
  recruitingMode: "coffee" as RecruitingMode,
  tagline: "USC's Apple Platforms development club",
  /** Placeholder — replace with the real Calendly event link. */
  calendlyUrl: "https://calendly.com/iosc-usc/coffee-chat",
  /** Placeholder — replace with the club's real profiles. */
  socials: {
    instagram: "https://instagram.com/iosc.usc",
    x: "https://x.com/iosc_usc",
    linkedin: "https://www.linkedin.com/company/iosc",
  },
};

export type PersonApp = {
  name: string;
  summary: string;
  placeholder?: boolean;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  image?: string;
  github?: string;
  linkedin?: string;
  apps: PersonApp[];
  /** Entire profile is stand-in data. */
  placeholder?: boolean;
};

const placeholderApp = (name: string): PersonApp => ({
  name,
  summary: ({
    Northstar: "Fictional demo: a calmer daily planner with priorities and focus sessions.",
    "Desk Note": "Fictional demo: a flexible notebook for sketches, projects, and everyday ideas.",
    "Studio Hours": "Fictional demo: discover campus study sessions and creative meetups.",
    Signal: "Fictional demo: a personal music journal with mood-based collections.",
    "Field Notes": "Fictional demo: save favorite walks, viewpoints, and outdoor discoveries.",
  } as Record<string, string>)[name] ?? "Placeholder. Swap in an app this person actually shipped.",
  placeholder: true,
});

export const eboard: Person[] = [
  {
    id: "om-chachad",
    name: "Om Chachad",
    role: "Co-President",
    image: "/team/om.png",
    linkedin: "https://www.linkedin.com/in/omchachad/",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "marina-lee",
    name: "Marina Lee",
    role: "Co-President",
    image: "/team/marina.jpg",
    linkedin: "https://www.linkedin.com/in/marinahylee",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "shruti-natala",
    name: "Shruti Natala",
    role: "VP, Community",
    image: "/team/shruti.jpeg",
    linkedin: "https://www.linkedin.com/in/shruti-natala",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "laura-jun",
    name: "Laura Jun",
    role: "VP, RSO Management",
    image: "/team/laura.png",
    linkedin: "https://www.linkedin.com/in/laura-jun/",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "rehaan-anjaria",
    name: "Rehaan Anjaria",
    role: "VP, Outreach",
    image: "/team/rehaan.jpeg",
    linkedin: "https://www.linkedin.com/in/rehaananjaria/",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "pan-pitpreecha",
    name: "Pan Pitpreecha",
    role: "VP, Industry Relations",
    image: "/team/pan.png",
    apps: [placeholderApp("Placeholder App")],
  },
  {
    id: "jacob-scheff",
    name: "Jacob Scheff",
    role: "VP, Programming",
    image: "/team/jacob.png",
    apps: [placeholderApp("Placeholder App")],
  },
];

export const members: Person[] = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Member",
    github: "https://github.com/placeholder-alex",
    linkedin: "https://www.linkedin.com/in/placeholder-alex",
    apps: [placeholderApp("Northstar"), placeholderApp("Desk Note")],
    placeholder: true,
  },
  {
    id: "jordan-kim",
    name: "Jordan Kim",
    role: "Member",
    github: "https://github.com/placeholder-jordan",
    linkedin: "https://www.linkedin.com/in/placeholder-jordan",
    apps: [],
    placeholder: true,
  },
  {
    id: "sam-patel",
    name: "Sam Patel",
    role: "Member",
    github: "https://github.com/placeholder-sam",
    linkedin: "https://www.linkedin.com/in/placeholder-sam",
    apps: [placeholderApp("Studio Hours")],
    placeholder: true,
  },
];

export const alumni: Person[] = [
  {
    id: "taylor-nguyen",
    name: "Taylor Nguyen",
    role: "Alumni",
    github: "https://github.com/placeholder-taylor",
    linkedin: "https://www.linkedin.com/in/placeholder-taylor",
    apps: [],
    placeholder: true,
  },
  {
    id: "riley-chen",
    name: "Riley Chen",
    role: "Alumni",
    github: "https://github.com/placeholder-riley",
    linkedin: "https://www.linkedin.com/in/placeholder-riley",
    apps: [placeholderApp("Signal"), placeholderApp("Field Notes")],
    placeholder: true,
  },
];

export type GalleryMedia =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export type GalleryEvent = {
  id: string;
  title: string;
  date: string;
  caption: string;
  media: GalleryMedia;
};

export const galleryEvents: GalleryEvent[] = [
  {
    id: "hollywood-hike",
    title: "iOSC Hollywood Hike",
    date: "March 8, 2026",
    caption:
      "Club hike to the Hollywood sign. A chance to connect outside the lab and enjoy the views.",
    media: { type: "video", src: "/events/iosc-hollywood-hike.mp4" },
  },
  {
    id: "hack-night",
    title: "Swift Student Challenge Hack Night",
    date: "February 27, 2026",
    caption:
      "Members spent a night working on their Swift Student Challenge submissions with pizza and good vibes.",
    media: { type: "image", src: "/events/swift-challenge-hack-night.jpeg" },
  },
  {
    id: "workshop",
    title: "Swift Student Challenge Workshop",
    date: "January 29, 2026",
    caption:
      "Hands-on workshop to prepare for the Swift Student Challenge. From idea to submission.",
    media: { type: "image", src: "/events/swift-challenge-workshop.jpeg" },
  },
  {
    id: "layout-lab",
    title: "SwiftUI Layout Lab",
    date: "September 28, 2026",
    caption: "Sample photo. A hands-on night on stacks, grids, and animation.",
    media: { type: "image", src: "/events/sample-layout-lab.png" },
  },
  {
    id: "speaker-night",
    title: "Speaker Night",
    date: "October 2, 2026",
    caption: "Sample photo. A talk and questions in a small auditorium.",
    media: { type: "image", src: "/events/sample-speaker-night.png" },
  },
  {
    id: "build-night",
    title: "Open Build Night",
    date: "October 9, 2026",
    caption: "Sample photo. Laptops open, no agenda beyond the next commit.",
    media: { type: "image", src: "/events/sample-build-night.png" },
  },
  {
    id: "coffee-social",
    title: "Campus Coffee Social",
    date: "October 16, 2026",
    caption: "Sample photo. An informal meetup away from the lab.",
    media: { type: "image", src: "/events/sample-coffee.png" },
  },
];

export type ClubEvent = {
  slug: string;
  /** Short label shown on the calendar. */
  name: string;
  title: string;
  /** First day, YYYY-MM-DD. */
  date: string;
  /** Last day, inclusive. Defaults to date. */
  endDate?: string;
  time: string;
  summary: string;
  description: string;
  graphic: string;
  placeholder?: boolean;
};

const sampleEvents: ClubEvent[] = [
  {
    slug: "layout-lab",
    name: "Layout Lab",
    title: "SwiftUI Layout Lab",
    date: "2026-09-28",
    time: "7:00 PM",
    summary: "Sample event. A hands-on night on stacks, grids, and animation.",
    description:
      "Placeholder session. Members pair up and rebuild a screen using stacks, grids, and a little motion. Swap this copy when the real agenda is set.",
    graphic: "/events/sample-layout-lab.png",
    placeholder: true,
  },
  {
    slug: "speaker-night",
    name: "Speaker Night",
    title: "An evening with an Apple platforms engineer",
    date: "2026-10-02",
    time: "6:30 PM",
    summary: "Sample event. A talk and questions afterward.",
    description:
      "Placeholder speaker night. A guest walks through how they ship on Apple platforms, then stays for questions.",
    graphic: "/events/sample-speaker-night.png",
    placeholder: true,
  },
  {
    slug: "build-night",
    name: "Build Night",
    title: "Open build night",
    date: "2026-10-09",
    time: "7:00 PM",
    summary: "Sample event. Bring a project and work beside other members.",
    description:
      "Placeholder build night. Laptops open, no agenda beyond shipping the next piece of an app.",
    graphic: "/events/sample-build-night.png",
    placeholder: true,
  },
  {
    slug: "coffee-social",
    name: "Coffee Social",
    title: "Campus coffee social",
    date: "2026-10-16",
    time: "4:00 PM",
    summary: "Sample event. An informal meetup away from the lab.",
    description:
      "Placeholder social. A short outdoor meetup for members and anyone thinking about joining.",
    graphic: "/events/sample-coffee.png",
    placeholder: true,
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const REAL_GRAPHICS = [
  "/events/covers/applications.svg",
  "/events/covers/fair.svg",
  "/events/covers/info.svg",
  "/events/covers/deadline.svg",
  "/events/covers/interviews.svg",
  "/events/covers/decisions.svg",
  "/events/covers/gm.svg",
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const realEvents: ClubEvent[] = upcomingEvents.flatMap((ev, index) => {
  const monthIndex = MONTHS.indexOf(ev.date.month as (typeof MONTHS)[number]);
  const days = String(ev.date.day).match(/\d+/g)?.map((n) => Number(n)) ?? [];
  if (monthIndex < 0 || days.length === 0) return [];
  const start = days[0];
  const end = days[days.length - 1];
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `2026-${pad(monthIndex + 1)}-${pad(start)}`;
  const endDate = `2026-${pad(monthIndex + 1)}-${pad(end)}`;
  return [
    {
      slug: slugify(ev.title),
      name: ev.tag,
      title: ev.title,
      date,
      endDate: endDate === date ? undefined : endDate,
      time: ev.meta,
      summary: ev.meta,
      description: `${ev.title}. ${ev.meta}.`,
      graphic: REAL_GRAPHICS[index] ?? REAL_GRAPHICS[0],
    },
  ];
});

/** Real public events, then sample events layered on top. */
export const clubEvents: ClubEvent[] = [...realEvents, ...sampleEvents];

export function eventBySlug(slug: string) {
  return clubEvents.find((event) => event.slug === slug);
}

function covers(event: ClubEvent, isoDate: string) {
  const end = event.endDate ?? event.date;
  return isoDate >= event.date && isoDate <= end;
}

export function eventsOn(isoDate: string): ClubEvent[] {
  return clubEvents.filter((event) => covers(event, isoDate));
}

export function upcomingEventsList(today = new Date()): ClubEvent[] {
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return clubEvents
    .filter((event) => (event.endDate ?? event.date) >= iso)
    .sort((a, b) => a.date.localeCompare(b.date));
}
