"use client";

import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import type { GalleryOrigin } from "@/components/shared-media";

const GalleryTransitionContext = createContext<RefObject<GalleryOrigin | null> | null>(null);

export function GalleryTransitionProvider({ children }: { children: ReactNode }) {
  const origin = useRef<GalleryOrigin | null>(null);
  return <GalleryTransitionContext.Provider value={origin}>{children}</GalleryTransitionContext.Provider>;
}

export function useGalleryTransition() {
  const context = useContext(GalleryTransitionContext);
  if (!context) throw new Error("Gallery transitions require GalleryTransitionProvider");
  return context;
}
