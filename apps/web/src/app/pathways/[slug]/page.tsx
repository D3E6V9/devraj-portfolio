import { notFound } from "next/navigation";
import { getCourses } from "@/lib/api";
import { pathways } from "@/lib/pathways";
import { Roadmap } from "./roadmap";

export async function generateStaticParams() { return pathways.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = pathways.find((item) => item.slug === slug);
  return { title: pathway?.title ?? "Career pathway", description: pathway?.description };
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = pathways.find((item) => item.slug === slug);
  if (!pathway) notFound();
  const courses = await getCourses();
  return <Roadmap pathway={pathway} courses={courses} />;
}
