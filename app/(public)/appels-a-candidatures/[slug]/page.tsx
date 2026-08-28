import { CallDetail } from "@/components/opportunities/call-detail"

export default async function CallDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CallDetail slug={slug} />
}
