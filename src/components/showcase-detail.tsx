"use client";

import { useState } from "react";
import Image from "next/image";
import type { DetailMedia, ShowcaseItem } from "@/data/home";

function Media({ media }: { media: DetailMedia }) {
  if (media.type === "placeholder") return <div className="detail-placeholder"><span>{media.label}</span><small>Coming soon</small></div>;
  if (media.type === "video") return <video src={media.src} controls playsInline preload="metadata" aria-label={media.label} />;
  return <Image src={media.src} alt={media.label} fill sizes="(max-width: 640px) 94vw, (max-width: 1064px) 94vw, 1000px" loading="eager" />;
}

export function ShowcaseDetail({ item, kind }: { item: ShowcaseItem; kind: "apps" | "events" }) {
  const [selected, setSelected] = useState(0);
  const media = item.gallery[selected];
  return (
    <article className={`detail-content${kind === "apps" ? " detail-content-apps" : ""}`}>
      <div className="detail-media-stage" data-shared-media data-media-index={selected} aria-live="polite" aria-atomic="true">
        <Media key={selected} media={media} />
      </div>
      <div className="detail-body">
        <p className="detail-eyebrow">{kind === "apps" ? "Featured app" : "Past event"}{item.detail ? ` · ${item.detail}` : ""}</p>
        {item.demo ? <p className="demo-label">Fictional app concept · {item.screenshotCredit ? "Stock screenshots" : "Sample data"}</p> : null}
        <h1 id={`detail-title-${item.id}`}>{item.title}</h1>
        <p className="detail-summary">{item.description}</p>
        <div className="detail-thumbnails" role="group" aria-label={kind === "apps" ? "App screenshots" : "Event photos and videos"}>
          {item.gallery.map((image, index) => (
            <button key={index} type="button" className="detail-thumbnail" aria-label={`Show ${image.label}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
              {image.type === "image" ? <Image src={image.src} alt="" fill sizes="116px" /> : image.type === "video" ? <><video src={`${image.src}#t=0.1`} muted playsInline preload="metadata" aria-hidden="true" /><span className="thumbnail-play" aria-hidden="true">▶</span></> : <span>{image.label}</span>}
            </button>
          ))}
        </div>
        <p className="detail-media-caption">{media.caption ?? media.label}</p>
        {item.screenshotCredit ? <p className="screenshot-credit">Screenshots: <a href={item.screenshotCredit.url} target="_blank" rel="noopener noreferrer">{item.screenshotCredit.label}</a></p> : null}
        <dl className="detail-facts">{item.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="detail-sections">{item.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div>
      </div>
    </article>
  );
}
