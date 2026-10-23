"use client";

import { useState } from "react";
import { homepageEvents } from "@/data/home";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function MonthCalendar({ selectedDate, onSelect }: { selectedDate: string; onSelect: (date: string) => void }) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const label = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const start = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  function shift(delta: number) { setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1)); }
  return (
    <div className="month-calendar">
      <div className="calendar-header">
        <h3 aria-live="polite">{label}</h3>
        <div className="calendar-controls">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <button type="button" onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
      </div>
      <div className="calendar-grid" role="group" aria-label={label}>
        {WEEKDAYS.map((day) => <span className="calendar-weekday" key={day} aria-label={day}>{day[0]}</span>)}
        {Array.from({ length: start }, (_, index) => <span key={`blank-${index}`} aria-hidden="true" />)}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1;
          const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const events = homepageEvents.filter((event) => event.date === date);
          return (
            <button key={date} type="button" className={`calendar-date${events.length ? " has-event" : ""}`} aria-label={`${label} ${day}${events.length ? `: ${events.map((event) => event.title).join(", ")}` : ": no events"}`} aria-pressed={selectedDate === date} onClick={() => onSelect(date)}>
              <span>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
