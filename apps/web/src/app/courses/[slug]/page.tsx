import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/api";
import { CourseEngagement, TrackedChapter } from "@/components/engagement";

type LearningResource = { id: string; title: string; description: string; type: string; externalUrl: string };

function getVideoEmbed(url: string): { kind: "embed" | "file"; src: string } | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const youtubeId = host === "youtu.be"
      ? parsed.pathname.split("/").filter(Boolean)[0]
      : (host === "youtube.com" || host.endsWith(".youtube.com"))
        ? parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]
        : null;
    if (youtubeId && /^[\w-]{6,}$/.test(youtubeId)) {
      return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${youtubeId}` };
    }
    if (host === "vimeo.com" && /^\/\d+/.test(parsed.pathname)) {
      return { kind: "embed", src: `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean)[0]}` };
    }
    if (host === "drive.google.com") {
      const driveId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
      if (driveId) return { kind: "embed", src: `https://drive.google.com/file/d/${driveId}/preview` };
    }
    if (/\.(mp4|webm|ogv)$/i.test(parsed.pathname)) return { kind: "file", src: url };
  } catch {
    return null;
  }
  return null;
}

function LearningResourceView({ resource, topicTitle }: { resource: LearningResource; topicTitle: string }) {
  const playable = resource.type === "VIDEO" ? getVideoEmbed(resource.externalUrl) : null;
  const resourceRepeatsTopic = resource.title.trim().toLocaleLowerCase() === topicTitle.trim().toLocaleLowerCase();
  const playerSrc = playable?.kind === "embed" && playable.src.startsWith("https://www.youtube-nocookie.com/")
    ? `${playable.src}?controls=1&rel=0&playsinline=1`
    : playable?.src;
  return (
    <div key={resource.id} style={{ marginTop: 12 }}>
      {!resourceRepeatsTopic && <strong>{resource.title}</strong>}
      {resource.description && <p className="muted" style={{ margin: "4px 0 10px" }}>{resource.description}</p>}
      {playable?.kind === "file" ? (
        <video controls preload="metadata" src={playable.src} aria-label={resource.title} style={{ display: "block", width: "100%", maxHeight: 520, aspectRatio: "16 / 9", background: "#000", borderRadius: 12, marginTop: 10 }}>
          Your browser does not support inline video. <a href={resource.externalUrl}>Open the video</a>.
        </video>
      ) : playable?.kind === "embed" ? (
        <div className="lesson-player" style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 12, background: "#000", marginTop: 10 }}>
          <iframe src={playerSrc} title={resource.title || topicTitle} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        </div>
      ) : (
        <a className="btn" href={resource.externalUrl} target="_blank" rel="noreferrer">{resource.type === "VIDEO" ? "Open video ↗" : "Open resource ↗"}</a>
      )}
    </div>
  );
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) notFound();

  return <>
    <header className="wrap nav"><Link className="brand" href="/">Up<b>Shift</b></Link><nav className="navlinks"><Link href="/courses">Course library</Link><Link href="/about">About</Link></nav></header>
    <main className="wrap course-detail">
      <p className="muted"><Link href="/courses">Courses</Link> / {c.title}</p>
      <span className="tag">{c.category} · {c.difficulty}</span>
      <h1 style={{ fontSize: "clamp(38px,6vw,62px)", maxWidth: 850, margin: "12px 0" }}>{c.title}</h1>
      <p className="muted" style={{ maxWidth: 700, fontSize: 18 }}>{c.description || c.shortDescription}</p>
      <p className="muted">{c.chapters.length} chapters · {c.estimatedMinutes} minutes · Free</p>
      {c.thumbnailUrl && <img src={c.thumbnailUrl} alt={`${c.title} course cover`} style={{ display: "block", width: "100%", maxHeight: 480, aspectRatio: "16 / 7", objectFit: "cover", borderRadius: 16, border: "1px solid var(--bd)" }} />}
      <CourseEngagement slug={c.slug} views={c.viewCount} likes={c.likeCount} />
      <div className="curriculum"><div><h2>Course map</h2><p className="muted course-map-hint">Open a chapter to explore its topic nodes. Select a topic to open its lesson.</p>
        {c.chapters.map((ch, i) => <TrackedChapter chapterId={ch.id} key={ch.id} defaultOpen={false} initialViews={ch.viewCount} initialLikes={ch.likeCount} title={`Chapter ${i + 1}: ${ch.title}`}>
          {ch.description && <p className="muted chapter-description">{ch.description}</p>}
          <div className="topic-map" aria-label={`Topics in ${ch.title}`}>
            {ch.topics.map((t, topicIndex) => <details className="topic-node" key={t.id}>
              <summary><span className="topic-node-index">{String(topicIndex + 1).padStart(2, "0")}</span><span className="topic-node-copy"><strong>{t.title}</strong><small>{t.resources.length} {t.resources.length === 1 ? "lesson" : "lessons"}</small></span><span className="topic-node-chevron" aria-hidden="true">+</span></summary>
              <div className="topic-node-content">{t.description && <p className="muted topic-description">{t.description}</p>}
                {t.resources.map(resource => <LearningResourceView key={resource.id} resource={resource} topicTitle={t.title} />)}
                {!t.resources.length && <p className="muted">Lesson resources are being prepared.</p>}
              </div>
            </details>)}
          </div>
        </TrackedChapter>)}
        {!c.chapters.length && <div className="notice">The curriculum is being prepared.</div>}
        {c.assessment && <section className="note" style={{ marginTop: 20 }}><h3>{c.assessment.title}</h3><p className="muted">{c.assessment.questions.length} questions · Pass with {c.assessment.passingPercent}%</p><Link className="btn btn-primary" href={`/courses/${c.slug}/assessment`}>Start final assessment</Link></section>}
      </div><aside className="note"><h3>What you will learn</h3><ul>{c.objectives.map(x => <li key={x}>{x}</li>)}</ul><h3>Who this is for</h3><p className="muted">{c.audience || "Curious learners"}</p>{c.assessment && <p className="tag">Final assessment · {c.assessment.questions.length} questions</p>}</aside></div>
    </main>
  </>;
}
