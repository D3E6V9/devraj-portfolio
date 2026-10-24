import { notFound } from "next/navigation";
import { getCourses } from "@/lib/api";
import { getPathway } from "@/lib/api";
import { Roadmap } from "./roadmap";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = await getPathway(slug);
  return { title: pathway?.title ?? "Career pathway", description: pathway?.description };
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pathway = await getPathway(slug);
  if (!pathway) notFound();
  const courses = await getCourses();
  return <Roadmap pathway={pathway} courses={courses} />;
}
