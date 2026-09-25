"use client";

import { useEffect, useRef, useState } from "react";
import { galleryEvents, type GalleryEvent } from "@/data/site";

function drift(index: number) {
  const n = Math.sin(index * 12.9898) * 43758.5453;
  const unit = n - Math.floor(n);
  const n2 = Math.sin(index * 78.233) * 12345.678;
  const unit2 = n2 - Math.floor(n2);
  return {
    rot: (unit - 0.5) * 8,
    x: (unit2 - 0.5) * 18,
    y: (unit - 0.5) * 14,
    depth: 16 + unit * 10,
    delay: `${index * 0.35}s`,
  };
}

function Media({ event }: { event: GalleryEvent }) {
  if (event.media.type === "video") {
    return (
      <video src={event.media.src} muted loop playsInline autoPlay aria-label={event.title} />
    );
  }
  return <img src={event.media.src} alt="" />;
}

export function EventGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    function onMove(event: MouseEvent) {
      const px = (event.clientX / window.innerWidth - 0.5) * 2;
      const py = (event.clientY / window.innerHeight - 0.5) * 2;
      grid?.style.setProperty("--px", px.toFixed(3));
      grid?.style.setProperty("--py", py.toFixed(3));
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={gridRef} className="float-grid" onMouseLeave={() => setOpenId(null)}>
      {galleryEvents.map((item, index) => {
        const motion = drift(index);
        const open = openId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`float-card${open ? " is-open" : ""}`}
            style={{
              ["--rot" as string]: `${motion.rot}deg`,
              ["--dx" as string]: `${motion.x}px`,
              ["--dy" as string]: `${motion.y}px`,
              ["--depth" as string]: `${motion.depth}px`,
              ["--delay" as string]: motion.delay,
            }}
            onMouseEnter={() => setOpenId(item.id)}
            onFocus={() => setOpenId(item.id)}
            onClick={() => setOpenId(item.id)}
            aria-expanded={open}
            aria-label={item.title}
          >
            <span className="float-card-inner">
              <Media event={item} />
              <span className="float-caption">
                <span className="block text-[12px] uppercase tracking-[0.08em] opacity-80">{item.date}</span>
                <span className="mt-0.5 block text-[16px] font-semibold leading-tight">{item.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug opacity-90">{item.caption}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
