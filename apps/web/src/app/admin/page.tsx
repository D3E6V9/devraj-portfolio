"use client";

import { FormEvent, InputHTMLAttributes, useEffect, useState } from "react";
import Link from "next/link";
import mammoth from "mammoth";
import { PathwaysManager } from "./pathways-manager";

const api = "/api/v1";
type Status = "DRAFT" | "PUBLISHED";
type ResourceType = "VIDEO" | "ARTICLE" | "LINK";
type Resource = { id: string; title: string; description: string; type: ResourceType; externalUrl: string; durationSeconds: number | null; status: Status };
type Topic = { id: string; title: string; slug: string; description: string; objectives: string[]; order: number; status: Status; resources: Resource[] };
type Chapter = { id: string; title: string; slug: string; description: string; order: number; status: Status; viewCount: number; likeCount: number; topics: Topic[] };
type Course = { id: string; title: string; slug: string; shortDescription: string; description: string; category: string; difficulty: string; estimatedMinutes: number; featured: boolean; thumbnailUrl: string | null; viewCount: number; likeCount: number; status: Status; objectives: string[]; audience: string; chapters?: Chapter[]; _count?: { chapters: number } };
type Metrics = { courses: number; publishedCourses: number; draftCourses: number; chapters: number; topics: number; resources: number; publishedAssessments: number; submittedAttempts: number; traffic: { totalPageViews: number; todayPageViews: number; last7Days: number; dailyViews: { day: string; count: number }[]; topPages: { path: string; count: number }[] } };
type HomepageVideo = { url: string; videoId: string };
type DailyTrafficPoint = { day: string; count: number };
type CourseDraft = { title: string; slug: string; shortDescription: string; description: string; category: string; difficulty: string; estimatedMinutes: number; objectivesText: string; audience: string; thumbnailUrl: string };
type ChapterDraft = { title: string; slug: string; description: string; order: number };
type TopicDraft = { title: string; slug: string; description: string; objectivesText: string; order: number; linkTitle: string; linkDescription: string; linkType: ResourceType; linkUrl: string; durationMinutes: number };
type ResourceDraft = { title: string; description: string; type: ResourceType; externalUrl: string; durationMinutes: number };
type OutlineResource = { title: string; externalUrl: string; type: ResourceType; videoProvider: string | null; videoId: string | null; durationSeconds: number | null };
type OutlineTopic = { title: string; slug: string; resources: OutlineResource[] };
type OutlineChapter = { title: string; slug: string; topics: OutlineTopic[] };

