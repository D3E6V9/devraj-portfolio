import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const courses = await getCourses();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...courses.map((course) => ({ url: `${base}/courses/${course.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}
