import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-shell";
import { GalleryTransitionProvider } from "@/components/gallery-transition";
import "./globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: "iOSC — USC's Apple Platforms development club",
  description:
    "iOSC is USC's Apple Platforms development club. Meet the team, see past events, and schedule a coffee chat.",
  icons: { icon: "/iosc-icon.png" },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <GalleryTransitionProvider>
          <SiteShell>{children}</SiteShell>
          {modal}
        </GalleryTransitionProvider>
      </body>
    </html>
  );
}
