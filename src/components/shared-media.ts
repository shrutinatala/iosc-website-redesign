"use client";

export type MediaRect = { x: number; y: number; width: number; height: number };
export type GalleryOrigin = MediaRect & {
  trigger: HTMLElement;
  radius: string;
  fit: "cover" | "contain";
  zoom: number;
  snapshot: { element: HTMLElement; width: number; height: number } | null;
};

export function captureGalleryOrigin(trigger: HTMLElement): GalleryOrigin {
  // Phone captions and bezels stay outside the image's transition geometry.
  const surface = trigger.querySelector<HTMLElement>("[data-gallery-media]") ?? trigger;
  const rect = surface.getBoundingClientRect();
  const media = trigger.querySelector("img, video");
  let snapshot: GalleryOrigin["snapshot"] = null;
  if (media instanceof HTMLImageElement && media.complete && media.naturalWidth) {
    // Capture decoded pixels so the moving copy cannot flash while an img clone
    // loads or decodes independently of the visible gallery image.
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1600 / Math.max(media.naturalWidth, media.naturalHeight));
    canvas.width = Math.round(media.naturalWidth * scale);
    canvas.height = Math.round(media.naturalHeight * scale);
    canvas.getContext("2d")?.drawImage(media, 0, 0, canvas.width, canvas.height);
    snapshot = { element: canvas, width: canvas.width, height: canvas.height };
  } else if (media instanceof HTMLVideoElement && media.videoWidth && media.readyState >= 2) {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1200 / media.videoWidth);
    canvas.width = Math.round(media.videoWidth * scale);
    canvas.height = Math.round(media.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(media, 0, 0, canvas.width, canvas.height);
    snapshot = { element: canvas, width: canvas.width, height: canvas.height };
    media.pause();
  }
  const style = getComputedStyle(surface);
  const transform = media ? getComputedStyle(media).transform : "none";
  const zoom = transform === "none" ? 1 : new DOMMatrix(transform).a;
  const fit = media && getComputedStyle(media).objectFit === "contain" ? "contain" : "cover";
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, trigger, snapshot, zoom, radius: style.borderRadius, fit };
}

export type MediaFlight = {
  frame: HTMLDivElement;
  visual: HTMLElement | null;
  naturalWidth: number;
  naturalHeight: number;
  animations: Animation[];
};

type Destination = MediaRect & { fit: "cover" | "contain"; zoom?: number; radius: string };

function geometry(flight: MediaFlight, target: Destination) {
  const scale = (target.fit === "cover" ? Math.max : Math.min)(target.width / flight.naturalWidth, target.height / flight.naturalHeight) * (target.zoom ?? 1);
  const x = target.x + (target.width - flight.naturalWidth * scale) / 2;
  const y = target.y + (target.height - flight.naturalHeight * scale) / 2;
  // Uncrop all the way to the image's bounds, not to the wider letterboxed
  // stage. This keeps revealing/retracting the crop for the entire movement.
  const crop = target.fit === "contain"
    ? { x, y, width: flight.naturalWidth * scale, height: flight.naturalHeight * scale }
    : target;
  return {
    clipPath: `inset(${crop.y}px ${window.innerWidth - crop.x - crop.width}px ${window.innerHeight - crop.y - crop.height}px ${crop.x}px round ${target.radius})`,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
  };
}

export function createMediaFlight(origin: GalleryOrigin): MediaFlight {
  const frame = document.createElement("div");
  frame.className = "shared-media-flight";
  // Fixed inset positioning excludes the scrollbar gutter; crop coordinates use
  // innerWidth/innerHeight, so give the overlay that same coordinate space.
  Object.assign(frame.style, { width: `${window.innerWidth}px`, height: `${window.innerHeight}px` });
  frame.setAttribute("aria-hidden", "true");
  let visual: HTMLElement | undefined;
  if (origin.snapshot?.element instanceof HTMLCanvasElement) {
    const canvas = document.createElement("canvas");
    canvas.width = origin.snapshot.width;
    canvas.height = origin.snapshot.height;
    canvas.getContext("2d")?.drawImage(origin.snapshot.element, 0, 0);
    visual = canvas;
  } else {
    visual = origin.snapshot?.element.cloneNode(true) as HTMLElement | undefined;
  }
  const flight: MediaFlight = { frame, visual: visual ?? null, naturalWidth: origin.snapshot?.width ?? origin.width, naturalHeight: origin.snapshot?.height ?? origin.height, animations: [] };
  if (visual) {
    visual.className = "shared-media-visual";
    Object.assign(visual.style, { width: `${flight.naturalWidth}px`, height: `${flight.naturalHeight}px` });
    frame.appendChild(visual);
  }
  placeMediaFlight(flight, origin);
  return flight;
}

export function placeMediaFlight(flight: MediaFlight, target: Destination) {
  const box = geometry(flight, target);
  flight.frame.style.clipPath = box.clipPath;
  if (flight.visual) flight.visual.style.transform = box.transform;
}

export function cancelMediaFlight(flight: MediaFlight) {
  // Freeze interrupted motion so close/back reverses from the displayed position.
  if (flight.animations.length && flight.frame.isConnected) {
    const style = getComputedStyle(flight.frame);
    flight.frame.style.clipPath = style.clipPath;
    if (flight.visual) flight.visual.style.transform = getComputedStyle(flight.visual).transform;
  }
  flight.animations.forEach((animation) => animation.cancel());
  flight.animations = [];
}

export async function moveMediaFlight(flight: MediaFlight, target: Destination, duration: number) {
  cancelMediaFlight(flight);
  const box = geometry(flight, target);
  const options: KeyframeAnimationOptions = { duration, easing: "cubic-bezier(.2, .8, .2, 1)", fill: "both" };
  const animations = [flight.frame.animate([
    { clipPath: flight.frame.style.clipPath },
    { clipPath: box.clipPath },
  ], options)];
  if (flight.visual) animations.push(flight.visual.animate([
    { transform: flight.visual.style.transform }, { transform: box.transform },
  ], options));
  flight.animations = animations;
  // Use one clock for the crop and image, including their very first frame.
  const startTime = document.timeline.currentTime;
  if (typeof startTime === "number") animations.forEach((animation) => { animation.startTime = startTime; });
  // Only the image travels; the stage's side bars appear after it lands.
  // Fixed image dimensions: animate only the transform and crop, without layout.
  return Promise.all(animations.map((animation) => animation.finished)).then(() => {
    if (flight.animations !== animations) return false;
    // Persist the destination before releasing animation styles, preventing a
    // one-frame return to the original crop during the handoff or reversal.
    placeMediaFlight(flight, target);
    animations.forEach((animation) => animation.cancel());
    flight.animations = [];
    return true;
  }, () => false);
}