const blankCourse: CourseDraft = { title: "", slug: "", shortDescription: "", description: "", category: "", difficulty: "BEGINNER", estimatedMinutes: 0, objectivesText: "", audience: "", thumbnailUrl: "" };
const blankChapter: ChapterDraft = { title: "", slug: "", description: "", order: 0 };
const blankTopic: TopicDraft = { title: "", slug: "", description: "", objectivesText: "", order: 0, linkTitle: "", linkDescription: "", linkType: "VIDEO", linkUrl: "", durationMinutes: 0 };
const blankResource: ResourceDraft = { title: "", description: "", type: "VIDEO", externalUrl: "", durationMinutes: 0 };

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function uniqueSlug(value: string, used: Set<string>) {
  const base = slugify(value) || "item";
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) candidate = `${base}-${suffix++}`;
  used.add(candidate);
  return candidate;
}
function DailyTrafficChart({ rows }: { rows: DailyTrafficPoint[] }) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const counts = new Map(rows.map(row => [new Date(row.day).toISOString().slice(0, 10), row.count]));
  const points = Array.from({ length: 14 }, (_, index) => {
    const day = new Date(today.getTime() - (13 - index) * 86_400_000).toISOString().slice(0, 10);
    return { day, count: counts.get(day) || 0 };
  });
  const total = points.reduce((sum, point) => sum + point.count, 0);
  const peak = Math.max(...points.map(point => point.count), 1);
  const currentWeek = points.slice(-7).reduce((sum, point) => sum + point.count, 0);
  const previousWeek = points.slice(0, 7).reduce((sum, point) => sum + point.count, 0);
  const change = previousWeek === 0 ? null : Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
  const chartPoints = points.map((point, index) => ({ ...point, x: 42 + index * (636 / 13), y: 176 - (point.count / peak) * 138 }));
  const line = chartPoints.map(point => `${point.x},${point.y}`).join(" ");
  const area = `42,176 ${line} 678,176`;
  const labelIndexes = [0, 3, 6, 9, 13];
  const dayLabel = (day: string) => new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  return <section className="traffic-insight" aria-labelledby="daily-traffic-title">
    <div className="traffic-chart-heading"><div><h3 id="daily-traffic-title">Daily visits</h3><p className="muted">Page visits over the last 14 days</p></div><div className="traffic-trend"><span className="traffic-trend-dot"/>Last 7 days {change === null ? "· new data" : `${change >= 0 ? "↑" : "↓"} ${Math.abs(change)}% vs previous 7`}</div></div>
    {total ? <>
      <svg className="traffic-chart" viewBox="0 0 720 220" role="img" aria-label={`Daily page visits over 14 days. ${total} total visits, peak ${peak} in one day.`}>
        <defs><linearGradient id="trafficArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#C4F56A" stopOpacity=".32"/><stop offset="100%" stopColor="#79E9C5" stopOpacity=".015"/></linearGradient><linearGradient id="trafficStroke" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#79E9C5"/><stop offset="100%" stopColor="#C4F56A"/></linearGradient></defs>
        {[0, Math.ceil(peak / 2), peak].filter((value, index, values) => values.indexOf(value) === index).map(value => { const y = 176 - (value / peak) * 138; return <g key={value}><line x1="42" y1={y} x2="678" y2={y} stroke="rgba(157,177,192,.13)" strokeDasharray="3 6"/><text x="29" y={y + 4} textAnchor="end" fill="#82909f" fontSize="10">{value}</text></g>; })}
        <polygon points={area} fill="url(#trafficArea)"/><polyline points={line} fill="none" stroke="url(#trafficStroke)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
        {chartPoints.map(point => <g key={point.day}><circle cx={point.x} cy={point.y} r="4" fill="#C4F56A" stroke="#101720" strokeWidth="2" vectorEffect="non-scaling-stroke"/><title>{dayLabel(point.day)}: {point.count} page visits</title></g>)}
        {labelIndexes.map(index => <text key={points[index].day} x={chartPoints[index].x} y="204" textAnchor={index === 0 ? "start" : index === 13 ? "end" : "middle"} fill="#9aa7b3" fontSize="11">{dayLabel(points[index].day)}</text>)}
      </svg>
      <div className="traffic-chart-foot"><span>{total.toLocaleString()} page visits in this period</span><span>Peak day: {peak.toLocaleString()}</span></div>
    </> : <div className="traffic-empty"><strong>Your traffic trend will appear here</strong><span>Once visitors arrive, this chart will show daily activity for the last 14 days.</span></div>}
  </section>;
}
function youtubeId(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
    if (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com") || url.hostname === "youtube-nocookie.com" || url.hostname.endsWith(".youtube-nocookie.com")) return url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || null;
  } catch { /* URL validation below reports malformed links. */ }
  return null;
}
async function parseWordOutline(file: File): Promise<OutlineChapter[]> {
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  const document = new DOMParser().parseFromString(html, "text/html");
  const table = document.querySelector("table");
  if (!table) throw new Error("No table was found. Use a Word table with Chapter, Topic, Source/Link, and Duration columns.");
  const rows = [...table.querySelectorAll("tr")].map(row => [...row.querySelectorAll("th,td")].map(cell => ({ text: (cell.textContent || "").trim(), link: cell.querySelector("a")?.getAttribute("href")?.trim() || "" })));
  const headerIndex = rows.findIndex(row => row.some(cell => /chapter/i.test(cell.text)) && row.some(cell => /topic/i.test(cell.text)) && row.some(cell => /source|link|url/i.test(cell.text)));
  if (headerIndex < 0) throw new Error("Could not identify the table columns. Include headers for Chapter, Topic, Source (or Link), and optionally Duration.");
  const header = rows[headerIndex].map(cell => cell.text.toLowerCase());
  const column = (pattern: RegExp) => header.findIndex(value => pattern.test(value));
  const chapterColumn = column(/chapter/);
  const topicColumn = column(/topic/);
  const linkColumn = column(/source|link|url/);
  const durationColumn = column(/duration|minute|time/);
  const chapters: OutlineChapter[] = [];
  const chapterSlugs = new Set<string>();
  let currentChapter: OutlineChapter | null = null;
  let lastChapter = "";
  let importedRows = 0;
  for (const row of rows.slice(headerIndex + 1)) {
    const value = (index: number) => index < 0 ? "" : row[index]?.text || "";
    const chapterName = value(chapterColumn) || lastChapter;
    const topicName = value(topicColumn);
    const linkCell = linkColumn < 0 ? undefined : row[linkColumn];
    const linkValue = linkCell?.link || linkCell?.text || "";
    const link = linkCell?.link || linkValue.match(/https?:\/\/[^\s<>"']+/i)?.[0]?.replace(/[),.;]+$/, "") || "";
    if (!chapterName && !topicName && !link) continue;
    if (chapterName) lastChapter = chapterName;
    if (!topicName || !link || !lastChapter) throw new Error(`A table row is missing its chapter, topic, or link: ${row.map(cell => cell.text).filter(Boolean).join(" · ")}`);
    let parsedUrl: URL;
    try { parsedUrl = new URL(link); } catch { throw new Error(`This learning link is not a valid URL: ${link}`); }
    if (parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) throw new Error(`Learning links must use HTTPS: ${link}`);
    if (!currentChapter || currentChapter.title !== lastChapter) {
      currentChapter = { title: lastChapter, slug: uniqueSlug(lastChapter, chapterSlugs), topics: [] };
      chapters.push(currentChapter);
    }
    let seconds: number | null = null;
    const duration = value(durationColumn).trim();
    if (duration) {
      if (/^\d+(?:\.\d+)?$/.test(duration)) seconds = Math.round(Number(duration) * 60);
      else {
        const parts = duration.split(":").map(Number);
        if (parts.some(part => !Number.isFinite(part) || part < 0) || parts.length > 3) throw new Error(`Invalid duration “${duration}”. Use minutes:seconds.`);
        seconds = parts.reduce((total, part) => total * 60 + part, 0);
      }
    }
    const id = youtubeId(parsedUrl.toString());
    const topic = currentChapter.topics.find(item => item.title.toLowerCase() === topicName.toLowerCase());
    const resource: OutlineResource = { title: topicName, externalUrl: parsedUrl.toString(), type: id ? "VIDEO" : "LINK", videoProvider: id ? "YOUTUBE" : null, videoId: id, durationSeconds: seconds };
    if (topic) topic.resources.push(resource);
    else {
      const topicSlugs = new Set(currentChapter.topics.map(item => item.slug));
      currentChapter.topics.push({ title: topicName, slug: uniqueSlug(topicName, topicSlugs), resources: [resource] });
    }
    importedRows += 1;
  }
  if (!importedRows) throw new Error("The Word table has no curriculum rows below its header.");
  return chapters;
}
function fromCourse(course?: Course): CourseDraft {
  return course ? { title: course.title, slug: course.slug, shortDescription: course.shortDescription, description: course.description || "", category: course.category, difficulty: course.difficulty, estimatedMinutes: course.estimatedMinutes, objectivesText: (course.objectives || []).join("\n"), audience: course.audience || "", thumbnailUrl: course.thumbnailUrl || "" } : blankCourse;
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${api}${path}`, { credentials: "include", ...init });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(data.details) ? data.details.map((issue: { message?: string }) => issue.message).filter(Boolean).join(" ") : "";
    throw new Error(details || data.error || "The request could not be completed.");
  }
  return data as T;
}
const inputStyle = { display: "block", width: "100%", marginTop: 6 } as const;

export const dynamic = "force-dynamic";
export default function AdminPage() {
  const [admin, setAdmin] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [homepageVideoUrls, setHomepageVideoUrls] = useState<string[]>([]);
  const [newHomepageVideoUrl, setNewHomepageVideoUrl] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);
  const [courseDraft, setCourseDraft] = useState<CourseDraft>(blankCourse);
  const [courseEditor, setCourseEditor] = useState<"new" | "edit" | null>(null);
  const [chapterEditor, setChapterEditor] = useState<{ chapterId: string | null; value: ChapterDraft } | null>(null);
  const [topicEditor, setTopicEditor] = useState<{ chapterId: string; topicId: string | null; resourceId: string | null; value: TopicDraft } | null>(null);
  const [resourceEditor, setResourceEditor] = useState<{ topicId: string; resourceId: string | null; value: ResourceDraft } | null>(null);
  const [outlinePreview, setOutlinePreview] = useState<OutlineChapter[] | null>(null);
  const [outlineFileName, setOutlineFileName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadOverview() {
    const [courseRows, stats, playlist] = await Promise.all([
      request<Course[]>("/admin/courses"),
      request<Metrics>("/admin/dashboard"),
      request<{ videos: HomepageVideo[] }>("/admin/homepage-videos"),
    ]);
    setCourses(courseRows);
    setMetrics(stats);
    setHomepageVideoUrls(playlist.videos.map(video => video.url));
  }
  async function loadCourse(id: string) {
    const detail = await request<Course>(`/admin/courses/${id}`);
    setSelected(detail);
    setCourseDraft(fromCourse(detail));
    await loadOverview();
  }
  useEffect(() => {
    void request<{ id: string; email: string }>("/admin/auth/me").then(async (me) => {
      setAdmin(me);
      await loadOverview();
    }).catch(() => setAdmin(null));
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const me = await request<{ id: string; email: string }>("/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      setAdmin(me); setPassword(""); await loadOverview();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not sign in."); }
    finally { setBusy(false); }
  }
  async function logout() {
    await request("/admin/auth/logout", { method: "POST" });
    setAdmin(null); setSelected(null); setCourses([]); setMetrics(null);
  }
  async function saveHomepageVideos() {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request<{ videos: HomepageVideo[] }>("/admin/homepage-videos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls: homepageVideoUrls }) });
      setHomepageVideoUrls(result.videos.map(video => video.url));
      setNotice("Homepage video playlist saved. Changes will appear on the site shortly.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save the homepage playlist."); }
    finally { setBusy(false); }
  }
  async function saveCourse(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const payload = { ...courseDraft, objectives: courseDraft.objectivesText.split("\n").map((x) => x.trim()).filter(Boolean), featured: selected?.featured || false, status: selected?.status || "DRAFT" };
    try {
      const saved = await request<Course>(selected && courseEditor === "edit" ? `/admin/courses/${selected.id}` : "/admin/courses", { method: selected && courseEditor === "edit" ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setCourseEditor(null); setNotice("Course details saved."); await loadCourse(saved.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save course."); }
    finally { setBusy(false); }
  }
  async function changeCourseStatus() {
    if (!selected) return; setBusy(true); setError(""); setNotice("");
    try {
      await request<Course>(`/admin/courses/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: selected.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }) });
      setNotice(selected.status === "PUBLISHED" ? "Course moved back to drafts." : "Course is published on the learning site.");
      await loadCourse(selected.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not change course status."); }
    finally { setBusy(false); }
  }
  async function publishCurriculum() {
    if (!selected) return; setBusy(true); setError(""); setNotice("");
    try {
      const result = await request<{ chapterCount: number; topicCount: number; resourceCount: number }>(`/admin/courses/${selected.id}/publish-curriculum`, { method: "POST" });
      setNotice(`Marked ${result.chapterCount} chapters, ${result.topicCount} topics, and ${result.resourceCount} learning links as published. The course is still a draft; click “Publish course” when ready.`);
      await loadCourse(selected.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not publish curriculum items."); }
    finally { setBusy(false); }
  }
  async function saveChapter(event: FormEvent) {
    event.preventDefault(); if (!selected || !chapterEditor) return; setBusy(true); setError("");
    try {
      await request(chapterEditor.chapterId ? `/admin/chapters/${chapterEditor.chapterId}` : `/admin/courses/${selected.id}/chapters`, { method: chapterEditor.chapterId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(chapterEditor.value) });
      setChapterEditor(null); setNotice("Chapter saved."); await loadCourse(selected.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save chapter."); }
    finally { setBusy(false); }
  }
  async function saveTopic(event: FormEvent) {
    event.preventDefault(); if (!topicEditor) return; setBusy(true); setError("");
    try {
      const saved = await request<Topic>(topicEditor.topicId ? `/admin/topics/${topicEditor.topicId}` : `/admin/chapters/${topicEditor.chapterId}/topics`, { method: topicEditor.topicId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: topicEditor.value.title, slug: topicEditor.value.slug, description: topicEditor.value.description, objectives: topicEditor.value.objectivesText.split("\n").map((x) => x.trim()).filter(Boolean), order: topicEditor.value.order }) });
      if (topicEditor.value.linkUrl.trim()) {
        const resourceBody = { title: topicEditor.value.linkTitle || topicEditor.value.title, description: topicEditor.value.linkDescription, type: topicEditor.value.linkType, externalUrl: topicEditor.value.linkUrl, durationSeconds: topicEditor.value.durationMinutes ? topicEditor.value.durationMinutes * 60 : null };
        await request(topicEditor.resourceId ? `/admin/resources/${topicEditor.resourceId}` : `/admin/topics/${saved.id}/resources`, { method: topicEditor.resourceId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resourceBody) });
      }
      setTopicEditor(null); setNotice("Topic and learning link saved."); await loadCourse(selected!.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save topic."); }
    finally { setBusy(false); }
  }
  async function saveResource(event: FormEvent) {
    event.preventDefault(); if (!resourceEditor || !selected) return; setBusy(true); setError("");
    try {
      const value = { ...resourceEditor.value, durationSeconds: resourceEditor.value.durationMinutes ? resourceEditor.value.durationMinutes * 60 : null };
      await request(resourceEditor.resourceId ? `/admin/resources/${resourceEditor.resourceId}` : `/admin/topics/${resourceEditor.topicId}/resources`, { method: resourceEditor.resourceId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
      setResourceEditor(null); setNotice("Learning link saved."); await loadCourse(selected.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save learning link."); }
    finally { setBusy(false); }
  }
  async function readOutline(file?: File) {
    setError(""); setNotice(""); setOutlinePreview(null); setOutlineFileName("");
    if (!file) return;
    setBusy(true);
    try {
      const chapters = await parseWordOutline(file);
      setOutlinePreview(chapters); setOutlineFileName(file.name);
      const topics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
      const resources = chapters.reduce((sum, chapter) => sum + chapter.topics.reduce((n, topic) => n + topic.resources.length, 0), 0);
      setNotice(`Word file ready: ${chapters.length} chapters, ${topics} topics, and ${resources} links. Review the outline and import when ready.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not read this Word document."); }
    finally { setBusy(false); }
  }
  async function importOutline() {
    if (!selected || !outlinePreview?.length) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request<{ chapterCount: number; topicCount: number; resourceCount: number }>(`/admin/courses/${selected.id}/import-outline`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chapters: outlinePreview }) });
      setOutlinePreview(null); setOutlineFileName("");
      setNotice(`Imported ${result.chapterCount} chapters, ${result.topicCount} topics, and ${result.resourceCount} links. All descriptions are blank and the curriculum remains in draft.`);
      await loadCourse(selected.id);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not import the Word outline."); }
    finally { setBusy(false); }
  }
  async function remove(path: string, label: string) {
    if (!window.confirm(`Delete this ${label} and its nested content? This cannot be undone.`)) return;
    const currentCourseId = selected?.id;
    setBusy(true); setError("");
    try { await request(path, { method: "DELETE" }); setNotice(`${label[0].toUpperCase() + label.slice(1)} deleted.`); if (path.startsWith("/admin/courses/")) { setSelected(null); await loadOverview(); } else if (currentCourseId) await loadCourse(currentCourseId); else await loadOverview(); }
    catch (e) { setError(e instanceof Error ? e.message : `Could not delete ${label}.`); }
    finally { setBusy(false); }
  }
  function openChapter(chapter?: Chapter) {
    setChapterEditor({ chapterId: chapter?.id || null, value: chapter ? { title: chapter.title, slug: chapter.slug, description: chapter.description, order: chapter.order } : { ...blankChapter, order: selected?.chapters?.length || 0 } });
  }
  function openTopic(chapter: Chapter, topic?: Topic) {
    const resource = topic?.resources?.[0];
    setTopicEditor({ chapterId: chapter.id, topicId: topic?.id || null, resourceId: resource?.id || null, value: topic ? { title: topic.title, slug: topic.slug, description: topic.description, objectivesText: topic.objectives.join("\n"), order: topic.order, linkTitle: resource?.title || "", linkDescription: resource?.description || "", linkType: resource?.type || "VIDEO", linkUrl: resource?.externalUrl || "", durationMinutes: Math.round((resource?.durationSeconds || 0) / 60) } : { ...blankTopic, order: chapter.topics.length } });
  }
  function openResource(topic: Topic, resource?: Resource) {
    setResourceEditor({ topicId: topic.id, resourceId: resource?.id || null, value: resource ? { title: resource.title, description: resource.description, type: resource.type, externalUrl: resource.externalUrl, durationMinutes: Math.round((resource.durationSeconds || 0) / 60) } : blankResource });
  }

  const labelStyle = { display: "block", fontWeight: 600, fontSize: 14 } as const;
  const field = (label: string, value: string | number, onChange: (value: string) => void, props: InputHTMLAttributes<HTMLInputElement> = {}) => <label style={labelStyle}>{label}<input className="search" style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} {...props}/></label>;
  const textarea = (label: string, value: string, onChange: (value: string) => void, placeholder = "") => <label style={labelStyle}>{label}<textarea className="search" style={{ ...inputStyle, minHeight: 94, resize: "vertical" }} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/></label>;
  const select = (label: string, value: string, onChange: (value: string) => void, options: [string, string][]) => <label style={labelStyle}>{label}<select className="search" style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
  const formGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 16, marginTop: 20 } as const;
  const actionRow = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } as const;
  const cardStyle = { border: "1px solid var(--bd)", background: "var(--s2)", borderRadius: 14, padding: 20, marginTop: 16 } as const;

  return <main className="wrap section" style={{ minHeight: "100vh" }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 38 }}>
      <Link className="brand" href="/">Up<b style={{ color: "var(--lime)" }}>Shift</b> <span className="muted" style={{ fontSize: 15 }}>Admin</span></Link>
      {admin && <div style={actionRow}><span className="muted">{admin.email}</span><button className="btn" onClick={() => void logout()}>Sign out</button></div>}
    </header>
    {!admin ? <section className="note" style={{ maxWidth: 460, margin: "7vh auto" }}>
      <div className="eyebrow">Administrator access</div><h1>Sign in to UpShift</h1><p className="muted">Use the admin account configured for this installation.</p>
      <form onSubmit={login} style={{ display: "grid", gap: 14 }}>
        {field("Email", email, setEmail, { type: "email", autoComplete: "username", required: true })}
        {field("Password", password, setPassword, { type: "password", autoComplete: "current-password", required: true })}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>{error && <p role="alert" style={{ color: "#ffb4a8" }}>{error}</p>}
    </section> : <>
      <div className="eyebrow">Course workspace</div>
      <h1 style={{ fontSize: "clamp(34px,5vw,48px)", margin: "8px 0" }}>{selected ? selected.title : "Learning platform"}</h1>
      <p className="muted" style={{ marginTop: 0 }}>{selected ? "Build the chapter outline first, then add topics and links inside each chapter." : "Create courses, lay out chapters, then add topics and their learning links."}</p>
      {error && <div role="alert" className="notice" style={{ borderColor: "#b46363", margin: "18px 0", color: "#ffb4a8" }}>{error}</div>}
      {notice && <div role="status" className="notice" style={{ borderColor: "var(--lime)", margin: "18px 0" }}>{notice}</div>}
      {!selected ? <>
        {metrics && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, margin: "24px 0 40px" }}>
          {[["Courses", metrics.courses], ["Published", metrics.publishedCourses], ["Drafts", metrics.draftCourses], ["Chapters", metrics.chapters], ["Topics", metrics.topics], ["Links", metrics.resources]].map(([name, count]) => <div className="note" key={String(name)}><div className="muted">{name}</div><strong style={{ fontSize: 25 }}>{count}</strong></div>)}
        </div>}
        <section className="note" style={{ margin: "-20px 0 36px" }}>
          <div className="eyebrow">Homepage feature</div><h2 style={{ margin: "6px 0" }}>Featured YouTube playlist</h2>
          <p className="muted">Add up to 3 HTTPS YouTube video links. They play in order in the homepage player and loop continuously. Leave the list empty to hide the player.</p>
          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {homepageVideoUrls.map((url, index) => <div key={index} style={{ ...actionRow, alignItems: "end" }}>
              <label style={{ ...labelStyle, flex: "1 1 360px" }}>Video {index + 1}<input className="search" style={inputStyle} type="url" required value={url} onChange={event => setHomepageVideoUrls(current => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="https://youtu.be/..." /></label>
              <button type="button" className="btn" onClick={() => setHomepageVideoUrls(current => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove video ${index + 1}`}>Remove</button>
            </div>)}
            {homepageVideoUrls.length < 3 && <div style={{ ...actionRow, alignItems: "end" }}>
              <label style={{ ...labelStyle, flex: "1 1 360px" }}>Add video link<input className="search" style={inputStyle} type="url" value={newHomepageVideoUrl} onChange={event => setNewHomepageVideoUrl(event.target.value)} placeholder="https://youtu.be/..." /></label>
              <button type="button" className="btn" disabled={!newHomepageVideoUrl.trim()} onClick={() => { setHomepageVideoUrls(current => [...current, newHomepageVideoUrl.trim()]); setNewHomepageVideoUrl(""); }}>Add video</button>
            </div>}
            <div><button className="btn btn-primary" disabled={busy} onClick={() => void saveHomepageVideos()}>{busy ? "Saving…" : "Save playlist"}</button><span className="muted" style={{ marginLeft: 12, fontSize: 13 }}>{homepageVideoUrls.length}/3 videos</span></div>
          </div>
        </section>
        <PathwaysManager />
        {metrics && <section className="note traffic-dashboard" style={{ margin: "20px 0 36px" }}>
          <div className="traffic-dashboard-heading"><div><div className="eyebrow">Audience</div><h2 style={{ margin: "4px 0 6px" }}>Site traffic</h2><p className="muted">A quick read on your learning community and what they explore.</p></div><span className="traffic-definition">Page visits count each visitor once per page, per day.</span></div>
          <div className="traffic-kpis">
            {[ ["Today", metrics.traffic.todayPageViews], ["Last 7 days", metrics.traffic.last7Days], ["All time", metrics.traffic.totalPageViews] ].map(([label, count], index) => <div className={`traffic-kpi traffic-kpi-${index + 1}`} key={String(label)}><span>{label}</span><strong>{Number(count).toLocaleString()}</strong><small>page visits</small></div>)}
          </div>
          <div className="traffic-main-grid"><DailyTrafficChart rows={metrics.traffic.dailyViews}/>
            <section className="popular-pages"><div><h3>Popular pages</h3><p className="muted">All-time page visits</p></div>{metrics.traffic.topPages.length ? <ol>{metrics.traffic.topPages.map((row, index) => { const max = metrics.traffic.topPages[0]?.count || 1; const percent = Math.max(4, (row.count / max) * 100); return <li key={row.path}><div className="popular-page-label"><span><i>{String(index + 1).padStart(2, "0")}</i>{row.path === "/" ? "Home" : row.path}</span><strong>{row.count}</strong></div><div className="popular-page-track"><span style={{ width: `${percent}%` }}/></div></li>; })}</ol> : <p className="muted">Page visits will appear here as learners explore.</p>}</section>
          </div>
          <section className="course-activity"><div className="course-activity-heading"><div><h3>Course engagement</h3><p className="muted">Which published courses are attracting learners?</p></div><span className="course-activity-legend"><i/> Views <i className="likes-key"/> Likes</span></div>
            {courses.filter(course => course.status === "PUBLISHED").sort((a, b) => b.viewCount - a.viewCount).slice(0, 4).length ? <div className="course-activity-list">{courses.filter(course => course.status === "PUBLISHED").sort((a, b) => b.viewCount - a.viewCount).slice(0, 4).map((course, index, ranked) => { const max = ranked[0]?.viewCount || 1; const width = Math.max(course.viewCount ? 5 : 0, (course.viewCount / max) * 100); return <div className="course-activity-row" key={course.id}><span className="course-activity-rank">{String(index + 1).padStart(2, "0")}</span><div className="course-activity-info"><div className="course-activity-label"><strong>{course.title}</strong><span>{course.viewCount.toLocaleString()} views <b>·</b> {course.likeCount.toLocaleString()} likes</span></div><div className="course-activity-track"><span style={{ width: `${width}%` }}/></div></div></div>; })}</div> : <p className="muted">Publish a course to start seeing its views and likes here.</p>}
          </section>
          <p className="traffic-footnote">These counts are page visits, not total people. A learner can visit several pages in one day.</p>
        </section>}
        <div style={{ ...actionRow, justifyContent: "space-between" }}><h2 style={{ margin: 0 }}>Your courses</h2><button className="btn btn-primary" onClick={() => { setCourseDraft(blankCourse); setCourseEditor("new"); setError(""); setNotice(""); }}>Create a course</button></div>
        {courseEditor === "new" && <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Course details</h3><p className="muted">This creates a private draft. You can add the chapter skeleton right after saving.</p>
          <form onSubmit={saveCourse}>
            <div style={formGrid}>
              {field("Course title", courseDraft.title, (v) => setCourseDraft({ ...courseDraft, title: v, slug: courseDraft.slug ? courseDraft.slug : slugify(v) }), { required: true, minLength: 2, maxLength: 120, placeholder: "Emotional Intelligence" })}
              {field("Short name / URL", courseDraft.slug, (v) => setCourseDraft({ ...courseDraft, slug: slugify(v) }), { required: true, pattern: "[a-z0-9]+(?:-[a-z0-9]+)*", placeholder: "emotional-intelligence" })}
              {field("Category", courseDraft.category, (v) => setCourseDraft({ ...courseDraft, category: v }), { required: true, minLength: 2, placeholder: "Self improvement" })}
              {field("Estimated course time (minutes)", courseDraft.estimatedMinutes, (v) => setCourseDraft({ ...courseDraft, estimatedMinutes: Number(v) }), { type: "number", min: 0 })}
              {select("Difficulty", courseDraft.difficulty, (v) => setCourseDraft({ ...courseDraft, difficulty: v }), [["BEGINNER", "Beginner"], ["INTERMEDIATE", "Intermediate"], ["ADVANCED", "Advanced"]])}
              {field("Audience", courseDraft.audience, (v) => setCourseDraft({ ...courseDraft, audience: v }), { placeholder: "Who this course is for" })}
              <div style={{ gridColumn: "1 / -1" }}>{field("Course cover image URL (optional)", courseDraft.thumbnailUrl, (v) => setCourseDraft({ ...courseDraft, thumbnailUrl: v }), { type: "url", placeholder: "https://image-host.com/course-cover.jpg" })}<span className="muted" style={{ fontSize: 13 }}>Paste a public HTTPS image link from your image host.</span>{courseDraft.thumbnailUrl && <img src={courseDraft.thumbnailUrl} alt="Course cover preview" style={{ width: 220, maxWidth: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 10, marginTop: 10 }} />}</div>
              <div style={{ gridColumn: "1 / -1" }}>{field("Short description (at least 10 characters)", courseDraft.shortDescription, (v) => setCourseDraft({ ...courseDraft, shortDescription: v }), { required: true, minLength: 10, maxLength: 280, placeholder: "A short summary shown on the course card" })}</div>
              <div style={{ gridColumn: "1 / -1" }}>{textarea("Course overview", courseDraft.description, (v) => setCourseDraft({ ...courseDraft, description: v }), "What learners will learn in this course")}</div>
              <div style={{ gridColumn: "1 / -1" }}>{textarea("Learning objectives (one per line)", courseDraft.objectivesText, (v) => setCourseDraft({ ...courseDraft, objectivesText: v }), "Understand…\nPractice…")}</div>
            </div>
            <div style={{ ...actionRow, marginTop: 18 }}><button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save course and build chapters"}</button><button type="button" className="btn" onClick={() => setCourseEditor(null)}>Cancel</button></div>
          </form>
        </section>}
        {courses.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16, marginTop: 20 }}>
          {courses.map((course) => <article key={course.id} style={{ ...cardStyle, margin: 0 }}>
            <div style={{ ...actionRow, justifyContent: "space-between" }}><span className="pill">{course.status === "PUBLISHED" ? "Published" : "Draft"}</span><span className="muted">{course.category}</span></div>
            {course.thumbnailUrl && <img src={course.thumbnailUrl} alt={`${course.title} cover`} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 10, marginTop: 14 }} />}
            <h3 style={{ margin: "16px 0 7px" }}>{course.title}</h3><p className="muted">{course.shortDescription}</p>
            <p className="muted" style={{ fontSize: 14 }}>{course._count?.chapters ?? 0} chapters · {course.viewCount.toLocaleString()} views · {course.likeCount.toLocaleString()} likes</p>
            <button className="btn btn-primary" onClick={() => { setError(""); setNotice(""); void loadCourse(course.id); }}>Manage course</button>
            <button className="btn" style={{ marginLeft: 8 }} onClick={() => void remove(`/admin/courses/${course.id}`, "course")}>Delete</button>
          </article>)}
        </div> : !courseEditor && <div className="notice" style={{ marginTop: 20 }}>No courses yet. Start by creating a course draft.</div>}
      </> : <>
        <div style={{ ...actionRow, margin: "20px 0" }}><button className="btn" onClick={() => { setSelected(null); setCourseEditor(null); setChapterEditor(null); setTopicEditor(null); setResourceEditor(null); setError(""); setNotice(""); void loadOverview(); }}>← All courses</button><span className="pill">{selected.status === "PUBLISHED" ? "Published" : "Draft"}</span><span className="muted">{selected.viewCount.toLocaleString()} views · {selected.likeCount.toLocaleString()} likes</span><button className="btn" onClick={() => { setCourseDraft(fromCourse(selected)); setCourseEditor(courseEditor === "edit" ? null : "edit"); }}>Edit course details</button>{selected.status === "DRAFT" && selected.chapters?.length ? <button className="btn" disabled={busy} onClick={() => void publishCurriculum()}>Mark curriculum published</button> : null}<button className="btn btn-primary" disabled={busy} onClick={() => void changeCourseStatus()}>{selected.status === "PUBLISHED" ? "Move to drafts" : "Publish course"}</button><button className="btn" onClick={() => void remove(`/admin/courses/${selected.id}`, "course")}>Delete course</button></div>
        {courseEditor === "edit" && <section style={cardStyle}><h3 style={{ marginTop: 0 }}>Edit course details</h3><form onSubmit={saveCourse}><div style={formGrid}>
          {field("Course title", courseDraft.title, (v) => setCourseDraft({ ...courseDraft, title: v }), { required: true, minLength: 2, maxLength: 120 })}
          {field("Short name / URL", courseDraft.slug, (v) => setCourseDraft({ ...courseDraft, slug: slugify(v) }), { required: true, pattern: "[a-z0-9]+(?:-[a-z0-9]+)*" })}
          {field("Category", courseDraft.category, (v) => setCourseDraft({ ...courseDraft, category: v }), { required: true, minLength: 2 })}
          {field("Estimated course time (minutes)", courseDraft.estimatedMinutes, (v) => setCourseDraft({ ...courseDraft, estimatedMinutes: Number(v) }), { type: "number", min: 0 })}
          {select("Difficulty", courseDraft.difficulty, (v) => setCourseDraft({ ...courseDraft, difficulty: v }), [["BEGINNER", "Beginner"], ["INTERMEDIATE", "Intermediate"], ["ADVANCED", "Advanced"]])}
          {field("Audience", courseDraft.audience, (v) => setCourseDraft({ ...courseDraft, audience: v }))}
          <div style={{ gridColumn: "1 / -1" }}>{field("Course cover image URL (optional)", courseDraft.thumbnailUrl, (v) => setCourseDraft({ ...courseDraft, thumbnailUrl: v }), { type: "url", placeholder: "https://image-host.com/course-cover.jpg" })}<span className="muted" style={{ fontSize: 13 }}>Paste a public HTTPS image link from your image host.</span>{courseDraft.thumbnailUrl && <img src={courseDraft.thumbnailUrl} alt="Course cover preview" style={{ width: 220, maxWidth: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 10, marginTop: 10 }} />}</div>
          <div style={{ gridColumn: "1 / -1" }}>{field("Short description (at least 10 characters)", courseDraft.shortDescription, (v) => setCourseDraft({ ...courseDraft, shortDescription: v }), { required: true, minLength: 10, maxLength: 280 })}</div>
          <div style={{ gridColumn: "1 / -1" }}>{textarea("Course overview", courseDraft.description, (v) => setCourseDraft({ ...courseDraft, description: v }))}</div>
          <div style={{ gridColumn: "1 / -1" }}>{textarea("Learning objectives (one per line)", courseDraft.objectivesText, (v) => setCourseDraft({ ...courseDraft, objectivesText: v }))}</div>
        </div><div style={{ ...actionRow, marginTop: 18 }}><button className="btn btn-primary" disabled={busy}>Save course details</button><button type="button" className="btn" onClick={() => setCourseEditor(null)}>Cancel</button></div></form></section>}
        <section style={{ marginTop: 36 }}>
          <div style={{ ...actionRow, justifyContent: "space-between" }}><div><div className="eyebrow">Step 1</div><h2 style={{ margin: "5px 0" }}>Chapter outline</h2><p className="muted" style={{ margin: 0 }}>Add the chapter skeleton first. Open each chapter to build its topics.</p></div><button className="btn btn-primary" onClick={() => openChapter()}>+ Add chapter</button></div>
          {!selected.chapters?.length && <section className="note" style={{ marginTop: 18 }}>
            <h3 style={{ marginTop: 0 }}>Or import the outline from Word</h3>
            <p className="muted">Choose a .docx file with a table containing Chapter, Topic, and Source/Link columns. Duration is optional. This reads the table in your browser; descriptions stay blank, and everything is created as a draft.</p>
            <label style={{ display: "block", maxWidth: 560 }}>Word document<input style={inputStyle} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={busy} onChange={(event) => void readOutline(event.target.files?.[0])} /></label>
            {outlineFileName && <div className="muted" style={{ marginTop: 12 }}>Ready to import: {outlineFileName}</div>}
            {outlinePreview && <div style={{ ...actionRow, marginTop: 14 }}><button className="btn btn-primary" disabled={busy} onClick={() => void importOutline()}>{busy ? "Importing…" : "Import chapters and topics"}</button><button className="btn" disabled={busy} onClick={() => { setOutlinePreview(null); setOutlineFileName(""); }}>Clear selection</button></div>}
          </section>}
          {chapterEditor?.chapterId === null && <section style={cardStyle}><h3 style={{ marginTop: 0 }}>New chapter</h3><form onSubmit={saveChapter}><div style={formGrid}>
            {field("Chapter title", chapterEditor.value.title, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, title: v, slug: chapterEditor.value.slug ? chapterEditor.value.slug : slugify(v) } }), { required: true, minLength: 2, placeholder: "Chapter 1 — Foundations" })}
            {field("Short name / URL", chapterEditor.value.slug, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, slug: slugify(v) } }), { required: true, placeholder: "foundations" })}
            {field("Position", chapterEditor.value.order + 1, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, order: Math.max(0, Number(v) - 1) } }), { type: "number", min: 1 })}
            <div style={{ gridColumn: "1 / -1" }}>{textarea("Chapter summary", chapterEditor.value.description, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, description: v } }))}</div>
          </div><div style={{ ...actionRow, marginTop: 16 }}><button className="btn btn-primary" disabled={busy}>Save chapter</button><button type="button" className="btn" onClick={() => setChapterEditor(null)}>Cancel</button></div></form></section>}
          {!selected.chapters?.length && <div className="notice" style={{ marginTop: 16 }}>No chapters yet. Add the full chapter outline before filling in topics.</div>}
          {selected.chapters?.map((chapter) => <article key={chapter.id} style={cardStyle}>
            <div style={{ ...actionRow, justifyContent: "space-between" }}><div><span className="eyebrow">Chapter {chapter.order + 1}</span><h3 style={{ margin: "4px 0" }}>{chapter.title}</h3><p className="muted" style={{ margin: 0 }}>{chapter.description || chapter.slug}</p><p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>{chapter.viewCount.toLocaleString()} views · {chapter.likeCount.toLocaleString()} likes</p></div><div style={actionRow}><button className="btn" onClick={() => openChapter(chapter)}>Edit chapter</button><button className="btn" onClick={() => void remove(`/admin/chapters/${chapter.id}`, "chapter")}>Delete</button></div></div>
            {chapterEditor?.chapterId === chapter.id && <form onSubmit={saveChapter} style={{ ...cardStyle, margin: "18px 0 0" }}><div style={formGrid}>
              {field("Chapter title", chapterEditor.value.title, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, title: v } }), { required: true, minLength: 2 })}
              {field("Short name / URL", chapterEditor.value.slug, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, slug: slugify(v) } }), { required: true })}
              {field("Position", chapterEditor.value.order + 1, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, order: Math.max(0, Number(v) - 1) } }), { type: "number", min: 1 })}
              <div style={{ gridColumn: "1 / -1" }}>{textarea("Chapter summary", chapterEditor.value.description, (v) => setChapterEditor({ ...chapterEditor, value: { ...chapterEditor.value, description: v } }))}</div>
            </div><div style={{ ...actionRow, marginTop: 16 }}><button className="btn btn-primary" disabled={busy}>Save changes</button><button type="button" className="btn" onClick={() => setChapterEditor(null)}>Cancel</button></div></form>}
            <div style={{ borderTop: "1px solid var(--bd)", marginTop: 20, paddingTop: 18 }}>
              <div style={{ ...actionRow, justifyContent: "space-between" }}><div><div className="eyebrow">Step 2</div><h4 style={{ margin: "4px 0" }}>Topics · {chapter.topics.length}</h4></div><button className="btn" onClick={() => openTopic(chapter)}>+ Add topic</button></div>
              {chapter.topics.map((topic) => <section key={topic.id} style={{ borderLeft: "3px solid var(--lime)", padding: "4px 0 4px 16px", margin: "18px 0" }}>
                <div style={{ ...actionRow, justifyContent: "space-between" }}><div><strong>{chapter.order + 1}.{topic.order + 1} {topic.title}</strong><div className="muted">{topic.slug}</div></div><div style={actionRow}><button className="btn" onClick={() => openTopic(chapter, topic)}>Edit topic</button><button className="btn" onClick={() => void remove(`/admin/topics/${topic.id}`, "topic")}>Delete</button></div></div>
                {topic.description && <p className="muted" style={{ margin: "8px 0" }}>{topic.description}</p>}
                {topic.objectives?.length > 0 && <ul className="muted">{topic.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>}
                {topicEditor?.topicId === topic.id && <form onSubmit={saveTopic} style={{ ...cardStyle, margin: "14px 0" }}>
                  <h4 style={{ marginTop: 0 }}>Edit topic and first learning link</h4><div style={formGrid}>
                    {field("Topic title", topicEditor.value.title, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, title: v } }), { required: true, minLength: 2 })}
                    {field("Short name / URL", topicEditor.value.slug, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, slug: slugify(v) } }), { required: true })}
                    {field("Position", topicEditor.value.order + 1, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, order: Math.max(0, Number(v) - 1) } }), { type: "number", min: 1 })}
                    <div style={{ gridColumn: "1 / -1" }}>{textarea("Topic description", topicEditor.value.description, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, description: v } }))}</div>
                    <div style={{ gridColumn: "1 / -1" }}>{textarea("Topic objectives (one per line)", topicEditor.value.objectivesText, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, objectivesText: v } }))}</div>
                    <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><div className="eyebrow">Learning link</div></div>
                    {field("Link title", topicEditor.value.linkTitle, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkTitle: v } }), { placeholder: "Watch, read, or open this resource" })}
                    {select("Link type", topicEditor.value.linkType, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkType: v as ResourceType } }), [["VIDEO", "Video"], ["ARTICLE", "Article"], ["LINK", "Other link"]])}
                    <div style={{ gridColumn: "1 / -1" }}>{field("Course / learning link URL", topicEditor.value.linkUrl, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkUrl: v } }), { type: "url", placeholder: "https://…" })}</div>
                    {field("Link description", topicEditor.value.linkDescription, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkDescription: v } }))}
                    {field("Video length (minutes)", topicEditor.value.durationMinutes, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, durationMinutes: Number(v) } }), { type: "number", min: 0 })}
                  </div><div style={{ ...actionRow, marginTop: 16 }}><button className="btn btn-primary" disabled={busy}>Save topic</button><button type="button" className="btn" onClick={() => setTopicEditor(null)}>Cancel</button></div>
                </form>}
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>{topic.resources.map((resource) => <div key={resource.id} className="notice" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between", padding: 12 }}>
                  <div><span className="pill">{resource.type.toLowerCase()}</span> <a href={resource.externalUrl} target="_blank" rel="noreferrer" style={{ color: "var(--lime)", textDecoration: "underline" }}>{resource.title}</a><div className="muted" style={{ fontSize: 13 }}>{resource.description}</div></div>
                  <div style={actionRow}><button className="btn" onClick={() => openResource(topic, resource)}>Edit link</button><button className="btn" onClick={() => void remove(`/admin/resources/${resource.id}`, "learning link")}>Delete</button></div>
                </div>)}</div>
                {resourceEditor?.topicId === topic.id && <form onSubmit={saveResource} style={{ ...cardStyle, margin: "12px 0", padding: 16 }}><h4 style={{ marginTop: 0 }}>{resourceEditor.resourceId ? "Edit learning link" : "Add another learning link"}</h4><div style={formGrid}>
                  {field("Link title", resourceEditor.value.title, (v) => setResourceEditor({ ...resourceEditor, value: { ...resourceEditor.value, title: v } }), { required: true, minLength: 2 })}
                  {select("Link type", resourceEditor.value.type, (v) => setResourceEditor({ ...resourceEditor, value: { ...resourceEditor.value, type: v as ResourceType } }), [["VIDEO", "Video"], ["ARTICLE", "Article"], ["LINK", "Other link"]])}
                  <div style={{ gridColumn: "1 / -1" }}>{field("Link URL", resourceEditor.value.externalUrl, (v) => setResourceEditor({ ...resourceEditor, value: { ...resourceEditor.value, externalUrl: v } }), { required: true, type: "url", placeholder: "https://…" })}</div>
                  {field("Description", resourceEditor.value.description, (v) => setResourceEditor({ ...resourceEditor, value: { ...resourceEditor.value, description: v } }))}
                  {field("Video length (minutes)", resourceEditor.value.durationMinutes, (v) => setResourceEditor({ ...resourceEditor, value: { ...resourceEditor.value, durationMinutes: Number(v) } }), { type: "number", min: 0 })}
                </div><div style={{ ...actionRow, marginTop: 14 }}><button className="btn btn-primary" disabled={busy}>Save link</button><button className="btn" type="button" onClick={() => setResourceEditor(null)}>Cancel</button></div></form>}
                <button className="btn" style={{ marginTop: 10 }} onClick={() => openResource(topic)}>+ Add another link</button>
              </section>)}
              {topicEditor?.chapterId === chapter.id && topicEditor.topicId === null && <form onSubmit={saveTopic} style={{ ...cardStyle, margin: "14px 0" }}>
                <h4 style={{ marginTop: 0 }}>New topic and learning link</h4><p className="muted">The short name is used in the topic URL. Add the link now or return to the topic to add it later.</p><div style={formGrid}>
                  {field("Topic title", topicEditor.value.title, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, title: v, slug: topicEditor.value.slug ? topicEditor.value.slug : slugify(v) } }), { required: true, minLength: 2, placeholder: "Recognizing emotions" })}
                  {field("Short name / URL", topicEditor.value.slug, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, slug: slugify(v) } }), { required: true, placeholder: "recognizing-emotions" })}
                  {field("Position", topicEditor.value.order + 1, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, order: Math.max(0, Number(v) - 1) } }), { type: "number", min: 1 })}
                  <div style={{ gridColumn: "1 / -1" }}>{textarea("Topic description", topicEditor.value.description, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, description: v } }))}</div>
                  <div style={{ gridColumn: "1 / -1" }}>{textarea("Topic objectives (one per line)", topicEditor.value.objectivesText, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, objectivesText: v } }))}</div>
                  <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--bd)", paddingTop: 16 }}><div className="eyebrow">Learning link</div></div>
                  {field("Link title", topicEditor.value.linkTitle, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkTitle: v } }), { placeholder: "Watch, read, or open this resource" })}
                  {select("Link type", topicEditor.value.linkType, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkType: v as ResourceType } }), [["VIDEO", "Video"], ["ARTICLE", "Article"], ["LINK", "Other link"]])}
                  <div style={{ gridColumn: "1 / -1" }}>{field("Course / learning link URL", topicEditor.value.linkUrl, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkUrl: v } }), { type: "url", placeholder: "https://…" })}</div>
                  {field("Link description", topicEditor.value.linkDescription, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, linkDescription: v } }))}
                  {field("Video length (minutes)", topicEditor.value.durationMinutes, (v) => setTopicEditor({ ...topicEditor, value: { ...topicEditor.value, durationMinutes: Number(v) } }), { type: "number", min: 0 })}
                </div><div style={{ ...actionRow, marginTop: 16 }}><button className="btn btn-primary" disabled={busy}>Save topic</button><button type="button" className="btn" onClick={() => setTopicEditor(null)}>Cancel</button></div>
              </form>}
            </div>
          </article>)}
        </section>
      </>}
    </>}
  </main>;
}
