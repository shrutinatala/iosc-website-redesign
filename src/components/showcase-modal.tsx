"use client";

import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGalleryTransition } from "@/components/gallery-transition";
import { cancelMediaFlight, captureGalleryOrigin, createMediaFlight, moveMediaFlight, placeMediaFlight, type MediaFlight, type GalleryOrigin } from "@/components/shared-media";

const OPEN_DURATION = 720;
const CLOSE_DURATION = 600;

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
      const restore = () => {
        if (source?.trigger.getAttribute("data-shared-origin") === marker) source.trigger.removeAttribute("data-shared-origin");
        if (source?.trigger.isConnected && !document.querySelector("dialog[open]")) source.trigger.focus({ preventScroll: true });
      };
      const flight = flightRef.current;
      const returning = !closing.current && source?.trigger.isConnected && source.snapshot && !reducedMotion && stage.dataset.mediaIndex === "0" && panel.scrollTop === 0;
      const returnFlight = returning ? flight ?? createMediaFlight(source) : null;
      if (returnFlight) {
        if (!flight) placeMediaFlight(returnFlight, mediaDestination(stage));
        cancelMediaFlight(returnFlight);
      } else if (flight) {
        cancelMediaFlight(flight);
        flight.frame.remove();
      }
      dialog.close();
      document.body.style.overflow = previousOverflow;
      flightRef.current = null;
      queueMicrotask(() => {
        // Effect replay is also a cleanup; only animate when the route has left.
        if (panel.isConnected) { returnFlight?.frame.remove(); return; }
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
    if (panel && dialog && stage && source?.trigger.isConnected && source.snapshot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // A scrolled-away cover fades out instead of jumping the panel to its top.
      const visible = stage.getBoundingClientRect().top >= panel.getBoundingClientRect().top - 1 && stage.dataset.mediaIndex === "0";
      if (visible) {
        let flight = flightRef.current;
        if (!flight) {
          flight = createMediaFlight(source);
          placeMediaFlight(flight, mediaDestination(stage));
          dialog.appendChild(flight.frame);
          flightRef.current = flight;
        }
        panel.dataset.phase = "closing";
        dialog.dataset.closing = "true";
        await moveMediaFlight(flight, galleryDestination(source), CLOSE_DURATION);
      } else {
        await panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 210, fill: "forwards" }).finished.catch(() => {});
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
