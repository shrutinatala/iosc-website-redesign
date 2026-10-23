import Link from "next/link";
import { notFound } from "next/navigation";
import { clubEvents } from "@/data/site";
import { eventShowcaseBySlug, pastEvents } from "@/data/home";
import { ShowcaseDetail } from "@/components/showcase-detail";

export function generateStaticParams() {
  return [...new Set([...clubEvents.map((event) => event.slug), ...pastEvents.map((event) => event.id)])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventShowcaseBySlug(slug);
  return { title: event ? `${event.title} — iOSC` : "Event — iOSC" };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventShowcaseBySlug(slug);
  if (!event) notFound();

  return (
    <main id="main-content" className="detail-page content-width inner-page">
      <Link href="/#past-heading" className="detail-back">← All events</Link>
      <ShowcaseDetail item={event} kind="events" />
    </main>
  );
}
