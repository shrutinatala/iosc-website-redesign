import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Join Us — iOSC",
};

export default function JoinPage() {
  const openingSoon = siteConfig.recruitingMode === "applications-soon";

  return (
    <main id="main-content" className="content-width inner-page">
      <section id="applications" className="surface mb-10 p-6 md:p-8">
        <h1 className="page-heading">Build with us.</h1>
        <p className="page-intro">Curious about Apple platforms? You belong here. Application details are coming soon. In the meantime, get to know the team and follow along for club updates.</p>
        <a href={siteConfig.socials.instagram} className="btn-accent mt-5" target="_blank" rel="noopener noreferrer">Follow iOSC</a>
      </section>
      <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: "var(--text-3)" }}>
        Join us
      </p>
      {openingSoon ? (
        <>
          <h2 className="mt-2 text-[40px] font-semibold tracking-tight md:text-[56px]">
            Application Opening Soon
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            Applications are about to open. Check back here, or follow iOSC for the announcement.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-[32px] font-semibold tracking-tight md:text-[40px]">
            Schedule a coffee chat
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            If you are interested in joining, schedule a coffee chat with someone on the e-board.
          </p>
          <div className="surface mt-5 overflow-hidden">
            <iframe
              loading="lazy"
              title="Schedule a coffee chat"
              src={siteConfig.calendlyUrl}
              className="calendly-frame"
            />
          </div>
        </>
      )}
    </main>
  );
}
