import { clubEvents, galleryEvents, type GalleryMedia } from "./site";

export type DetailMedia = (
  | { type: "image" | "video"; src: string; label: string; caption?: string }
  | { type: "placeholder"; label: string; caption?: string }
) & { stock?: boolean; credit?: { label: string; url: string } };

export type ShowcaseItem = {
  id: string;
  title: string;
  detail?: string;
  description: string;
  media?: GalleryMedia;
  demo?: boolean;
  screenshotCredit?: { label: string; url: string };
  gallery: DetailMedia[];
  facts: { label: string; value: string }[];
  sections: { heading: string; body: string }[];
};

// Fictional concepts, creators, and screenshots for previewing the showcase.
const appConcepts = [
  { name: "Northstar", category: "Focus & planning", creator: "Alex Rivera", platform: "iPhone · Apple Watch", summary: "Make room for what matters. A quieter daily planner that turns big goals into small, doable steps.", screens: ["Your day, at a glance", "A little focus goes a long way"], features: "Plan three priorities, start a focus session, and check in from your wrist. Gentle reminders help you build a rhythm without another crowded to-do list.", story: "Alex imagined a calmer way to balance class projects and personal goals. This fictional prototype explores SwiftUI, local notifications, and a companion watch experience." },
  { name: "Desk Note", category: "Notes & ideas", creator: "Alex Rivera", platform: "iPad · Mac", summary: "A home for the ideas between classes. Capture a thought, sketch the next big thing, and connect the dots later.", screens: ["A space for every idea", "From a quick thought to a plan"], features: "Organize notebooks by project, pin a favorite sketch, and find a thought with quick search. A flexible canvas keeps typed notes and drawings together.", story: "Inspired by a desk covered in sticky notes, this fictional project explores a more playful workspace with PencilKit and SwiftData." },
  { name: "Studio Hours", category: "Campus & community", creator: "Sam Patel", platform: "iPhone · iPad", summary: "Find your people and a place to build. Discover study sessions, open studios, and creative meetups around campus.", screens: ["Something good is happening", "Your next study session"], features: "Browse small-group sessions, save a spot, and see the week's plans in one place. Topic filters make it easy to find a group working on something you care about.", story: "Sam's fictional concept grew from a simple question: who else is working on this tonight? The prototype pairs MapKit with a lightweight SwiftUI event browser." },
  { name: "Signal", category: "Music & discovery", creator: "Riley Chen", platform: "iPhone", summary: "A soundtrack for your everyday. Collect your latest discoveries and make a mix for the moment you're in.", screens: ["Find your next favorite", "Made for the walk home"], features: "Save listening notes, group discoveries into mood collections, and explore a fresh daily mix. Bold artwork and simple controls keep the experience focused on the music.", story: "Riley designed this fictional music journal to capture the story behind each favorite track. It experiments with rich animations and accessible playback controls." },
  { name: "Field Notes", category: "Outdoors & journaling", creator: "Riley Chen", platform: "iPhone · Apple Watch", summary: "Keep a little of the outside with you. Save favorite walks, tiny discoveries, and the places worth coming back to.", screens: ["A small adventure awaits", "Remember the little things"], features: "Start a walk, bookmark a viewpoint, and add a photo or a quick reflection. A personal trail journal brings your favorite moments together after you get home.", story: "A fictional weekend project inspired by walks around Los Angeles. Riley's concept combines MapKit, on-device journaling, and a simple Watch check-in." },
];

// Distinct, unmodified app screenshots. Attribution and source licenses are
// retained with the downloaded files in public/apps/stock and its diverse folder.
const stockScreenshots = [
  {
    credit: { label: "iOSAppTemplates · Muhittin Camdali · MIT", url: "https://github.com/muhittincamdali/iOSAppTemplates" },
    screens: [{ src: "/apps/stock/ProductivityApp-light.jpg", label: "Daily workspace and priority planner" }],
  },
  {
    credit: { label: "Pinto Notes · MIT", url: "https://github.com/pinto-notes/pinto-notes" },
    screens: [{ src: "/apps/stock/diverse/pinto-notes.png", label: "Travel notebook with checklists and a table" }],
  },
  {
    credit: { label: "Kith · MIT", url: "https://github.com/Significant-Hobbies/kith" },
    screens: [{ src: "/apps/stock/diverse/community.png", label: "Community constellation and people" }],
  },
  {
    credit: { label: "iOSAppTemplates · Muhittin Camdali · MIT", url: "https://github.com/muhittincamdali/iOSAppTemplates" },
    screens: [{ src: "/apps/stock/MusicPodcastApp-dark.jpg", label: "Audio player and listening queue" }, { src: "/apps/stock/MusicPodcastApp-light.jpg", label: "Audio library in light appearance" }],
  },
  {
    credit: { label: "iOSAppTemplates · Muhittin Camdali · MIT", url: "https://github.com/muhittincamdali/iOSAppTemplates" },
    screens: [{ src: "/apps/stock/TravelPlannerApp-light.jpg", label: "Travel itinerary and trip planner" }],
  },
];

