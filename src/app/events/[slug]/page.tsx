import Link from "next/link";
import { notFound } from "next/navigation";
import { clubEvents, eventBySlug } from "@/data/site";

export function generateStaticParams() {
  return clubEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventBySlug(slug);
  return { title: event ? `${event.title} — iOSC` : "Event — iOSC" };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventBySlug(slug);
  if (!event) notFound();

  const when = new Date(`${event.date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-8 md:px-8 md:pt-14">
      <Link href="/" className="text-[14px] font-medium" style={{ color: "var(--accent)" }}>
        All events
      </Link>
      <div className="surface mt-4 overflow-hidden">
        <img src={event.graphic} alt="" className="aspect-[16/9] w-full object-cover" />
        <div className="p-6 md:p-8">
          <p className="text-[13px] font-medium" style={{ color: "var(--accent)" }}>
            {event.name}
            {event.placeholder ? " · Sample" : ""}
          </p>
          <h1 className="mt-2 text-[36px] font-semibold tracking-tight md:text-[48px]">{event.title}</h1>
          <p className="mt-3 text-[16px]" style={{ color: "var(--text-2)" }}>
            {when}
            {event.endDate ? ` – ${event.endDate}` : ""} · {event.time}
          </p>
          <p className="mt-6 text-[17px] leading-relaxed">{event.description}</p>
        </div>
      </div>
    </main>
  );
}
