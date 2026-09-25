"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

const THEME_KEY = "iosc-theme";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/people", label: "People" },
  { href: "/join", label: "Join" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.7 10.3 22.4 1.5h-1.8l-6.7 7.6L8.4 1.5H2l8.1 11.5L2 22.5h1.8l7.1-8.1 5.7 8.1H22l-7.3-12.2Zm-2.5 2.9-.8-1.2L4.5 2.9h2.8l5.3 7.6.8 1.2 6.9 9.8h-2.8l-5.3-7.3Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0h.01Z" />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="iOSC home" className="flex items-center">
      <img src="/iosc-logo.png" alt="" className="logo-mark logo-for-dark" />
      <img src="/iosc-logo-light.png" alt="" className="logo-mark logo-for-light" />
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    function onMove(event: MouseEvent) {
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--mx", px.toFixed(3));
      root.style.setProperty("--my", py.toFixed(3));
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  }

  const scheduleLabel =
    siteConfig.recruitingMode === "applications-soon" ? "Opening soon" : "Schedule";

  return (
    <>
      <div className="grain" aria-hidden />
      <header className="topbar">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 md:px-8">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive(pathname, link.href)}
                className="nav-link press"
              >
                {link.label === "Join" ? "Join Us" : link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/join" className="btn-accent press">
              {scheduleLabel}
            </Link>
            <button
              type="button"
              className="icon-btn press"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <div className="site-main">
        <div key={pathname} className="page-enter">
          {children}
        </div>
        <footer className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-6 pt-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            iOSC · {siteConfig.tagline}
          </p>
          <div className="flex items-center gap-2">
            <a className="icon-btn press" href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (placeholder)">
              <InstagramIcon />
            </a>
            <a className="icon-btn press" href={siteConfig.socials.x} target="_blank" rel="noopener noreferrer" aria-label="X (placeholder)">
              <XIcon />
            </a>
            <a className="icon-btn press" href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (placeholder)">
              <LinkedInIcon />
            </a>
          </div>
        </footer>
      </div>

      <nav className="tabbar" aria-label="Mobile">
        {LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={active}
              className="nav-link press flex flex-1 flex-col items-center justify-center text-[13px]"
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