export const featuredApps: ShowcaseItem[] = appConcepts.map((app, index): ShowcaseItem => {
  const stock = stockScreenshots[index];
  return {
  id: `app-${index + 1}`,
  title: app.name,
  detail: app.category,
  description: app.summary,
  demo: true,
  media: { type: "image", src: stock.screens[0].src },
  screenshotCredit: stock.credit,
  gallery: stock.screens.map((screen) => ({
    type: "image" as const,
    src: screen.src,
    label: screen.label,
    caption: `${screen.label}. Stock screenshot used to illustrate this fictional concept.`,
  })),
  facts: [{ label: "Concept by", value: app.creator }, { label: "Platform", value: app.platform }, { label: "Built with", value: "SwiftUI" }, { label: "Status", value: "Fictional demo project" }],
  sections: [{ heading: "Inside the app", body: app.features }, { heading: "The idea behind it", body: app.story }],
  };
});

const stockEventPhotos: DetailMedia[] = [
  { type: "image", src: "/events/stock/teamwork.jpg", label: "Team collaborating around laptops", caption: "A little collaboration, a lot of ideas.", stock: true, credit: { label: "Annie Spratt / Unsplash", url: "https://unsplash.com/photos/group-of-people-using-laptop-computer-QckxruozjRg" } },
  { type: "image", src: "/events/stock/laptop-workshop.jpg", label: "Laptops and notebooks around a shared table", caption: "Space to work on the next big thing.", stock: true, credit: { label: "Marvin Meyer / Unsplash", url: "https://unsplash.com/photos/people-sitting-down-near-table-with-assorted-laptop-computers-SYTO3xs06fU" } },
];
const stockHikePhotos: DetailMedia[] = [
  { type: "image", src: "/events/stock/trail-hike.jpg", label: "Friends hiking along a mountain trail", caption: "A change of scenery, together.", stock: true, credit: { label: "Timur Shakerzianov / Unsplash", url: "https://unsplash.com/photos/group-of-friends-hiking-on-a-mountain-trail-NDrFQQORTRU" } },
  { type: "image", src: "/events/stock/forest-hike.jpg", label: "Hikers following a forest path", caption: "Taking the conversation outside.", stock: true, credit: { label: "Timur Shakerzianov / Unsplash", url: "https://unsplash.com/photos/group-of-hikers-walking-on-a-path-in-a-forest-Xsit2UbxCec" } },
];

export const pastEvents: ShowcaseItem[] = galleryEvents.slice(0, 4).map((event) => ({
  id: event.id,
  title: event.title,
  detail: event.date,
  description: event.caption,
  media: event.media,
  gallery: [
    { ...event.media, label: event.title, caption: event.caption },
    ...(event.id === "hollywood-hike" ? stockHikePhotos : stockEventPhotos),
  ],
  facts: [{ label: "When", value: event.date }, { label: "With", value: "The iOSC community" }],
  sections: [{ heading: "About the event", body: event.caption }],
}));

export function eventShowcaseBySlug(slug: string): ShowcaseItem | undefined {
  const past = pastEvents.find((event) => event.id === slug);
  if (past) return past;
  const event = clubEvents.find((item) => item.slug === slug);
  if (!event) return undefined;
  return {
    id: event.slug, title: event.title, detail: event.date, description: event.description,
    media: { type: "image", src: event.graphic },
    gallery: [{ type: "image", src: event.graphic, label: event.title }, ...stockEventPhotos],
    facts: [{ label: "When", value: `${event.date} · ${event.time}` }],
    sections: [{ heading: "About the event", body: event.description }],
  };
}

// Placeholder dates and sample imagery match the design. Replace with real event details, images, and RSVP URLs.
export const homepageEvents = [
  { id: "swift-angels", title: "Swift Angels", date: "2026-10-12", time: "6:00PM", location: "LA Tech Week", image: "/events/sample-speaker-night.png", rsvpUrl: "" },
  { id: "swift-workshop", title: "SwiftUI Workshop", date: "2026-10-13", time: "7:00PM", location: "USC · Location to be announced", image: "/events/sample-layout-lab.png", rsvpUrl: "" },
  { id: "build-night", title: "Build Night", date: "2026-10-20", time: "7:00PM", location: "USC · Location to be announced", image: "/events/sample-build-night.png", rsvpUrl: "" },
];
