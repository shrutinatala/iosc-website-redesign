import { notFound } from "next/navigation";
import { eventShowcaseBySlug } from "@/data/home";
import { ShowcaseDetail } from "@/components/showcase-detail";
import { ShowcaseModal } from "@/components/showcase-modal";

export { generateMetadata } from "@/app/events/[slug]/page";

export default async function EventModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = eventShowcaseBySlug(slug);
  if (!item) notFound();
  return <ShowcaseModal titleId={`detail-title-${item.id}`}><ShowcaseDetail item={item} kind="events" /></ShowcaseModal>;
}
