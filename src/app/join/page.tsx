import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Join Us — iOSC",
};

export default function JoinPage() {
  const openingSoon = siteConfig.recruitingMode === "applications-soon";

  return (
    <main className="w-full px-4 pt-6 md:px-6 md:pt-8">
      <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: "var(--text-3)" }}>
        Join us
      </p>
      {openingSoon ? (
        <>
          <h1 className="mt-2 text-[40px] font-semibold tracking-tight md:text-[56px]">
            Application Opening Soon
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            Applications are about to open. Check back here, or follow iOSC for the announcement.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight md:text-[40px]">
            Schedule a coffee chat
          </h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed" style={{ color: "var(--text-2)" }}>
            If you are interested in joining, schedule a coffee chat with someone on the e-board.
          </p>
          <div className="surface mt-5 overflow-hidden">
            <iframe
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
