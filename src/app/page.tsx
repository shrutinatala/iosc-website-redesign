import Link from "next/link";
import { EventGallery } from "@/components/event-gallery";
import { UpcomingEvents } from "@/components/upcoming-events";
import { featuredApps } from "@/data/home";

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="content-width">
          <p className="hero-eyebrow">University of Southern California</p>
          <h1 id="hero-title">USC’s <strong><span className="hero-highlight">Apple Platforms</span><br className="desktop-break" /> development club</strong></h1>
          <div className="hero-actions">
            <Link href="/join" className="hero-button hero-button-secondary">Interested?</Link>
            <Link href="/join#applications" className="hero-button hero-button-primary">Apply now <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <div className="content-width home-sections">
        <section aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="section-heading">Upcoming</h2>
          <UpcomingEvents />
        </section>
        <section aria-labelledby="apps-heading">
          <h2 id="apps-heading" className="section-heading">Featured apps</h2>
          <EventGallery items={featuredApps} kind="apps" />
        </section>
        <section aria-labelledby="past-heading">
          <h2 id="past-heading" className="section-heading">Past events</h2>
          <EventGallery />
        </section>
      </div>
    </main>
  );
}
