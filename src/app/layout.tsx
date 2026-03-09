import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iOSC — iOS Development Club",
  description: "iOSC — iOS Development Club. Est. 2020. We build for Apple's world.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
