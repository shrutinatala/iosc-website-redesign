"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { pastEvents, type ShowcaseItem } from "@/data/home";
import { useGalleryPreview, useGalleryTransition } from "@/components/gallery-transition";
import { captureGalleryOrigin, SHOWCASE_IMAGE_SIZES } from "@/components/shared-media";

export function EventGallery({ items = pastEvents, kind = "events" }: { items?: ShowcaseItem[]; kind?: "apps" | "events" }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const origin = useGalleryTransition();
  const { previews } = useGalleryPreview();
  return (
    <div className={`showcase showcase-${kind}`} onMouseLeave={() => setOpenId(null)}>
      {items.map((item) => {
        const open = item.id === openId;
        const index = previews[`${kind}/${item.id}`];
        const preview = index === undefined ? item.media : item.gallery[index];
        const media = preview?.type === "image"
          ? <Image src={preview.src} alt="" fill sizes={SHOWCASE_IMAGE_SIZES} />
          : preview?.type === "video"
            ? <video src={`${preview.src}#t=0.1`} muted loop playsInline preload="metadata" aria-label={item.title} onPointerEnter={(event) => { if (event.pointerType === "mouse" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void event.currentTarget.play().catch(() => {}); }} onPointerLeave={(event) => event.currentTarget.pause()} />
            : null;
        return (
          <Link key={item.id} href={`/${kind}/${item.id}`} scroll={false} prefetch={true}
            data-gallery-index={index ?? 0}
            className={`showcase-card${open ? " is-expanded" : ""}${preview ? " has-media" : ""}`}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpenId(item.id); }}
            onPointerLeave={() => setOpenId(null)}
            onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setOpenId(item.id); }}
            onBlur={() => setOpenId(null)}
            onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              origin.current = captureGalleryOrigin(event.currentTarget);
            }}
            onKeyDown={(event) => { if (event.key === "Escape") setOpenId(null); }}
            aria-label={`Open ${item.title}`}>
            {kind === "apps" ? <span className="app-device"><span className="app-screen" data-gallery-media>{media}</span></span> : <span className="event-cover" data-gallery-media>{media}</span>}
            <span id={`showcase-${item.id}`} className="showcase-caption">
              <span className="showcase-title">{item.title}</span>
              {item.detail ? <span className="showcase-detail">{item.detail}</span> : null}
              <span className="showcase-description">{item.description}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
