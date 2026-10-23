"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { GalleryOrigin } from "@/components/shared-media";

const GalleryTransitionContext = createContext<RefObject<GalleryOrigin | null> | null>(null);
const GalleryPreviewContext = createContext<{ previews: Record<string, number>; setPreview: (key: string, index: number) => void } | null>(null);

export function GalleryTransitionProvider({ children }: { children: ReactNode }) {
  const origin = useRef<GalleryOrigin | null>(null);
  // Intentionally lives only in React memory: refresh and new tabs start fresh.
  const [previews, setPreviews] = useState<Record<string, number>>({});
  const setPreview = useCallback((key: string, index: number) => {
    setPreviews((current) => current[key] === index ? current : { ...current, [key]: index });
  }, []);
  const value = useMemo(() => ({ previews, setPreview }), [previews, setPreview]);
  return <GalleryTransitionContext.Provider value={origin}><GalleryPreviewContext.Provider value={value}>{children}</GalleryPreviewContext.Provider></GalleryTransitionContext.Provider>;
}

export function useGalleryPreview() {
  const context = useContext(GalleryPreviewContext);
  if (!context) throw new Error("Gallery previews require GalleryTransitionProvider");
  return context;
}

export function useGalleryTransition() {
  const context = useContext(GalleryTransitionContext);
  if (!context) throw new Error("Gallery transitions require GalleryTransitionProvider");
  return context;
}
