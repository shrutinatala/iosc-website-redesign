import { EventGallery } from "@/components/event-gallery";
import { MonthCalendar } from "@/components/month-calendar";
import { UpcomingEvents } from "@/components/upcoming-events";
import { siteConfig } from "@/data/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pt-8 md:px-8 md:pt-14">
      <section className="pointer-tilt max-w-3xl">
        <img src="/iosc-logo.png" alt="iOSC" className="logo-for-dark mb-6 h-14 w-auto md:h-16" />
        <img src="/iosc-logo-light.png" alt="iOSC" className="logo-for-light mb-6 h-14 w-auto md:h-16" />
        <p className="text-[15px] font-medium tracking-wide" style={{ color: "var(--accent)" }}>
          {siteConfig.tagline}
        </p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight md:text-[64px]">
          Build for Apple&apos;s platforms.
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          Workshops, speaker nights, and apps that ship. A student club at USC for people who want to make things on iPhone, iPad, Mac, and beyond.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-[28px] font-semibold tracking-tight">Past events</h2>
          <p className="hidden text-[13px] md:block" style={{ color: "var(--text-3)" }}>
            Hover a photo to open it
          </p>
        </div>
        <EventGallery />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-[28px] font-semibold tracking-tight">Public events</h2>
          <p className="mt-1 text-[15px]" style={{ color: "var(--text-2)" }}>
            A month of what&apos;s on the calendar.
          </p>
        </div>
        <MonthCalendar />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-[28px] font-semibold tracking-tight">Upcoming</h2>
          <p className="mt-1 text-[15px]" style={{ color: "var(--text-2)" }}>
            Everything still ahead, in order.
          </p>
        </div>
        <UpcomingEvents />
      </section>
    </main>
  );
}
