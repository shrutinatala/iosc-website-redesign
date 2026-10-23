import Link from "next/link";

export const metadata = { title: "About — iOSC" };

export default function AboutPage() {
  return (
    <main id="main-content" className="content-width inner-page">
      <h1 className="page-heading">Made for people who make things.</h1>
      <p className="page-intro">We&apos;re iOSC, USC&apos;s Apple Platforms development club. We bring together students who are excited about Apple, build with SwiftUI, and ship real apps.</p>
      <div className="about-grid">
        <article className="surface"><h2>Learn. Build. Ship.</h2><p>Explore iPhone, iPad, Mac, and beyond through workshops, build nights, and projects. Bring an idea, learn alongside other students, and turn it into something you can use.</p></article>
        <article className="surface"><h2>Find your people.</h2><p>Whether you&apos;re getting started or already shipping, you belong here. Meet the team, come to an event, and get to know the people behind the projects.</p></article>
      </div>
      <div className="join-actions"><Link className="btn-accent" href="/people">Meet the team</Link><Link className="btn-accent" href="/join">Join us</Link></div>
    </main>
  );
}
