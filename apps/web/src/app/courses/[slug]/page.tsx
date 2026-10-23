import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/api";

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

function LearningResourceView({ resource }: { resource: LearningResource }) {
  const playable = resource.type === "VIDEO" ? getVideoEmbed(resource.externalUrl) : null;
  return (
    <div key={resource.id} style={{ marginTop: 12 }}>
      <strong>{resource.title}</strong>
      {resource.description && <p className="muted" style={{ margin: "4px 0 10px" }}>{resource.description}</p>}
      {playable?.kind === "file" ? (
        <video controls preload="metadata" src={playable.src} aria-label={resource.title} style={{ display: "block", width: "100%", maxHeight: 520, aspectRatio: "16 / 9", background: "#000", borderRadius: 12, marginTop: 10 }}>
          Your browser does not support inline video. <a href={resource.externalUrl}>Open the video</a>.
        </video>
      ) : playable?.kind === "embed" ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 12, background: "#000", marginTop: 10 }}>
          <iframe src={playable.src} title={resource.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
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
      <div className="curriculum"><div><h2>Course curriculum</h2>
        {c.chapters.map((ch, i) => <details className="chapter" key={ch.id} open={i === 0}>
          <summary><strong>Chapter {i + 1}: {ch.title}</strong></summary>
          <p className="muted">{ch.description}</p>
          {ch.topics.map(t => <section className="topic-link" key={t.id}>
            <strong>{t.title}</strong><p style={{ margin: "4px 0" }}>{t.description}</p>
            {t.resources.map(resource => <LearningResourceView key={resource.id} resource={resource} />)}
          </section>)}
        </details>)}
        {!c.chapters.length && <div className="notice">The curriculum is being prepared.</div>}
        {c.assessment && <section className="note" style={{ marginTop: 20 }}><h3>{c.assessment.title}</h3><p className="muted">{c.assessment.questions.length} questions · Pass with {c.assessment.passingPercent}%</p><Link className="btn btn-primary" href={`/courses/${c.slug}/assessment`}>Start final assessment</Link></section>}
      </div><aside className="note"><h3>What you will learn</h3><ul>{c.objectives.map(x => <li key={x}>{x}</li>)}</ul><h3>Who this is for</h3><p className="muted">{c.audience || "Curious learners"}</p>{c.assessment && <p className="tag">Final assessment · {c.assessment.questions.length} questions</p>}</aside></div>
    </main>
  </>;
}
