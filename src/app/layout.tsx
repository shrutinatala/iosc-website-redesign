import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "iOSC — USC's Apple Platforms development club",
  description:
    "iOSC is USC's Apple Platforms development club. Meet the team, see past events, and schedule a coffee chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("iosc-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);return;}document.documentElement.setAttribute("data-theme",window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");})();`,
          }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
