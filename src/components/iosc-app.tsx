"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import appStoreIcon from "../../archive/src/assets/app_store.png";
import swiftLogoIcon from "../../archive/src/assets/swift_logo.png";
import upcomingEvents from "../data/upcoming-events.json";

const PAGES = ["home", "about", "team"] as const;

const HEADER_OPTIONS = [
  "Welcome to the start of<br/>something *special.*",
  "Build *experiences* not apps.",
  "Join a community of *passionate* builders.",
  "For the love of the *craft.*",
  "Create the *next big app.*",
  "The future is *yours* to create.",
];

function parseHeaderText(text: string) {
  const parts: React.ReactNode[] = [];
  let key = 0;
  const segments = text.split(/(\*[^*]*\*)/g);
  segments.forEach((seg) => {
    if (seg.startsWith("*") && seg.endsWith("*")) {
      parts.push(
        <span key={key++} className="font-normal text-theme-0">
          {seg.slice(1, -1)}
        </span>,
      );
    } else {
      const lines = seg.split(/<br\s*\/?>/i);
      lines.forEach((line, j) => {
        if (j > 0) parts.push(<br key={key++} />);
        parts.push(<span key={key++}>{line}</span>);
      });
    }
  });
  return parts;
}

const UPCOMING_EVENTS = upcomingEvents;

function parseUpcomingEventDate(ev: {
  date: { month: string; day: string | number };
}): Date | null {
  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const monthKey = ev.date.month as keyof typeof monthMap;
  const monthIndex = monthMap[monthKey];
  // Use the last day in ranges like "6–7" so multi-day events stay visible
  const dayRaw = String(ev.date.day);
  const dayParts = dayRaw.match(/\d+/g);
  const dayNum = dayParts ? parseInt(dayParts[dayParts.length - 1], 10) : NaN;
  if (Number.isNaN(dayNum) || monthIndex === undefined) return null;
  const now = new Date();
  return new Date(now.getFullYear(), monthIndex, dayNum);
}

const APPLY_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfvNZ2VFtY7UvD0Ky6T_3M4VkdlSsT9f9Th54a2ncOuGXaeeg/viewform";

const INTEREST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfXNHotRVNNiF3aEfts94_OyiccqDDo-Km74aKVdJa--GF0hw/viewform";

/** Event archive carousel — only the 3 items from event assets */
const ARCHIVE_EVENTS: Array<{
  title: string;
  date: string;
  description: string;
  media: { type: "image"; src: string } | { type: "video"; src: string };
}> = [
  {
    title: "iOSC Hollywood Hike",
    date: "March 8, 2026",
    description:
      "Club hike to the Hollywood sign. A chance to connect outside the lab and enjoy the views.",
    media: { type: "video", src: "/events/iosc-hollywood-hike.mp4" },
  },
  {
    title: "Swift Student Challenge Hack Night",
    date: "February 27, 2026",
    description:
      "Members spent a night working on their Swift Student Challenge submissions with pizza and good vibes.",
    media: { type: "image", src: "/events/swift-challenge-hack-night.jpeg" },
  },
  {
    title: "Swift Student Challenge Workshop",
    date: "January 29, 2026",
    description:
      "Hands-on workshop to prepare for the Swift Student Challenge. From idea to submission.",
    media: { type: "image", src: "/events/swift-challenge-workshop.jpeg" },
  },
];

interface Feature {
  title: string;
  desc: string;
  emoji?: string;
  icon?: StaticImageData;
  iconAlt?: string;
}

const FEATURES: Feature[] = [
  {
    title: "General Meetings",
    desc: "Learn Swift from 0 to 1 together.",
    icon: swiftLogoIcon,
    iconAlt: "Swift logo",
  },
  {
    emoji: "🍎",
    title: "Workshops",
    desc: "Build with others in focused sessions.",
  },
  {
    emoji: "👥",
    title: "Speaker Events",
    desc: "Hear from top app builders and Apple engineers.",
  },
  {
    title: "Launchpad",
    desc: "Ship your app and share it with users.",
    icon: appStoreIcon,
    iconAlt: "App Store logo",
  },
];

