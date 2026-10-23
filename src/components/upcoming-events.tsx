"use client";

import { useState } from "react";
import Image from "next/image";
import { MonthCalendar } from "@/components/month-calendar";
import { MobileDisclosure } from "@/components/mobile-disclosure";
import { homepageEvents } from "@/data/home";

export function UpcomingEvents() {
  const [selectedDate, setSelectedDate] = useState(homepageEvents[0].date);
  const event = homepageEvents.find((item) => item.date === selectedDate);
  return (
    <div className="upcoming-grid">
      <div className="next-event" aria-live="polite">
        {event ? <Image key={event.image} src={event.image} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="next-event-image" /> : null}
        <p className="event-eyebrow">{event ? "Next event:" : "Selected date:"}</p>
        <div className="next-event-content">
          <h3>{event?.title ?? "See you soon"}</h3>
          <p className="next-event-details">
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" })}{event ? `, ${event.time}` : ""}
            <br />{event?.location ?? "No events scheduled for this day."}
          </p>
          {event?.rsvpUrl ? <a href={event.rsvpUrl} className="rsvp-button" target="_blank" rel="noopener noreferrer">RSVP</a> : event ? <button className="rsvp-button" type="button" disabled title="Registration link coming soon">RSVP <span className="sr-only">— registration link coming soon</span></button> : null}
        </div>
      </div>
      <MobileDisclosure id="upcoming-calendar" label="Browse the calendar">
        <MonthCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
      </MobileDisclosure>
    </div>
  );
}
