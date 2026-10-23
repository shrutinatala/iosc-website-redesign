"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Person } from "@/data/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.6 8.1 11.2.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.4 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.7-1.6 8.1-6 8.1-11.2A11.5 11.5 0 0 0 12 .5Z" />
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

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span className="icon-btn opacity-35" aria-label={`${label} not linked`} title="Not linked yet">
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="icon-btn press"
      aria-label={label}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  );
}

function Portrait({ person }: { person: Person }) {
  const [failed, setFailed] = useState(false);
  if (!person.image || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-lg font-semibold">
        {initials(person.name)}
      </span>
    );
  }
  return (
    <Image
      src={person.image}
      alt=""
      width={80}
      height={80}
      sizes="80px"
      loading="lazy"
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function PersonGrid({ people }: { people: Person[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const open = people.find((person) => person.id === openId) ?? null;

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () => Array.from(sheetRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    controls()[0]?.focus({ preventScroll: true });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <button
            key={person.id}
            type="button"
            className="person-card surface press"
            onClick={() => setOpenId(person.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl"
                style={{ background: "var(--fill-strong)" }}
              >
                <Portrait person={person} />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-[16px] font-semibold">{person.name}</p>
                <p className="truncate text-[13px]" style={{ color: "var(--text-2)" }}>
                  {person.role}
                </p>
                {person.placeholder ? <span className="chip mt-2">Placeholder</span> : null}
              </div>
            </div>
            {person.apps.length > 0 ? (
              <span className="chip mt-4" title="Has at least one app">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <rect x="1" y="1" width="10" height="10" rx="2.5" fill="currentColor" />
                </svg>
                Apps
              </span>
            ) : null}
            <div className="mt-4 flex gap-2">
              <SocialLink href={person.github} label={`${person.name} on GitHub`}>
                <GithubIcon />
              </SocialLink>
              <SocialLink href={person.linkedin} label={`${person.name} on LinkedIn`}>
                <LinkedInIcon />
              </SocialLink>
            </div>
          </button>
        ))}
      </div>

      {open ? createPortal(
        <div className="sheet-backdrop" onClick={() => setOpenId(null)} role="presentation">
          <div
            ref={sheetRef}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="person-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full md:hidden" style={{ background: "var(--fill-strong)" }} />
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 overflow-hidden rounded-[22px]"
                style={{ background: "var(--fill-strong)" }}
              >
                <Portrait person={open} />
              </div>
              <div>
                <h3 id="person-sheet-title" className="text-[22px] font-semibold tracking-tight">
                  {open.name}
                </h3>
                <p style={{ color: "var(--text-2)" }}>{open.role}</p>
                {open.placeholder ? <span className="chip mt-2">Placeholder profile</span> : null}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <SocialLink href={open.github} label={`${open.name} on GitHub`}>
                <GithubIcon />
              </SocialLink>
              <SocialLink href={open.linkedin} label={`${open.name} on LinkedIn`}>
                <LinkedInIcon />
              </SocialLink>
            </div>
            <p className="mt-6 text-[13px] uppercase tracking-[0.12em]" style={{ color: "var(--text-3)" }}>
              Apps
            </p>
            {open.apps.length === 0 ? (
              <p className="mt-3 text-[15px]" style={{ color: "var(--text-2)" }}>
                No apps listed yet.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {open.apps.map((app) => (
                  <li key={app.name} className="rounded-2xl p-4" style={{ background: "var(--fill)" }}>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{app.name}</p>
                      {app.placeholder ? <span className="chip">Placeholder</span> : null}
                    </div>
                    <p className="mt-1 text-[15px]" style={{ color: "var(--text-2)" }}>
                      {app.summary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn-accent press mt-6" onClick={() => setOpenId(null)}>
              Done
            </button>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
