# iOSC website

A responsive Next.js website for USC's Apple Platforms development club.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run build` for a production build and `npm start` to serve it.

## Update content

- `src/data/home.ts`: featured apps, event detail galleries, and the homepage calendar. Replace placeholder media with `{ type: "image", src: "/apps/your-app/screenshot.png", label: "Screenshot description" }`. Video entries use `type: "video"`. Each item has its own facts, text sections, and image gallery.
- `src/data/site.ts`: team profiles, past event covers, existing public events, social links, and recruiting settings.
- Put images and videos in `public/` and use paths beginning with `/`.
- Set `rsvpUrl` on homepage events when registration is ready. The RSVP button is disabled while it is empty.
- Set `image` on each homepage event for its full-card featured photo. The current images are samples; selecting an event in the calendar updates the photo and overlaid details together.
- The five featured app names and creators are fictional demo content, labeled in the UI. Their borderless portrait previews use English-language interfaces from Pinto Notes, Kith, and iOSAppTemplates, with different screens for planning, notes, community, music, and travel. Images, per-source credits, and original licenses live in `public/apps/stock/` and `public/apps/stock/diverse/`; credits also appear in each app's detail view. Earlier concept SVG artwork remains in `public/apps/app-*/` and can be regenerated with `node scripts/generate-demo-apps.mjs`. Event galleries include clearly labeled Unsplash stock photos, with photographer credits and source URLs in public/events/stock/credits.json. Existing social and Calendly URLs are also stand-ins and should be confirmed before launch.

## Galleries

Cards keep a stable grid position, with titles visible on touch and desktop. App previews use modern 402:874 iPhone proportions, rounded corners, and captions below the screen, without an added black bezel or notch. Hovering gently expands the whole preview without zooming or cropping the screenshot. Click or tap to move the image from its gallery crop into the detail view in 720ms, with the details immediately available. Close with Escape, the close button, or the backdrop to return the cover in 600ms. Cards and the viewer request the same image resolution, and transition snapshots retain enough backing pixels for high-DPI displays to keep expansion sharp. Browser Back returns it too. Only the image travels: gray side bars fade in over 240ms only after it lands and remain hidden while closing. Captions stay outside the transition geometry. A scrolled panel or a different selected screenshot closes without jumping back to the cover. The opened viewer gives most of its space to the image, with previous/next arrows, a photo counter, compact thumbnails, keyboard navigation (Left/Right, Home/End), and touch swipes. Navigation wraps at both ends, and neighboring photos preload. Longer event and app details sit in an expandable About section below the carousel.

Event and app URLs (`/events/[slug]` and `/apps/[slug]`) are shareable. Loading or refreshing one opens the full detail page. Client-side navigation from the site opens the same content over the current page, preserving its scroll position.

The layout adapts to mobile and tablet screens and respects reduced-motion preferences. Images use Next.js responsive sizing and lazy loading; gallery routes prefetch for faster opening. The viewer animates image transforms and clipping instead of changing layout dimensions on every frame. The interface uses five saturated colors sampled from the iMac reference: blueberry blue, aqua, orange, pink, and green. Shared colors and translucent plastic highlights are defined in `src/app/globals.css`. The navigation, buttons, hero, calendar, and app artwork use transparent tints, glossy reflections, and bright edges. One oval slides between navigation links in 460ms and changes to the selected page's accent color; page content fades and rises in 340ms. Back/Forward and viewport changes keep the oval aligned. Reduced-motion preferences disable both effects.
