import "dotenv/config";
import express from "express";
import cors from "cors";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const db = new PrismaClient();
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "1mb" }));
const api = express.Router();
const secret = () => process.env.SESSION_SECRET ?? "";
function signedSession(adminId: string) {
  const payload = Buffer.from(JSON.stringify({ sub: adminId, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
function sessionAdmin(req: express.Request): string | null {
  const token = req.headers.cookie?.split(";").map(x => x.trim()).find(x => x.startsWith("upshift_admin="))?.slice("upshift_admin=".length);
  if (!token || !secret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  let provided: Buffer;
  try { provided = Buffer.from(signature, "base64url"); } catch { return null; }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try { const data = JSON.parse(Buffer.from(payload, "base64url").toString()); return data.exp > Date.now() && typeof data.sub === "string" ? data.sub : null; } catch { return null; }
}
const requireAdmin: RequestHandler = (req, res, next) => { if (!sessionAdmin(req)) return res.status(401).json({ error: "Administrator login required" }); next(); };
const cookieOptions = `Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
function safeHttpsUrl(value: string) { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.toString() : ""; } catch { return ""; } }
const courseFields = z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), shortDescription: z.string().min(10).max(280), description: z.string().max(10000).optional(), category: z.string().min(2).max(60), difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"), objectives: z.array(z.string().max(250)).max(20).default([]), audience: z.string().max(500).optional(), thumbnailUrl: z.string().url().refine(value => new URL(value).protocol === "https:", "Image links must use HTTPS").optional().or(z.literal("")), estimatedMinutes: z.number().int().nonnegative().default(0), featured: z.boolean().default(false), status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), seoTitle: z.string().max(120).optional(), seoDescription: z.string().max(300).optional() });
const chapterFields = z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().max(5000).default(""), order: z.number().int().nonnegative().default(0), status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED") });
const topicFields = z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().max(10000).default(""), objectives: z.array(z.string().max(250)).max(20).default([]), order: z.number().int().nonnegative().default(0), status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED") });
const resourceFields = z.object({ title: z.string().min(2).max(160), description: z.string().max(3000).default(""), type: z.enum(["VIDEO", "ARTICLE", "LINK"]).default("LINK"), externalUrl: z.string().url().max(2000), videoProvider: z.string().max(40).optional().nullable(), videoId: z.string().max(200).optional().nullable(), durationSeconds: z.number().int().nonnegative().optional().nullable(), order: z.number().int().nonnegative().default(0), status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED") });
const visitorFields = z.object({ visitorId: z.string().uuid() });
const utcDay = (date = new Date()) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
async function publishReady(id: string) {
  const course = await db.course.findUnique({ where: { id }, include: { chapters: { include: { topics: { include: { resources: true } } } } } });
  return Boolean(course?.chapters.length && course.chapters.every(ch => ch.status === "PUBLISHED" && ch.topics.length > 0 && ch.topics.every(t => t.status === "PUBLISHED" && t.resources.length > 0 && t.resources.every(r => r.status === "PUBLISHED"))));
}
api.get("/health", async (_req, res) => {
  try { await db.$queryRaw`SELECT 1`; res.json({ ok: true, database: "connected" }); }
  catch { res.status(503).json({ ok: false, database: "unavailable" }); }
});
api.post("/admin/auth/login", async (req, res, next) => {
  try {
    if (!secret() || secret().length < 32) return res.status(503).json({ error: "Admin session signing is not configured" });
    const input = z.object({ email: z.string().email(), password: z.string().min(1).max(200) }).parse(req.body);
    const admin = await db.adminUser.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!admin) return res.status(401).json({ error: "Invalid email or password" });
    const [salt, hash] = admin.passwordHash.split(":");
    if (!salt || !hash) return res.status(401).json({ error: "Invalid email or password" });
    const actual = scryptSync(input.password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    if (expected.length !== actual.length || !timingSafeEqual(actual, expected)) return res.status(401).json({ error: "Invalid email or password" });
    res.setHeader("Set-Cookie", `upshift_admin=${signedSession(admin.id)}; ${cookieOptions}`);
    res.json({ id: admin.id, email: admin.email });
  } catch (e) { next(e); }
});
api.post("/admin/auth/logout", (_req, res) => { res.setHeader("Set-Cookie", "upshift_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"); res.json({ ok: true }); });
api.get("/admin/auth/me", requireAdmin, async (req, res, next) => {
  try {
    const id = sessionAdmin(req);
    const admin = id ? await db.adminUser.findUnique({ where: { id }, select: { id: true, email: true } }) : null;
    if (!admin) return res.status(401).json({ error: "Administrator login required" });
    res.json(admin);
  } catch (e) { next(e); }
});
api.post("/analytics/page-view", async (req, res, next) => {
  try {
    const input = visitorFields.extend({ path: z.string().min(1).max(300), courseSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional() }).parse(req.body);
    const path = input.path.split(/[?#]/, 1)[0];
    if (!path.startsWith("/") || path.startsWith("//") || path === "/admin" || path.startsWith("/admin/")) return res.status(400).json({ error: "Invalid page path" });
    const course = input.courseSlug ? await db.course.findFirst({ where: { slug: input.courseSlug, status: "PUBLISHED" }, select: { id: true, viewCount: true, likeCount: true } }) : null;
    if (input.courseSlug && (!course || path !== `/courses/${input.courseSlug}`)) return res.status(404).json({ error: "Course not found" });
    const day = utcDay();
    const result = await db.$transaction(async tx => {
      const inserted = await tx.pageView.createMany({ data: { visitorId: input.visitorId, path, day, courseId: course?.id }, skipDuplicates: true });
      if (inserted.count && course) await tx.course.update({ where: { id: course.id }, data: { viewCount: { increment: 1 } } });
      if (!course) return { counted: inserted.count > 0 };
      const [current, liked] = await Promise.all([
        tx.course.findUniqueOrThrow({ where: { id: course.id }, select: { viewCount: true, likeCount: true } }),
        tx.courseLike.findUnique({ where: { courseId_visitorId: { courseId: course.id, visitorId: input.visitorId } }, select: { id: true } }),
      ]);
      return { counted: inserted.count > 0, ...current, liked: Boolean(liked) };
    });
    res.json(result);
  } catch (e) { next(e); }
});
api.post("/analytics/chapter-view", async (req, res, next) => {
  try {
    const input = visitorFields.extend({ chapterId: z.string().min(1).max(40) }).parse(req.body);
    const chapter = await db.chapter.findFirst({ where: { id: input.chapterId, status: "PUBLISHED", course: { status: "PUBLISHED" } }, select: { id: true } });
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    const day = utcDay();
    const result = await db.$transaction(async tx => {
      const inserted = await tx.chapterView.createMany({ data: { chapterId: chapter.id, visitorId: input.visitorId, day }, skipDuplicates: true });
      if (inserted.count) await tx.chapter.update({ where: { id: chapter.id }, data: { viewCount: { increment: 1 } } });
      const [current, liked] = await Promise.all([
        tx.chapter.findUniqueOrThrow({ where: { id: chapter.id }, select: { viewCount: true, likeCount: true } }),
        tx.chapterLike.findUnique({ where: { chapterId_visitorId: { chapterId: chapter.id, visitorId: input.visitorId } }, select: { id: true } }),
      ]);
      return { counted: inserted.count > 0, ...current, liked: Boolean(liked) };
    });
    res.json(result);
  } catch (e) { next(e); }
});
api.post("/courses/:slug/like", async (req, res, next) => {
  try {
    const { visitorId } = visitorFields.parse(req.body);
    const course = await db.course.findFirst({ where: { slug: String(req.params.slug), status: "PUBLISHED" }, select: { id: true } });
    if (!course) return res.status(404).json({ error: "Course not found" });
    const result = await db.$transaction(async tx => {
      const where = { courseId_visitorId: { courseId: course.id, visitorId } };
      const existing = await tx.courseLike.findUnique({ where });
      if (existing) {
        await tx.courseLike.delete({ where: { id: existing.id } });
        await tx.course.update({ where: { id: course.id }, data: { likeCount: { decrement: 1 } } });
      } else {
        await tx.courseLike.create({ data: { courseId: course.id, visitorId } });
        await tx.course.update({ where: { id: course.id }, data: { likeCount: { increment: 1 } } });
      }
      const current = await tx.course.findUniqueOrThrow({ where: { id: course.id }, select: { likeCount: true } });
      return { ...current, liked: !existing };
    });
    res.json(result);
  } catch (e) { next(e); }
});
api.post("/chapters/:id/like", async (req, res, next) => {
  try {
    const { visitorId } = visitorFields.parse(req.body);
    const chapter = await db.chapter.findFirst({ where: { id: String(req.params.id), status: "PUBLISHED", course: { status: "PUBLISHED" } }, select: { id: true } });
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    const result = await db.$transaction(async tx => {
      const where = { chapterId_visitorId: { chapterId: chapter.id, visitorId } };
      const existing = await tx.chapterLike.findUnique({ where });
      if (existing) {
        await tx.chapterLike.delete({ where: { id: existing.id } });
        await tx.chapter.update({ where: { id: chapter.id }, data: { likeCount: { decrement: 1 } } });
      } else {
        await tx.chapterLike.create({ data: { chapterId: chapter.id, visitorId } });
        await tx.chapter.update({ where: { id: chapter.id }, data: { likeCount: { increment: 1 } } });
      }
      const current = await tx.chapter.findUniqueOrThrow({ where: { id: chapter.id }, select: { likeCount: true } });
      return { ...current, liked: !existing };
    });
    res.json(result);
  } catch (e) { next(e); }
});
api.get("/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const today = utcDay();
    const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const [courses, publishedCourses, chapters, topics, resources, assessments, attempts, aggregates, totalPageViews, todayPageViews, dailyViews, topPages] = await Promise.all([
      db.course.count(), db.course.count({ where: { status: "PUBLISHED" } }), db.chapter.count(), db.topic.count(), db.learningResource.count(), db.assessment.count({ where: { status: "PUBLISHED" } }), db.assessmentAttempt.count({ where: { submittedAt: { not: null } } }), db.assessmentAttempt.aggregate({ where: { submittedAt: { not: null } }, _avg: { percent: true } }),
      db.pageView.count(), db.pageView.count({ where: { day: today } }),
      db.pageView.groupBy({ by: ["day"], where: { day: { gte: weekAgo } }, _count: { _all: true }, orderBy: { day: "asc" } }),
      db.pageView.groupBy({ by: ["path"], _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 5 }),
    ]);
    res.json({ courses, publishedCourses, draftCourses: courses - publishedCourses, chapters, topics, resources, publishedAssessments: assessments, submittedAttempts: attempts, averagePercent: aggregates._avg.percent, traffic: { totalPageViews, todayPageViews, last7Days: dailyViews.reduce((sum, row) => sum + row._count._all, 0), dailyViews: dailyViews.map(row => ({ day: row.day, count: row._count._all })), topPages: topPages.map(row => ({ path: row.path, count: row._count._all })) } });
  } catch (e) { next(e); }
});
api.get("/admin/courses", requireAdmin, async (_req, res, next) => { try { res.json(await db.course.findMany({ orderBy: { updatedAt: "desc" }, include: { _count: { select: { chapters: true } } } })); } catch (e) { next(e); } });
api.get("/admin/courses/:id", requireAdmin, async (req, res, next) => {
  try {
    const course = await db.course.findUnique({
      where: { id: String(req.params.id) },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            topics: {
              orderBy: { order: "asc" },
              include: { resources: { orderBy: { order: "asc" } } },
            },
          },
        },
      },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (e) { next(e); }
});
api.post("/admin/courses/:id/publish-curriculum", requireAdmin, async (req, res, next) => {
  try {
    const courseId = String(req.params.id);
    const result = await db.$transaction(async tx => {
      const course = await tx.course.findUnique({ where: { id: courseId }, select: { id: true, chapters: { select: { topics: { select: { resources: { select: { id: true } } } } } } } });
      if (!course) return { kind: "not-found" as const };
      if (!course.chapters.length || course.chapters.some(chapter => !chapter.topics.length || chapter.topics.some(topic => !topic.resources.length))) return { kind: "incomplete" as const };
      await tx.chapter.updateMany({ where: { courseId }, data: { status: "PUBLISHED" } });
      await tx.topic.updateMany({ where: { chapter: { courseId } }, data: { status: "PUBLISHED" } });
      await tx.learningResource.updateMany({ where: { topic: { chapter: { courseId } } }, data: { status: "PUBLISHED" } });
      return { kind: "published" as const, chapterCount: course.chapters.length, topicCount: course.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0), resourceCount: course.chapters.reduce((sum, chapter) => sum + chapter.topics.reduce((topicSum, topic) => topicSum + topic.resources.length, 0), 0) };
    });
    if (result.kind === "not-found") return res.status(404).json({ error: "Course not found" });
    if (result.kind === "incomplete") return res.status(422).json({ error: "Add at least one topic to every chapter and one learning link/resource to every topic before publishing the curriculum." });
    res.json({ chapterCount: result.chapterCount, topicCount: result.topicCount, resourceCount: result.resourceCount });
  } catch (e) { next(e); }
});
api.post("/admin/courses", requireAdmin, async (req, res, next) => {
  try {
    const input = courseFields.parse(req.body);
    const course = await db.course.create({ data: { ...input, thumbnailUrl: input.thumbnailUrl || null } });
    if (course.status === "PUBLISHED" && !(await publishReady(course.id))) { await db.course.update({ where: { id: course.id }, data: { status: "DRAFT", publishedAt: null } }); return res.status(422).json({ error: "Add at least one published chapter, one published topic per chapter, and one published link/resource per topic before publishing." }); }
    res.status(201).json(course);
  } catch (e) { next(e); }
});
api.patch("/admin/courses/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = courseFields.partial().parse(req.body);
    const course = await db.course.update({ where: { id: String(req.params.id) }, data: { ...input, ...(input.thumbnailUrl !== undefined ? { thumbnailUrl: input.thumbnailUrl || null } : {}), ...(input.status === "PUBLISHED" ? { publishedAt: new Date() } : input.status === "DRAFT" ? { publishedAt: null } : {}) } });
    if (course.status === "PUBLISHED" && !(await publishReady(course.id))) { await db.course.update({ where: { id: course.id }, data: { status: "DRAFT", publishedAt: null } }); return res.status(422).json({ error: "Add at least one published chapter, one published topic per chapter, and one published link/resource per topic before publishing." }); }
    res.json(course);
  } catch (e) { next(e); }
});
api.delete("/admin/courses/:id", requireAdmin, async (req, res, next) => { try { await db.course.delete({ where: { id: String(req.params.id) } }); res.status(204).end(); } catch (e) { next(e); } });
api.post("/admin/courses/:id/import-outline", requireAdmin, async (req, res, next) => {
  try {
    const input = z.object({ chapters: z.array(z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), topics: z.array(z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), resources: z.array(z.object({ title: z.string().min(2).max(160), externalUrl: z.string().url().max(2000), type: z.enum(["VIDEO", "ARTICLE", "LINK"]), videoProvider: z.string().max(40).nullable(), videoId: z.string().max(200).nullable(), durationSeconds: z.number().int().nonnegative().nullable() })).min(1) })).min(1) })).min(1).max(100) }).parse(req.body);
    if (input.chapters.some(chapter => chapter.topics.length > 200 || chapter.topics.some(topic => topic.resources.length > 20))) return res.status(400).json({ error: "The outline contains too many topics or links." });
    if (input.chapters.some(chapter => chapter.topics.some(topic => topic.resources.some(resource => !safeHttpsUrl(resource.externalUrl))))) return res.status(400).json({ error: "Every imported link must be a valid HTTPS URL." });
    const courseId = String(req.params.id);
    const totals = input.chapters.reduce((sum, chapter) => chapter.topics.reduce((topicSum, topic) => topic.resources.reduce((resourceSum, resource) => resourceSum + (resource.durationSeconds ?? 0), topicSum), sum), 0);
    const result = await db.$transaction(async tx => {
      const course = await tx.course.findUnique({ where: { id: courseId }, select: { id: true } });
      if (!course) return { kind: "not-found" as const };
      const existing = await tx.chapter.count({ where: { courseId } });
      if (existing) return { kind: "already-has-chapters" as const };
      let topicCount = 0;
      let resourceCount = 0;
      for (const [chapterIndex, chapter] of input.chapters.entries()) {
        await tx.chapter.create({ data: { courseId, title: chapter.title, slug: chapter.slug, description: "", order: chapterIndex, status: "DRAFT", topics: { create: chapter.topics.map((topic, topicIndex) => {
          topicCount += 1;
          resourceCount += topic.resources.length;
          return { title: topic.title, slug: topic.slug, description: "", objectives: [], order: topicIndex, status: "DRAFT" as const, resources: { create: topic.resources.map((resource, resourceIndex) => ({ title: resource.title, description: "", externalUrl: safeHttpsUrl(resource.externalUrl), type: resource.type, videoProvider: resource.videoProvider, videoId: resource.videoId, durationSeconds: resource.durationSeconds, order: resourceIndex, status: "DRAFT" as const })) } };
        }) } } });
      }
      await tx.course.update({ where: { id: courseId }, data: { estimatedMinutes: Math.ceil(totals / 60), status: "DRAFT", publishedAt: null } });
      return { kind: "imported" as const, chapterCount: input.chapters.length, topicCount, resourceCount };
    });
    if (result.kind === "not-found") return res.status(404).json({ error: "Course not found" });
    if (result.kind === "already-has-chapters") return res.status(409).json({ error: "This course already has chapters. Import into a new course draft to avoid duplicate curriculum." });
    res.status(201).json({ chapterCount: result.chapterCount, topicCount: result.topicCount, resourceCount: result.resourceCount });
  } catch (e) { next(e); }
});
api.post("/admin/courses/:id/chapters", requireAdmin, async (req, res, next) => { try { const input = chapterFields.parse(req.body); const course = await db.course.findUnique({ where: { id: String(req.params.id) }, select: { id: true } }); if (!course) return res.status(404).json({ error: "Course not found" }); const chapter = await db.chapter.create({ data: { ...input, courseId: course.id } }); res.status(201).json(chapter); } catch (e) { next(e); } });
api.patch("/admin/chapters/:id", requireAdmin, async (req, res, next) => { try { const input = chapterFields.partial().parse(req.body); const chapter = await db.chapter.update({ where: { id: String(req.params.id) }, data: input }); res.json(chapter); } catch (e) { next(e); } });
api.delete("/admin/chapters/:id", requireAdmin, async (req, res, next) => { try { const chapter = await db.chapter.findUnique({ where: { id: String(req.params.id) }, select: { courseId: true } }); if (!chapter) return res.status(404).json({ error: "Chapter not found" }); await db.chapter.delete({ where: { id: String(req.params.id) } }); await db.course.updateMany({ where: { id: chapter.courseId }, data: { status: "DRAFT", publishedAt: null } }); res.status(204).end(); } catch (e) { next(e); } });
api.post("/admin/chapters/:id/topics", requireAdmin, async (req, res, next) => { try { const input = topicFields.parse(req.body); const chapter = await db.chapter.findUnique({ where: { id: String(req.params.id) }, select: { id: true } }); if (!chapter) return res.status(404).json({ error: "Chapter not found" }); const topic = await db.topic.create({ data: { ...input, chapterId: chapter.id } }); res.status(201).json(topic); } catch (e) { next(e); } });
api.patch("/admin/topics/:id", requireAdmin, async (req, res, next) => { try { const input = topicFields.partial().parse(req.body); const topic = await db.topic.update({ where: { id: String(req.params.id) }, data: input }); res.json(topic); } catch (e) { next(e); } });
api.delete("/admin/topics/:id", requireAdmin, async (req, res, next) => { try { const topic = await db.topic.findUnique({ where: { id: String(req.params.id) }, select: { chapter: { select: { courseId: true } } } }); if (!topic) return res.status(404).json({ error: "Topic not found" }); await db.topic.delete({ where: { id: String(req.params.id) } }); await db.course.updateMany({ where: { id: topic.chapter.courseId }, data: { status: "DRAFT", publishedAt: null } }); res.status(204).end(); } catch (e) { next(e); } });
api.post("/admin/topics/:id/resources", requireAdmin, async (req, res, next) => { try { const input = resourceFields.parse(req.body); const topic = await db.topic.findUnique({ where: { id: String(req.params.id) }, select: { id: true } }); if (!topic) return res.status(404).json({ error: "Topic not found" }); const resource = await db.learningResource.create({ data: { ...input, topicId: topic.id } }); res.status(201).json(resource); } catch (e) { next(e); } });
api.patch("/admin/resources/:id", requireAdmin, async (req, res, next) => { try { const input = resourceFields.partial().parse(req.body); const resource = await db.learningResource.update({ where: { id: String(req.params.id) }, data: input }); res.json(resource); } catch (e) { next(e); } });
api.delete("/admin/resources/:id", requireAdmin, async (req, res, next) => { try { const resource = await db.learningResource.findUnique({ where: { id: String(req.params.id) }, select: { topic: { select: { chapter: { select: { courseId: true } } } } } }); if (!resource) return res.status(404).json({ error: "Resource not found" }); await db.learningResource.delete({ where: { id: String(req.params.id) } }); await db.course.updateMany({ where: { id: resource.topic.chapter.courseId }, data: { status: "DRAFT", publishedAt: null } }); res.status(204).end(); } catch (e) { next(e); } });
api.get("/courses", async (req, res, next) => {
  try {
    const query = z.object({ q: z.string().max(100).optional(), category: z.string().max(60).optional(), difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(30).default(12) }).safeParse(req.query);
    if (!query.success) return res.status(400).json({ error: "Invalid query", details: query.error.issues });
    const { q = "", category = "", difficulty, page, limit: take } = query.data;
    const where = { status: "PUBLISHED" as const, ...(category ? { category } : {}), ...(difficulty ? { difficulty } : {}), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { shortDescription: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }] } : {}) };
    const [items, total] = await Promise.all([db.course.findMany({ where, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], skip: (page - 1) * take, take, include: { chapters: { where: { status: "PUBLISHED" }, include: { topics: { where: { status: "PUBLISHED" }, select: { id: true, resources: { where: { status: "PUBLISHED" }, select: { id: true } } } } } } } }), db.course.count({ where })]);
    res.json({ items, page, limit: take, total, pages: Math.ceil(total / take) });
  } catch (e) { next(e); }
});
api.get("/courses/:slug", async (req, res, next) => {
  try {
    const course = await db.course.findFirst({ where: { slug: req.params.slug, status: "PUBLISHED" }, include: { chapters: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, include: { topics: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, include: { resources: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } } } } } }, assessment: { where: { status: "PUBLISHED" }, select: { id: true, title: true, instructions: true, passingPercent: true, questions: { select: { id: true } } } } } });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ ...course, chapters: course.chapters.map(chapter => ({ ...chapter, topics: chapter.topics.map(topic => ({ ...topic, resources: topic.resources.map(resource => ({ ...resource, externalUrl: safeHttpsUrl(resource.externalUrl) })) })) })) });
  } catch (e) { next(e); }
});
api.get("/courses/:slug/assessment", async (req, res, next) => {
  try {
    const a = await db.assessment.findFirst({ where: { status: "PUBLISHED", course: { slug: req.params.slug, status: "PUBLISHED" } }, include: { questions: { orderBy: { order: "asc" }, include: { options: { select: { id: true, text: true } } } } } });
    if (!a) return res.status(404).json({ error: "Assessment not found" });
    res.json({ id: a.id, title: a.title, instructions: a.instructions, passingPercent: a.passingPercent, timeLimitMinutes: a.timeLimitMinutes, questions: a.questions.map(({ id, text, points, order, options }) => ({ id, text, points, order, options })) });
  } catch (e) { next(e); }
});
api.post("/assessments/:id/attempts", async (req, res, next) => {
  try {
    const { learnerToken } = z.object({ learnerToken: z.string().uuid() }).parse(req.body);
    const assessment = await db.assessment.findFirst({ where: { id: req.params.id, status: "PUBLISHED", course: { status: "PUBLISHED" } } });
    if (!assessment) return res.status(404).json({ error: "Assessment not found" });
    if (assessment.maxAttempts) {
      const count = await db.assessmentAttempt.count({ where: { assessmentId: assessment.id, learnerToken, submittedAt: { not: null } } });
      if (count >= assessment.maxAttempts) return res.status(429).json({ error: "Maximum attempts reached" });
    }
    const attempt = await db.assessmentAttempt.create({ data: { assessmentId: assessment.id, learnerToken } });
    res.status(201).json({ id: attempt.id, startedAt: attempt.startedAt });
  } catch (e) { next(e); }
});
api.post("/attempts/:id/submit", async (req, res, next) => {
  try {
    const { learnerToken, answers } = z.object({ learnerToken: z.string().uuid(), answers: z.array(z.object({ questionId: z.string(), optionId: z.string() })).min(1) }).parse(req.body);
    const attempt = await db.assessmentAttempt.findFirst({ where: { id: req.params.id, learnerToken }, include: { assessment: { include: { questions: { include: { options: true } } } } } });
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.submittedAt) return res.status(409).json({ error: "Attempt has already been submitted" });
    const limit = attempt.assessment.timeLimitMinutes;
    if (limit && Date.now() > attempt.startedAt.getTime() + limit * 60_000) return res.status(409).json({ error: "The time limit has expired" });
    const selected = new Map(answers.map(x => [x.questionId, x.optionId]));
    if (selected.size !== answers.length) return res.status(400).json({ error: "Duplicate answers are not allowed" });
    const total = attempt.assessment.questions.reduce((n, q) => n + q.points, 0);
    if (!total || answers.some(a => !attempt.assessment.questions.some(q => q.id === a.questionId && q.options.some(o => o.id === a.optionId)))) return res.status(400).json({ error: "Answers include an unknown question or option" });
    const score = attempt.assessment.questions.reduce((n, q) => n + (q.options.some(o => o.id === selected.get(q.id) && o.isCorrect) ? q.points : 0), 0);
    const percent = Math.round(score / total * 100);
    const passed = percent >= attempt.assessment.passingPercent;
    await db.assessmentAttempt.update({ where: { id: attempt.id }, data: { submittedAt: new Date(), answers: Object.fromEntries(selected), score, percent, passed } });
    const results = attempt.assessment.questions.map(q => ({ questionId: q.id, selectedOptionId: selected.get(q.id) ?? null, correctOptionId: q.options.find(o => o.isCorrect)?.id, explanation: q.explanation, correct: q.options.some(o => o.id === selected.get(q.id) && o.isCorrect) }));
    res.json({ score, total, percent, passed, results });
  } catch (e) { next(e); }
});
api.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err instanceof z.ZodError) return res.status(400).json({ error: "Invalid request", details: err.issues });
  if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") return res.status(409).json({ error: "That short name is already in use here. Choose another one." });
  res.status(500).json({ error: "The request could not be completed." });
});
app.use("/api/v1", api);
const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`UpShift API listening on ${port}`));
