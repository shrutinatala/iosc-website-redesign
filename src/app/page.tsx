import Link from "next/link";
import { EventGallery } from "@/components/event-gallery";
import { UpcomingEvents } from "@/components/upcoming-events";
import { HomeSection } from "@/components/mobile-disclosure";
import { featuredApps, pastEvents } from "@/data/home";

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
        <HomeSection id="upcoming" title="Upcoming" detail="Your next club event" defaultOpen>
          <UpcomingEvents />
        </HomeSection>
        <HomeSection id="apps" title="Featured apps" detail={`${featuredApps.length} apps to explore`}>
          <p className="mobile-gallery-hint">Swipe to explore · Tap an app for a closer look</p>
          <EventGallery items={featuredApps} kind="apps" />
        </HomeSection>
        <HomeSection id="past" title="Past events" detail={`${pastEvents.length} events in the gallery`}>
          <EventGallery />
        </HomeSection>
      </div>
    </main>
  );
}
