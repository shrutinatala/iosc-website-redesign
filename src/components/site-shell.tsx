"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { siteConfig } from "@/data/site";

const LINKS = [
  { href: "/", label: "Home", color: "var(--accent)", text: "#fff" },
  { href: "/people", label: "Team", color: "var(--aqua)", text: "#082738" },
  { href: "/about", label: "About", color: "var(--green)", text: "#102e0c" },
  { href: "/join", label: "Join Us", color: "var(--orange)", text: "#421907" },
];

function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return <Link href="/" aria-label="iOSC home" className="brand" onNavigate={onNavigate}><Image src="/iosc-logo-light.png" alt="iOSC" width={743} height={330} sizes="138px" /></Link>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const activeHref = LINKS.find((link) => link.href === `/${segment ?? ""}`)?.href ?? "/";
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const mobile = window.matchMedia("(max-width: 640px)");
    const closeOnResize = () => { if (!mobile.matches) setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    mobile.addEventListener("change", closeOnResize);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      mobile.removeEventListener("change", closeOnResize);
    };
  }, [menuOpen]);

  const selectLink = useCallback((link: HTMLAnchorElement) => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    Object.assign(indicator.style, {
      width: `${link.getBoundingClientRect().width}px`,
      height: `${link.offsetHeight}px`,
      transform: `translate3d(${link.offsetLeft}px, ${link.offsetTop}px, 0)`,
      backgroundColor: link.dataset.color,
    });
    nav.querySelectorAll<HTMLElement>(".nav-link").forEach((item) => {
      item.toggleAttribute("data-selected", item === link);
      item.style.setProperty("--selected-text", link.dataset.text ?? "#fff");
    });
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const align = () => {
      const link = nav.querySelector<HTMLAnchorElement>(`a[href="${activeHref}"]`);
      if (link) selectLink(link);
    };
    align();
    const frame = requestAnimationFrame(() => { nav.dataset.ready = "true"; });
    const observer = new ResizeObserver(align);
    observer.observe(nav);
    nav.querySelectorAll("a").forEach((link) => observer.observe(link));
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [activeHref, selectLink]);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header ref={headerRef} className="topbar">
        <Logo onNavigate={() => setMenuOpen(false)} />
        <button ref={menuButtonRef} className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
        <nav ref={navRef} className="desktop-navigation" aria-label="Primary navigation">
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={activeHref === link.href ? "page" : undefined} className={`nav-link${link.href === "/join" ? " nav-cta" : ""}`} data-color={link.color} data-text={link.text}
              onNavigate={() => {
                const target = navRef.current?.querySelector<HTMLAnchorElement>(`a[href="${link.href}"]`);
                if (target) selectLink(target);
              }}>
              {link.label}
              {link.href === "/join" ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11" /></svg> : null}
            </Link>
          ))}
        </nav>
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen}>
          <p>Explore iOSC</p>
          {LINKS.map((link) => <Link key={link.href} href={link.href} aria-current={activeHref === link.href ? "page" : undefined} style={{ "--mobile-link-color": link.color, "--mobile-link-text": link.text } as CSSProperties} onNavigate={() => setMenuOpen(false)}>
            {link.label}<span aria-hidden="true">↗</span>
          </Link>)}
        </nav>
      </header>
      <div className="site-main"><div key={activeHref} className="page-transition">{children}</div></div>
      <footer className="site-footer">
        <Logo />
        <div className="social-links">
          <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="iOSC on Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          </a>
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="iOSC on LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M6 10h3v8H6zm1.5-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M11 10h2.8v1.1c.5-.8 1.2-1.3 2.4-1.3 2.3 0 2.8 1.5 2.8 3.5V18h-3v-4.2c0-1-.1-1.8-1.1-1.8s-1.1.8-1.1 1.8V18H11z" fill="white" /></svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