const TEAM = [
  {
    name: "Om Chachad",
    role: "President",
    tag: "Swift Developer",
    image: "/team/om.jpg",
    linkedin: "https://www.linkedin.com/in/omchachad/",
  },
  {
    name: "Shruti Natala",
    role: "Vice President",
    tag: "Developer",
    image: "/team/shruti.jpeg",
    linkedin: "https://www.linkedin.com/in/shruti-natala",
  },
  {
    name: "Amna Janoo",
    role: "VP, Finance",
    tag: "Finance @ Apple",
    image: "/team/amna.png",
    linkedin: "https://www.linkedin.com/in/amna-janoo/",
  },
  {
    name: "Rehaan Anjaria",
    role: "VP, Outreach",
    tag: "Developer",
    image: "/team/rehaan.jpeg",
    linkedin: "https://www.linkedin.com/in/rehaananjaria/",
  },
  {
    name: "Laura Jun",
    role: "VP, Operations",
    tag: "Creator",
    image: "/team/laura.png",
    linkedin: "https://www.linkedin.com/in/laura-jun/",
  },
];

const THEME_STORAGE_KEY = "iosc-theme";

function getDefaultTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as
    | "light"
    | "dark"
    | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const AUTO_ADVANCE_MS = 7500;
const FLIP_DURATION_MS = 400;

