"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { eventsOn, type ClubEvent } from "@/data/site";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MonthCalendar() {
  const now = new Date();
  const today = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const prevDays = new Date(cursor.year, cursor.month, 0).getDate();
    const slots: { isoDate: string; day: number; outside: boolean }[] = [];
    for (let i = startPad - 1; i >= 0; i -= 1) {
      const day = prevDays - i;
      const date = new Date(cursor.year, cursor.month - 1, day);
      slots.push({
        isoDate: iso(date.getFullYear(), date.getMonth(), date.getDate()),
        day,
        outside: true,
      });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      slots.push({ isoDate: iso(cursor.year, cursor.month, day), day, outside: false });
    }
    while (slots.length % 7 !== 0) {
      const day = slots.length - (startPad + daysInMonth) + 1;
      const date = new Date(cursor.year, cursor.month + 1, day);
      slots.push({
        isoDate: iso(date.getFullYear(), date.getMonth(), date.getDate()),
        day,
        outside: true,
      });
    }
    return slots;
  }, [cursor]);

  const label = new Date(cursor.year, cursor.month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shift(delta: number) {
    const date = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
  }

  return (
    <div className="surface p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[22px] font-semibold tracking-tight">{label}</h3>
        <div className="flex gap-2">
          <button type="button" className="icon-btn press" onClick={() => shift(-1)} aria-label="Previous month">
            ‹
          </button>
          <button type="button" className="icon-btn press" onClick={() => shift(1)} aria-label="Next month">
            ›
          </button>
        </div>
      </div>
      <div className="cal-grid mb-2">
        {WEEKDAYS.map((day, i) => (
          <div key={`${day}-${i}`} className="pb-2 text-center text-[12px] font-medium" style={{ color: "var(--text-3)" }}>
            {day}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((cell) => {
          const events = eventsOn(cell.isoDate);
          return (
            <div
              key={cell.isoDate}
              className="cal-cell"
              data-today={cell.isoDate === today}
              data-outside={cell.outside}
            >
              <span className="cal-num">{cell.day}</span>
              {events.map((event) => (
                <EventChip key={event.slug} event={event} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventChip({ event }: { event: ClubEvent }) {
  return (
    <Link href={`/events/${event.slug}`} className="cal-chip">
      <img src={event.graphic} alt="" />
      <span className="cal-chip-copy">
        <span className="cal-chip-name">{event.name}</span>
        <span className="cal-chip-title">{event.title}</span>
      </span>
    </Link>
  );
}
