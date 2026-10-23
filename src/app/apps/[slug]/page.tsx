import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredApps } from "@/data/home";
import { ShowcaseDetail } from "@/components/showcase-detail";

export function generateStaticParams() { return featuredApps.map((app) => ({ slug: app.id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = featuredApps.find((item) => item.id === slug);
  return { title: app ? `${app.title} — iOSC` : "App — iOSC" };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = featuredApps.find((app) => app.id === slug);
  if (!item) notFound();
  return <main id="main-content" className="detail-page content-width inner-page"><Link className="detail-back" href="/#apps-heading">← All apps</Link><ShowcaseDetail item={item} kind="apps" /></main>;
}
