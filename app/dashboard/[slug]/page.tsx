import Component from "@/app/dashboard/[slug]/component";

export default async function Onboarding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return <Component slug={slug} />;
}