function EventCarousel({ isActive }: { isActive: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipPhase, setFlipPhase] = useState<"idle" | "out" | "in">("idle");
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const nextIndexRef = useRef(0);

  const total = ARCHIVE_EVENTS.length;
  const event = ARCHIVE_EVENTS[currentIndex];

  useEffect(() => {
    if (!isActive || flipPhase !== "idle") return;
    const t = setInterval(() => {
      goToIndex((currentIndex + 1) % total, "next");
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [isActive, currentIndex, total, flipPhase]);

  function goToIndex(next: number, dir: "next" | "prev") {
    if (flipPhase !== "idle") return;
    nextIndexRef.current = next;
    setDirection(dir);
    setFlipPhase("out");
    setTimeout(() => {
      setCurrentIndex(nextIndexRef.current);
      setFlipPhase("in");
      setTimeout(() => setFlipPhase("idle"), FLIP_DURATION_MS);
    }, FLIP_DURATION_MS);
  }

  function goNext() {
    goToIndex((currentIndex + 1) % total, "next");
  }

  function goPrev() {
    goToIndex((currentIndex - 1 + total) % total, "prev");
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-[var(--r-md)] overflow-hidden border border-theme-1 border-solid bg-theme-glass-1"
        style={{ height: 615 }}
      >
        <div
          className={`event-carousel-card flex flex-col h-full ${
            flipPhase === "out"
              ? direction === "next"
                ? "flip-out-next"
                : "flip-out-prev"
              : flipPhase === "in"
                ? direction === "next"
                  ? "flip-in-next"
                  : "flip-in-prev"
                : ""
          }`}
        >
          <div className="relative w-full flex-1">
            {event.media.type === "image" ? (
              <img
                src={event.media.src}
                alt=""
                className="block w-full h-full object-cover"
              />
            ) : (
              <video
                src={event.media.src}
                className="block w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            )}
          </div>
          <div className="p-4 flex flex-col gap-1 border-t border-theme-0 border-solid flex-shrink-0">
            <p className="font-semibold text-theme-0 text-base">
              {event.title}
            </p>
            <p className="text-xs text-theme-2">{event.date}</p>
            <p className="text-sm text-theme-1 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous event"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[rgba(0,0,0,0.45)] text-theme-0 shadow-md hover:bg-[rgba(0,0,0,0.7)] hover:-translate-x-0.5 transition-transform transition-colors z-10 backdrop-blur-md"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next event"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[rgba(0,0,0,0.45)] text-theme-0 shadow-md hover:bg-[rgba(0,0,0,0.7)] hover:translate-x-0.5 transition-transform transition-colors z-10 backdrop-blur-md"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function EboardAvatarHeic({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initial =
    name
      .split(" ")
      .map((n) => n[0])
      .join("") || "?";
  if (failed) {
    return (
      <span className="w-full h-full flex items-center justify-center text-xl font-semibold text-theme-1">
        {initial}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function IoscApp() {
  const [cur, setCur] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const touchStart = useRef<number>(0);
  const navContainerRef = useRef<HTMLElement | null>(null);
  const navButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [navIndicator, setNavIndicator] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    setHeaderIndex(Math.floor(Math.random() * HEADER_OPTIONS.length));
  }, []);

  useEffect(() => {
    setTheme(getDefaultTheme());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const go = useCallback((index: number) => {
    setCur(Math.max(0, Math.min(index, PAGES.length - 1)));
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(cur + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(cur - 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cur, go]);

  useEffect(() => {
    function updateNavIndicator() {
      const container = navContainerRef.current;
      const btn = navButtonRefs.current[cur];
      if (!container || !btn) return;
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setNavIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }

    updateNavIndicator();
    window.addEventListener("resize", updateNavIndicator);
    return () => window.removeEventListener("resize", updateNavIndicator);
  }, [cur]);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) go(cur - 1);
      else go(cur + 1);
    }
  }

  return (
    <div
      className="relative min-h-screen pt-16 md:pt-24"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="bg">
        <img src="/bg-iosc-hub.svg" alt="" className="bg-img" />
        <div className="bg-tint" aria-hidden />
      </div>
      <div className="grain" />

      {/* Page 1 — Home: left fixed, right scrollable */}
      <div
        className={`page ${cur !== 0 ? "inactive" : ""}`}
        id="home"
        role="tabpanel"
        aria-hidden={cur !== 0}
      >
        <div className="page-scroll-right">
          <div
            className="col-left animate-up"
            style={{ animationDelay: "0.04s", animationFillMode: "both" }}
          >
            <Image
              src={
                theme === "light" ? "/iosc-logo-light.png" : "/iosc-logo.png"
              }
              alt="iOSC"
              width={180}
              height={56}
              className="iosc-logo-hero"
              style={{ filter: "none" }}
              priority
            />
            <p
              className="text-[11px] uppercase tracking-[0.12em] text-theme-0 mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--sans)" }}
            >
              USC's first-ever Apple Platforms development club.
            </p>
            <h1
              className="text-[clamp(46px,5.8vw,76px)] font-bold tracking-[-0.04em] leading-[0.96] text-theme-0 mb-6"
              style={{ fontFamily: "var(--sans)" }}
            >
              {parseHeaderText(HEADER_OPTIONS[headerIndex])}
            </h1>
            <p
              className="text-[15.5px] font-normal text-theme-1 leading-[1.72] max-w-md mb-8"
              style={{ fontFamily: "var(--sans)" }}
            >
              We bring together students who want to learn Swift, build with
              SwiftUI, and ship real apps. Whether you&apos;re just starting or
              already shipping, you belong here.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={INTEREST_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-filled inline-flex items-center no-underline"
              >
                Interested?
              </a>
              <a
                href={APPLY_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-filled inline-flex items-center no-underline"
              >
                Apply now
              </a>
            </div>
          </div>
          <div
            className="col-right animate-up"
            style={{ animationDelay: "0.14s", animationFillMode: "both" }}
          >
            <p
              className="text-[10px] uppercase tracking-widest text-theme-2 mb-4"
              style={{ fontFamily: "var(--sans)" }}
            >
              Upcoming events
            </p>
            <div className="flex flex-col gap-4 pb-8 no-hover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {UPCOMING_EVENTS.filter((ev) => {
                const d = parseUpcomingEventDate(ev as any);
                if (!d) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d >= today;
              }).map((ev, i) => (
                <div
                  key={ev.title}
                  className="g-card flex items-center gap-4 p-4 cursor-default"
                  style={
                    i === 0
                      ? {
                          background: "var(--glass-2)",
                          border: "0.5px solid var(--border-2)",
                        }
                      : undefined
                  }
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-[var(--r-sm)] flex flex-col items-center justify-center text-center bg-theme-glass-2 border-theme-1 border border-solid">
                    <span className="text-[10px] uppercase text-theme-2 leading-tight">
                      {ev.date.month}
                    </span>
                    <span
                      className={`font-semibold text-theme-0 leading-tight ${
                        String(ev.date.day).length > 2 ? "text-sm" : "text-lg"
                      }`}
                    >
                      {ev.date.day}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase text-theme-2 mb-0.5">
                      {ev.tag}
                    </p>
                    <p className="font-medium text-theme-0 truncate">
                      {ev.title}
                    </p>
                    <p className="text-sm text-theme-1">{ev.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page 2 — About: left fixed, right scrollable */}
      <div
        className={`page ${cur !== 1 ? "inactive" : ""}`}
        id="about"
        role="tabpanel"
        aria-hidden={cur !== 1}
      >
        <div className="page-about-grid">
          <div
            className="col-left animate-up"
            style={{ animationDelay: "0.04s", animationFillMode: "both" }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.12em] text-theme-2 mb-2"
              style={{ fontFamily: "var(--sans)" }}
            >
              Est. 2026
            </p>
            <h2
              className="text-4xl font-bold tracking-tight text-theme-0 mb-6 leading-tight"
              style={{ fontFamily: "var(--sans)" }}
            >
              We build for Apple&apos;s world.
            </h2>
            <p
              className="text-[15px] font-normal text-theme-1 leading-relaxed mb-8"
              style={{ fontFamily: "var(--sans)" }}
            >
              iOSC is USC&apos;s home for Apple platforms. Learn Swift, explore
              special topics, meet builders, and ship apps that real people use.
            </p>
            <div className="flex items-center justify-between py-4 border-t border-b gap-6 border-theme-0">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-theme-0">43</p>
                <p className="text-[11px] text-theme-2 uppercase tracking-wider">
                  Members
                </p>
              </div>
              <div
                className="w-px h-10 bg-theme-0"
                style={{ background: "var(--border-0)" }}
              />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-theme-0">6</p>
                <p className="text-[11px] text-theme-2 uppercase tracking-wider">
                  SSC Projects
                </p>
              </div>
              <div
                className="w-px h-10 bg-theme-0"
                style={{ background: "var(--border-0)" }}
              />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-theme-0">3</p>
                <p className="text-[11px] text-theme-2 uppercase tracking-wider">
                  Months
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="g-card p-4 flex flex-col items-center text-center gap-3 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-[var(--r-sm)] flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5">
                    {f.icon ? (
                      <Image
                        src={f.icon}
                        alt={f.iconAlt ?? f.title}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      f.emoji
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-theme-0 text-sm">
                      {f.title}
                    </p>
                    <p className="text-xs text-theme-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-right animate-up"
            style={{ animationDelay: "0.12s", animationFillMode: "both" }}
          >
            <p
              className="text-[10px] uppercase tracking-widest text-theme-2 mb-4"
              style={{ fontFamily: "var(--sans)" }}
            >
              Past events
            </p>
            <div className="pb-8">
              <EventCarousel isActive={cur === 1} />
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 — Team: full scroll */}
      <div
        className={`page ${cur !== 2 ? "inactive" : ""}`}
        id="team"
        role="tabpanel"
        aria-hidden={cur !== 2}
      >
        <div
          className="mx-auto max-w-6xl px-8 pt-16 pb-[100px]"
          style={{ minHeight: "100dvh" }}
        >
          <div className="mb-10">
            <p
              className="text-[11px] uppercase tracking-[0.12em] text-theme-2 mb-2"
              style={{ fontFamily: "var(--sans)" }}
            >
              Leadership
            </p>
            <h2
              className="text-4xl font-bold tracking-tight text-theme-0"
              style={{ fontFamily: "var(--sans)" }}
            >
              Meet the team.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="g-card p-5 flex flex-col items-center text-center animate-up"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="w-20 h-20 rounded-[var(--r-xl)] flex items-center justify-center overflow-hidden flex-shrink-0 mb-3 bg-theme-glass-2 border border-theme-1 border-solid ring-2 ring-[var(--glass-0)]">
                  {"imageFormat" in member && member.imageFormat === "heic" ? (
                    <EboardAvatarHeic src={member.image} name={member.name} />
                  ) : (
                    <Image
                      src={member.image}
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="font-semibold text-theme-0 text-sm">
                  {member.name}
                </p>
                <p className="text-xs text-theme-2 mb-2">{member.role}</p>
                <span className="text-[11px] px-2.5 py-1 rounded-[var(--r-md)] mb-3 text-theme-1 bg-theme-glass-2 border border-theme-1 border-solid">
                  {member.tag}
                </span>
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="flex items-center justify-center text-theme-1 transition-transform hover:scale-105"
                  >
                    <LinkedInIcon />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme toggle — top right */}
      <button
        type="button"
        className="theme-toggle fixed top-6 right-6 z-50"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Bottom nav */}
      <nav
        className="nav-pill"
        role="tablist"
        aria-label="Main"
        ref={navContainerRef}
      >
        <div
          className="nav-indicator"
          style={{
            left: navIndicator.left,
            width: navIndicator.width,
            opacity: navIndicator.width ? 1 : 0,
          }}
          aria-hidden
        />
        {PAGES.map((id, i) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={cur === i}
            aria-controls={id}
            id={`tab-${id}`}
            className={`nav-btn ${cur === i ? "active" : ""}`}
            onClick={() => go(i)}
            ref={(el) => {
              navButtonRefs.current[i] = el;
            }}
          >
            {id === "home" ? "Home" : id === "about" ? "About" : "Team"}
          </button>
        ))}
      </nav>
    </div>
  );
}
