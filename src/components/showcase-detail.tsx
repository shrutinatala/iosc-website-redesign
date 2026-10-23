"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import type { DetailMedia, ShowcaseItem } from "@/data/home";
import { SHOWCASE_IMAGE_SIZES } from "@/components/shared-media";
import { useGalleryPreview } from "@/components/gallery-transition";

function Media({ media }: { media: DetailMedia }) {
  if (media.type === "placeholder") return <div className="detail-placeholder"><span>{media.label}</span><small>Coming soon</small></div>;
  if (media.type === "video") return <video src={media.src} controls playsInline preload="metadata" aria-label={media.label} />;
  return <Image src={media.src} alt={media.label} fill sizes={SHOWCASE_IMAGE_SIZES} loading="eager" />;
}

export function ShowcaseDetail({ item, kind }: { item: ShowcaseItem; kind: "apps" | "events" }) {
  const { previews, setPreview } = useGalleryPreview();
  const previewKey = `${kind}/${item.id}`;
  const [selected, setSelected] = useState(() => previews[previewKey] ?? 0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const media = item.gallery[selected];
  const count = item.gallery.length;
  const showSlide = (index: number, movement: number) => {
    const next = (index + count) % count;
    if (next === selected) return;
    setDirection(movement);
    setSelected(next);
    setPreview(previewKey, next);
  };

  useEffect(() => {
    // Decode the neighboring photos before the user advances the carousel.
    const neighbors = [item.gallery[(selected + 1) % count], item.gallery[(selected + count - 1) % count]];
    for (const neighbor of neighbors) {
      if (neighbor.type !== "image") continue;
      const { props } = getImageProps({ src: neighbor.src, alt: "", fill: true, sizes: SHOWCASE_IMAGE_SIZES });
      const image = new window.Image();
      image.sizes = props.sizes ?? "";
      image.srcset = props.srcSet ?? "";
      image.src = props.src;
      void image.decode().catch(() => {});
    }
  }, [selected, count, item.gallery]);

  return (
    <article className={`detail-content${kind === "apps" ? " detail-content-apps" : ""}`}>
      <div className="detail-carousel" role="region" aria-roledescription="carousel" aria-label={`${item.title} gallery`} tabIndex={0}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLVideoElement || event.altKey || event.ctrlKey || event.metaKey) return;
          const next = event.key === "ArrowRight" ? selected + 1 : event.key === "ArrowLeft" ? selected - 1 : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
          if (next === null) return;
          event.preventDefault();
          showSlide(next, event.key === "ArrowLeft" || event.key === "Home" ? -1 : 1);
        }}>
        <div className="detail-media-stage" data-shared-media data-media-index={selected}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("button, video")) return;
            touchStart.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerCancel={() => { touchStart.current = null; }}
          onPointerUp={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) showSlide(selected + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
          }}>
          <div key={selected} className={`detail-slide${direction ? " is-changing" : ""}`} role="group" aria-roledescription="slide" aria-label={`${selected + 1} of ${count}: ${media.label}`} style={{ "--slide-direction": direction } as CSSProperties}>
            <Media media={media} />
          </div>
          {count > 1 ? <>
            <button type="button" className="carousel-arrow carousel-previous" aria-label="Previous photo" onClick={() => showSlide(selected - 1, -1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
            <button type="button" className="carousel-arrow carousel-next" aria-label="Next photo" onClick={() => showSlide(selected + 1, 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
          </> : null}
        </div>
        <div className="detail-gallery-toolbar">
          <div className="detail-gallery-caption" aria-live="polite" aria-atomic="true">
            <span className="carousel-count">{String(selected + 1).padStart(2, "0")} <span>/ {String(count).padStart(2, "0")}</span></span>
            <p>{media.stock ? <span className="stock-photo-label">Stock photo · </span> : null}{media.caption ?? media.label}{media.credit ? <> · <a href={media.credit.url} target="_blank" rel="noopener noreferrer">{media.credit.label}</a></> : null}</p>
          </div>
          <div className="detail-thumbnails" role="group" aria-label={kind === "apps" ? "App screenshots" : "Event photos and videos"}>
            {item.gallery.map((image, index) => (
              <button key={index} type="button" className="detail-thumbnail" aria-label={`Show ${image.label}`} aria-pressed={selected === index} onClick={() => showSlide(index, index > selected ? 1 : -1)}>
                {image.type === "image" ? <Image src={image.src} alt="" fill sizes="80px" /> : image.type === "video" ? <><video src={`${image.src}#t=0.1`} muted playsInline preload="metadata" aria-hidden="true" /><span className="thumbnail-play" aria-hidden="true">▶</span></> : <span>{image.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="detail-body">
        <p className="detail-eyebrow">{kind === "apps" ? "Featured app" : "Past event"}{item.detail ? ` · ${item.detail}` : ""}</p>
        {item.demo ? <p className="demo-label">Fictional app concept · {item.screenshotCredit ? "Stock screenshots" : "Sample data"}</p> : null}
        <h1 id={`detail-title-${item.id}`}>{item.title}</h1>
        <p className="detail-summary">{item.description}</p>
        {item.screenshotCredit ? <p className="screenshot-credit">Screenshots: <a href={item.screenshotCredit.url} target="_blank" rel="noopener noreferrer">{item.screenshotCredit.label}</a></p> : null}
        <details className="detail-info">
          <summary>{kind === "apps" ? "About this app" : "About this event"}</summary>
          <dl className="detail-facts">{item.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          <div className="detail-sections">{item.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div>
        </details>
      </div>
    </article>
  );
}
