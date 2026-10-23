"use client";

import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { usePathname } from "next/navigation";

const api = "/api/v1";

function visitorId() {
  try {
    const key = "upshift_visitor_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const id = window.crypto.randomUUID();
    window.localStorage.setItem(key, id);
    return id;
  } catch {
    return null;
  }
}

type Engagement = { viewCount: number; likeCount: number; liked: boolean };

export function CourseEngagement({ slug, views: initialViews, likes: initialLikes }: { slug: string; views: number; likes: number }) {
  const [stats, setStats] = useState<Engagement>({ viewCount: initialViews, likeCount: initialLikes, liked: false });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = visitorId();
    if (!id) return;
    let active = true;
    void fetch(`${api}/analytics/page-view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: id, path: window.location.pathname, courseSlug: slug }), keepalive: true })
      .then((response) => response.ok ? response.json() : null)
      .then((data: Engagement | null) => { if (active && data) { setStats(data); setReady(true); } })
      .catch(() => undefined);
    return () => { active = false; };
  }, [slug]);

  async function toggleLike() {
    const id = visitorId();
    if (!id || busy) return;
    setBusy(true);
    try {
      const response = await fetch(`${api}/courses/${encodeURIComponent(slug)}/like`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: id }) });
      if (response.ok) {
        const updated: Engagement = await response.json();
        setStats((current) => ({ ...current, ...updated }));
      }
    } finally { setBusy(false); }
  }

  return <div aria-label="Course engagement" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
    <span className="muted">{stats.viewCount.toLocaleString()} views</span>
    <button className="btn" type="button" onClick={() => void toggleLike()} disabled={busy} aria-pressed={stats.liked}>
      {stats.liked ? "♥ Liked" : "♡ Like"} · {stats.likeCount.toLocaleString()}
    </button>
    {!ready && <span className="muted" style={{ fontSize: 12 }}>Counts update as visitors arrive.</span>}
  </div>;
}

export function TrackedChapter({ chapterId, title, initialViews, initialLikes, defaultOpen, children }: { chapterId: string; title: string; initialViews: number; initialLikes: number; defaultOpen: boolean; children: ReactNode }) {
  const [stats, setStats] = useState<Engagement>({ viewCount: initialViews, likeCount: initialLikes, liked: false });
  const [busy, setBusy] = useState(false);
  const trackOnce = useRef(false);

  async function trackView() {
    if (trackOnce.current) return;
    const id = visitorId();
    if (!id) return;
    trackOnce.current = true;
    try {
      const response = await fetch(`${api}/analytics/chapter-view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: id, chapterId }), keepalive: true });
      if (response.ok) setStats(await response.json());
    } catch { trackOnce.current = false; }
  }

  useEffect(() => { if (defaultOpen) void trackView(); }, [defaultOpen]);

  function onToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    if (event.currentTarget.open) void trackView();
  }

  async function toggleLike(event: SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault(); event.stopPropagation();
    const id = visitorId();
    if (!id || busy) return;
    setBusy(true);
    try {
      const response = await fetch(`${api}/chapters/${encodeURIComponent(chapterId)}/like`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: id }) });
      if (response.ok) {
        const updated: Engagement = await response.json();
        setStats((current) => ({ ...current, ...updated }));
      }
    } finally { setBusy(false); }
  }

  return <details className="chapter" open={defaultOpen} onToggle={onToggle}>
    <summary><strong>{title}</strong><span className="muted" style={{ display: "block", fontSize: 13, fontWeight: 400, marginTop: 4 }}>{stats.viewCount.toLocaleString()} views · {stats.likeCount.toLocaleString()} likes</span></summary>
    <div style={{ display: "flex", justifyContent: "flex-end", margin: "8px 0 12px" }}>
      <button className="btn" type="button" onClick={(event) => void toggleLike(event)} disabled={busy} aria-pressed={stats.liked}>{stats.liked ? "♥ Liked" : "♡ Like"} · {stats.likeCount.toLocaleString()}</button>
    </div>
    {children}
  </details>;
}

export function SiteTrafficTracker() {
  // The course detail component records its own view so it can refresh the visible counter.
  const pathname = usePathname();
  useEffect(() => {
    const path = pathname;
    if (path === "/admin" || /^\/courses\/[^/]+$/.test(path)) return;
    const id = visitorId();
    if (!id) return;
    void fetch(`${api}/analytics/page-view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: id, path }), keepalive: true }).catch(() => undefined);
  }, [pathname]);
  return null;
}
