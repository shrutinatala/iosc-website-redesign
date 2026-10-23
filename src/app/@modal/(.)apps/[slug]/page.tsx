import { notFound } from "next/navigation";
import { featuredApps } from "@/data/home";
import { ShowcaseDetail } from "@/components/showcase-detail";
import { ShowcaseModal } from "@/components/showcase-modal";

export { generateMetadata } from "@/app/apps/[slug]/page";

export default async function AppModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = featuredApps.find((app) => app.id === slug);
  if (!item) notFound();
  return <ShowcaseModal titleId={`detail-title-${item.id}`}><ShowcaseDetail item={item} kind="apps" /></ShowcaseModal>;
}
