import Link from "next/link";
import { upcomingEventsList } from "@/data/site";

export function UpcomingEvents() {
  const events = upcomingEventsList();

  return (
    <div className="flex flex-col gap-3">
      {events.length === 0 ? (
        <p className="text-[17px]" style={{ color: "var(--text-2)" }}>
          Nothing else on the calendar.
        </p>
      ) : (
        events.map((event) => (
          <Link key={event.slug} href={`/events/${event.slug}`} className="event-row">
            <img src={event.graphic} alt="" className="event-row-art" />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-medium" style={{ color: "var(--accent)" }}>
                {event.name}
                {event.placeholder ? " · Sample" : ""}
              </span>
              <span className="mt-0.5 block truncate text-[18px] font-semibold">{event.title}</span>
              <span className="mt-1 block text-[14px]" style={{ color: "var(--text-2)" }}>
                {new Date(`${event.date}T12:00:00`).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                {" · "}
                {event.time}
              </span>
            </span>
          </Link>
        ))
      )}
    </div>
  );
}
