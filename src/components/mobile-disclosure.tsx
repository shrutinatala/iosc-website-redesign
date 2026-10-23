"use client";

import { useState, type ReactNode } from "react";

export function MobileDisclosure({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-disclosure" data-open={open}>
      <button className="mobile-disclosure-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4m8-4v4M4 11h16" /></svg>
        {open ? "Hide calendar" : label}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} className="mobile-disclosure-content">{children}</div>
    </div>
  );
}

export function HomeSection({ id, title, detail, defaultOpen = false, children }: { id: string; title: string; detail: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="home-section" aria-labelledby={`${id}-heading`} data-open={open}>
      <h2 id={`${id}-heading`} className="section-heading">
        <span className="desktop-section-title">{title}</span>
        <button className="mobile-section-toggle" type="button" aria-expanded={open} aria-controls={`${id}-content`} onClick={() => setOpen(!open)}>
          <span><span className="mobile-section-title">{title}</span><span className="mobile-section-detail">{detail}</span></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </h2>
      <div id={`${id}-content`} className="home-section-content">{children}</div>
    </section>
  );
}
