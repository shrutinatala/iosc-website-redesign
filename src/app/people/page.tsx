import type { ReactNode } from "react";
import Link from "next/link";
import { PersonGrid } from "@/components/person-card";
import { alumni, eboard, members } from "@/data/site";

export const metadata = {
  title: "People — iOSC",
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: "var(--text-3)" }}>
        {eyebrow}
      </p>
      <h2 className="mt-1 text-[28px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function PeoplePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-8 md:pt-14">
      <h1 className="text-[40px] font-semibold tracking-tight md:text-[56px]">People</h1>
      <p className="mt-3 max-w-xl text-[17px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        The e-board, members, and alumni. Tap a person to see the apps they&apos;ve made.
      </p>

      <Section eyebrow="Now" title="E-board">
        <PersonGrid people={eboard} />
      </Section>
      <Section eyebrow="Club" title="Members">
        <PersonGrid people={members} />
      </Section>
      <Section eyebrow="Before" title="Alumni">
        <PersonGrid people={alumni} />
      </Section>

      <section className="surface mt-14 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[24px] font-semibold tracking-tight">Join us</h2>
          <p className="mt-1 max-w-lg text-[15px]" style={{ color: "var(--text-2)" }}>
            Curious about Apple platforms? Come meet the e-board.
          </p>
        </div>
        <Link href="/join" className="btn-accent press">
          Get in touch
        </Link>
      </section>
    </main>
  );
}
