"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { eventsOn, type ClubEvent } from "@/data/site";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SPAN = 18;
const DRAG_SLOP = 6;

type Month = { year: number; month: number };
type PaneBox = { top: number; height: number };

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addMonth(cursor: Month, delta: number): Month {
  const date = new Date(cursor.year, cursor.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function monthLabel(cursor: Month) {
  return new Date(cursor.year, cursor.month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function monthCells(cursor: Month) {
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
}

function buildMonths(center: Month) {
  const months: Month[] = [];
  for (let i = -SPAN; i <= SPAN; i += 1) months.push(addMonth(center, i));
  return months;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MonthCalendar() {
  const now = new Date();
  const today = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const [months] = useState<Month[]>(() => buildMonths({ year: now.getFullYear(), month: now.getMonth() }));
  const [index, setIndex] = useState(SPAN);
  const [offset, setOffset] = useState(0);
  const [stageHeight, setStageHeight] = useState<number>();
  const [snapping, setSnapping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const indexRef = useRef(SPAN);
  const suppressClick = useRef(false);
  const dragRef = useRef<{ id: number; startY: number; origin: number; moved: boolean } | null>(null);

  offsetRef.current = offset;
  indexRef.current = index;

  function paneMetrics(): PaneBox[] {
    const track = trackRef.current;
    if (!track) return [];
    return [...track.querySelectorAll<HTMLElement>(".cal-pane")].map((pane) => ({
      top: pane.offsetTop,
      height: pane.offsetHeight,
    }));
  }

  function liveOffset() {
    const track = trackRef.current;
    if (!track) return offsetRef.current;
    const value = new DOMMatrix(getComputedStyle(track).transform).m42;
    return Number.isFinite(value) ? value : offsetRef.current;
  }

  function nearestIndex(y: number, metrics: PaneBox[]) {
    let best = 0;
    let bestDist = Infinity;
    metrics.forEach((pane, i) => {
      const dist = Math.abs(pane.top + y);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  function clampOffset(y: number, metrics: PaneBox[]) {
    if (!metrics.length) return y;
    const max = -metrics[0].top;
    const min = -metrics[metrics.length - 1].top;
    return Math.min(max, Math.max(min, y));
  }

  function settle(target: number, metrics: PaneBox[]) {
    const pane = metrics[target];
    if (!pane) return;
    setSnapping(!prefersReducedMotion());
    setIndex(target);
    setOffset(-pane.top);
    setStageHeight(pane.height);
  }

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    const metrics = paneMetrics();
    const pane = metrics[indexRef.current];
    if (!pane) return;
    setOffset(-pane.top);
    setStageHeight(pane.height);
  }, [mounted]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let timer = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const metrics = paneMetrics();
      const next = clampOffset(liveOffset() - event.deltaY, metrics);
      setSnapping(false);
      setOffset(next);
      offsetRef.current = next;
      setIndex(nearestIndex(next, metrics));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const boxes = paneMetrics();
        settle(nearestIndex(offsetRef.current, boxes), boxes);
      }, 90);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, [mounted]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = { id: event.pointerId, startY: event.clientY, origin: liveOffset(), moved: false };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dy = event.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.abs(dy) <= DRAG_SLOP) return;
      drag.moved = true;
      setSnapping(false);
      setDragging(true);
      setOffset(drag.origin);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const metrics = paneMetrics();
    const next = clampOffset(drag.origin + dy, metrics);
    setOffset(next);
    setIndex(nearestIndex(next, metrics));
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (!drag.moved) return;
    suppressClick.current = true;
    const metrics = paneMetrics();
    const y = clampOffset(drag.origin + (event.clientY - drag.startY), metrics);
    settle(nearestIndex(y, metrics), metrics);
  }

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function shift(delta: number) {
    const metrics = paneMetrics();
    const target = Math.min(metrics.length - 1, Math.max(0, indexRef.current + delta));
    settle(target, metrics);
  }

  const shown = mounted ? months : [months[SPAN]];
  const active = months[index] ?? months[SPAN];

  return (
    <div className="surface p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="cal-month-label">{monthLabel(active)}</h3>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="icon-btn press" onClick={() => shift(-1)} aria-label="Previous month">
            ↑
          </button>
          <button type="button" className="icon-btn press" onClick={() => shift(1)} aria-label="Next month">
            ↓
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
      <div
        ref={stageRef}
        className={dragging ? "cal-stage is-dragging" : "cal-stage"}
        style={{ height: stageHeight }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          ref={trackRef}
          className={snapping ? "cal-track is-snap" : "cal-track"}
          style={{ transform: `translateY(${offset}px)` }}
        >
          {shown.map((month, i) => (
            <MonthPane key={`${month.year}-${month.month}`} month={month} today={today} hidden={mounted && i !== index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthPane({ month, today, hidden = false }: { month: Month; today: string; hidden?: boolean }) {
  const cells = monthCells(month);
  return (
    <div className="cal-pane" aria-hidden={hidden || undefined} inert={hidden || undefined}>
      <div className="cal-grid">
        {cells.map((cell) => {
          const events = eventsOn(cell.isoDate);
          return (
            <div
              key={cell.isoDate}
              className="cal-cell"
              data-today={!cell.outside && cell.isoDate === today}
              data-outside={cell.outside}
            >
              {cell.outside ? null : (
                <>
                  <span className="cal-num">{cell.day}</span>
                  {events.map((event) => (
                    <EventChip key={event.slug} event={event} />
                  ))}
                </>
              )}
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
      <img src={event.graphic} alt="" draggable={false} />
      <span className="cal-chip-copy">
        <span className="cal-chip-name">{event.name}</span>
        <span className="cal-chip-title">{event.title}</span>
      </span>
    </Link>
  );
}
