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
const courseFields = z.object({ title: z.string().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), shortDescription: z.string().min(10).max(280), description: z.string().max(10000).optional(), category: z.string().min(2).max(60), difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"), objectives: z.array(z.string().max(250)).max(20).default([]), audience: z.string().max(500).optional(), thumbnailUrl: z.string().url().optional().or(z.literal("")), estimatedMinutes: z.number().int().nonnegative().default(0), featured: z.boolean().default(false), status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), seoTitle: z.string().max(120).optional(), seoDescription: z.string().max(300).optional() });
async function publishReady(id: string) {
  const course = await db.course.findUnique({ where: { id }, include: { chapters: { where: { status: "PUBLISHED" }, include: { topics: { where: { status: "PUBLISHED" }, include: { resources: { where: { status: "PUBLISHED" } } } } } }, assessment: { include: { questions: { include: { options: true } } } } } });
  return Boolean(course?.chapters.length && course.chapters.every(ch => ch.topics.length > 0) && course.chapters.every(ch => ch.topics.every(t => t.resources.length > 0)) && course.assessment?.status === "PUBLISHED" && course.assessment.questions.length > 0 && course.assessment.questions.every(q => q.options.filter(o => o.isCorrect).length === 1 && q.options.length >= 2));
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
api.get("/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const [courses, publishedCourses, chapters, topics, resources, assessments, attempts, aggregates] = await Promise.all([
      db.course.count(), db.course.count({ where: { status: "PUBLISHED" } }), db.chapter.count(), db.topic.count(), db.learningResource.count(), db.assessment.count({ where: { status: "PUBLISHED" } }), db.assessmentAttempt.count({ where: { submittedAt: { not: null } } }), db.assessmentAttempt.aggregate({ where: { submittedAt: { not: null } }, _avg: { percent: true } })
    ]);
    res.json({ courses, publishedCourses, draftCourses: courses - publishedCourses, chapters, topics, resources, publishedAssessments: assessments, submittedAttempts: attempts, averagePercent: aggregates._avg.percent });
  } catch (e) { next(e); }
});
api.get("/admin/courses", requireAdmin, async (_req, res, next) => { try { res.json(await db.course.findMany({ orderBy: { updatedAt: "desc" } })); } catch (e) { next(e); } });
api.post("/admin/courses", requireAdmin, async (req, res, next) => {
  try {
    const input = courseFields.parse(req.body);
    const course = await db.course.create({ data: { ...input, thumbnailUrl: input.thumbnailUrl || null } });
    if (course.status === "PUBLISHED" && !(await publishReady(course.id))) { await db.course.update({ where: { id: course.id }, data: { status: "DRAFT", publishedAt: null } }); return res.status(422).json({ error: "A course needs published chapters, topics, resources, and a complete published assessment before publishing." }); }
    res.status(201).json(course);
  } catch (e) { next(e); }
});
api.patch("/admin/courses/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = courseFields.partial().parse(req.body);
    const course = await db.course.update({ where: { id: String(req.params.id) }, data: { ...input, ...(input.thumbnailUrl !== undefined ? { thumbnailUrl: input.thumbnailUrl || null } : {}), ...(input.status === "PUBLISHED" ? { publishedAt: new Date() } : input.status === "DRAFT" ? { publishedAt: null } : {}) } });
    if (course.status === "PUBLISHED" && !(await publishReady(course.id))) { await db.course.update({ where: { id: course.id }, data: { status: "DRAFT", publishedAt: null } }); return res.status(422).json({ error: "A course needs published chapters, topics, resources, and a complete published assessment before publishing." }); }
    res.json(course);
  } catch (e) { next(e); }
});
api.delete("/admin/courses/:id", requireAdmin, async (req, res, next) => { try { await db.course.delete({ where: { id: String(req.params.id) } }); res.status(204).end(); } catch (e) { next(e); } });
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
  res.status(500).json({ error: "The request could not be completed." });
});
app.use("/api/v1", api);
const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`UpShift API listening on ${port}`));
