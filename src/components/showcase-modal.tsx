"use client";

import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGalleryTransition } from "@/components/gallery-transition";
import { cancelMediaFlight, captureGalleryOrigin, createMediaFlight, moveMediaFlight, placeMediaFlight, type MediaFlight, type GalleryOrigin } from "@/components/shared-media";

const OPEN_DURATION = 720;
const CLOSE_DURATION = 600;
const FADE_DURATION = 400;

function fadePanel(panel: HTMLElement) {
  return panel.animate([{ opacity: getComputedStyle(panel).opacity }, { opacity: 0 }], { duration: FADE_DURATION, easing: "ease-out", fill: "forwards" }).finished.catch(() => {});
}

function captureDismissal(panel: HTMLElement, returning: boolean) {
  const bounds = panel.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "showcase-dismissal";
  layer.dataset.returning = String(returning);
  layer.setAttribute("aria-hidden", "true");
  layer.inert = true;
  Object.assign(layer.style, { left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
  const copy = panel.cloneNode(true) as HTMLElement;
  copy.dataset.phase = "open";
  layer.appendChild(copy);
  return { layer, copy, scrollTop: panel.scrollTop };
}

function mediaDestination(stage: HTMLElement) {
  const content = stage.closest(".detail-content");
  const radius = content ? getComputedStyle(content).borderTopLeftRadius : "14px";
  return { ...stage.getBoundingClientRect().toJSON(), fit: "contain" as const, radius: `${radius} ${radius} 0px 0px` };
}

function galleryDestination(source: GalleryOrigin) {
  return captureGalleryOrigin(source.trigger);
}

export function ShowcaseModal({ children, titleId }: { children: ReactNode; titleId: string }) {
  const router = useRouter();
  const origin = useGalleryTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const flightRef = useRef<MediaFlight | null>(null);
  const sourceRef = useRef<GalleryOrigin | null>(null);
  const markerRef = useRef("");

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    const stage = panel?.querySelector<HTMLElement>("[data-shared-media]");
    if (!dialog || !panel || !stage) return;
    let disposed = false;
    let handoffFrame = 0;
    closing.current = false;
    const candidate = origin.current;
    const source = candidate?.trigger.getAttribute("href")?.split("/").pop() === titleId.replace("detail-title-", "") ? candidate : null;
    sourceRef.current = source;
    const marker = `${titleId}-${performance.now()}`;
    markerRef.current = marker;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = Boolean(source?.trigger.isConnected && source.snapshot && !reducedMotion);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Hide the destination before showing/focusing the dialog. It must never
    // briefly paint the full image before the cropped moving copy is attached.
    panel.dataset.phase = animate ? "opening" : "open";
    dialog.removeAttribute("data-closing");
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>(".detail-close")?.focus({ preventScroll: true });

    const removeFlight = () => {
      cancelAnimationFrame(handoffFrame);
      if (flightRef.current) {
        cancelMediaFlight(flightRef.current);
        flightRef.current.frame.remove();
        flightRef.current = null;
      }
      panel.dataset.phase = "open";
    };
    window.addEventListener("resize", removeFlight);
    // Changing slides during the opening motion must retire the old photo copy.
    const observer = new MutationObserver(() => { if (!closing.current) removeFlight(); });
    observer.observe(stage, { attributes: true, attributeFilter: ["data-media-index"] });

    if (source && animate) {
      source.trigger.setAttribute("data-shared-origin", marker);
      const flight = createMediaFlight(source);
      flightRef.current = flight;
      dialog.appendChild(flight.frame);
      const image = stage.querySelector("img");
      const ready = image ? image.decode().catch(() => {}) : Promise.resolve();
      void Promise.all([moveMediaFlight(flight, mediaDestination(stage), OPEN_DURATION), ready]).then(([finished]) => {
        if (!finished || disposed || closing.current || flightRef.current !== flight) return;
        // Paint the decoded destination underneath the still-aligned copy
        // before removing it, rather than exposing an empty or stale frame.
        panel.dataset.phase = "open";
        handoffFrame = requestAnimationFrame(() => {
          handoffFrame = requestAnimationFrame(() => {
            if (!disposed && !closing.current && flightRef.current === flight) removeFlight();
          });
        });
      });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(handoffFrame);
      window.removeEventListener("resize", removeFlight);
      observer.disconnect();
      const restore = () => {
        if (source?.trigger.getAttribute("data-shared-origin") === marker) source.trigger.removeAttribute("data-shared-origin");
        if (source?.trigger.isConnected && !document.querySelector("dialog[open]")) source.trigger.focus({ preventScroll: true });
      };
      const flight = flightRef.current;
      const returningSource = !closing.current && source?.trigger.isConnected && !reducedMotion && stage.getBoundingClientRect().top >= panel.getBoundingClientRect().top - 1
        ? { ...source, snapshot: captureGalleryOrigin(stage).snapshot }
        : null;
      const reuseFlight = source?.mediaIndex === Number(stage.dataset.mediaIndex) ? flight : null;
      const returnFlight = returningSource?.snapshot ? reuseFlight ?? createMediaFlight(returningSource) : null;
      // Browser Back removes the route immediately. Keep a visual copy of the
      // panel so it can fade over the revealed page alongside the returning photo.
      const dismissal = !closing.current && !reducedMotion ? captureDismissal(panel, Boolean(returnFlight)) : null;
      if (returnFlight) {
        source?.trigger.setAttribute("data-shared-origin", marker);
        if (returnFlight !== flight) placeMediaFlight(returnFlight, mediaDestination(stage));
        cancelMediaFlight(returnFlight);
      }
      if (flight && flight !== returnFlight) {
        cancelMediaFlight(flight);
        flight.frame.remove();
      }
      dialog.close();
      document.body.style.overflow = previousOverflow;
      flightRef.current = null;
      queueMicrotask(() => {
        // Effect replay is also a cleanup; only animate when the route has left.
        if (panel.isConnected) { returnFlight?.frame.remove(); return; }
        if (dismissal) {
          document.body.appendChild(dismissal.layer);
          dismissal.copy.scrollTop = dismissal.scrollTop;
          void fadePanel(dismissal.layer).finally(() => dismissal.layer.remove());
        }
        if (returnFlight && source) {
          document.body.appendChild(returnFlight.frame);
          void moveMediaFlight(returnFlight, galleryDestination(source), CLOSE_DURATION).finally(() => {
            cancelMediaFlight(returnFlight);
            returnFlight.frame.remove();
            restore();
          });
        } else restore();
      });
    };
  }, [origin, titleId]);

  const close = useCallback(async () => {
    if (closing.current) return;
    closing.current = true;
    const panel = panelRef.current;
    const dialog = dialogRef.current;
    const stage = panel?.querySelector<HTMLElement>("[data-shared-media]");
    const source = sourceRef.current;
    if (panel && dialog && stage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.dataset.closing = "true";
      // Capture the displayed slide, which may now differ from the opening cover.
      const returningSource = source?.trigger.isConnected ? { ...source, snapshot: captureGalleryOrigin(stage).snapshot } : null;
      const visible = returningSource?.snapshot && stage.getBoundingClientRect().top >= panel.getBoundingClientRect().top - 1;
      if (visible) {
        source?.trigger.setAttribute("data-shared-origin", markerRef.current);
        let flight = flightRef.current;
        if (flight && source?.mediaIndex !== Number(stage.dataset.mediaIndex)) {
          cancelMediaFlight(flight);
          flight.frame.remove();
          flight = null;
        }
        if (!flight) {
          flight = createMediaFlight(returningSource);
          placeMediaFlight(flight, mediaDestination(stage));
          dialog.appendChild(flight.frame);
          flightRef.current = flight;
        }
        panel.dataset.phase = "closing";
        await Promise.all([fadePanel(panel), moveMediaFlight(flight, galleryDestination(returningSource), CLOSE_DURATION)]);
      } else {
        if (flightRef.current) {
          cancelMediaFlight(flightRef.current);
          flightRef.current.frame.remove();
          flightRef.current = null;
        }
        panel.dataset.phase = "open";
        await fadePanel(panel);
      }
    }
    router.back();
  }, [router]);

  return (
    <dialog ref={dialogRef} className="showcase-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); void close(); }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }}>
      <button className="detail-close" type="button" aria-label="Close detail view" onClick={() => void close()} autoFocus>×</button>
      <div ref={panelRef} className="showcase-dialog-panel" data-phase="opening">
        {children}
      </div>
    </dialog>
  );
}
