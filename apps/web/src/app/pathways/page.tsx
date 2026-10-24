import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import { pathways } from "@/lib/pathways";

export const metadata = { title: "Career pathways", description: "Explore visual learning roadmaps for personal growth, work, and career progress." };

export default function PathwaysPage() {
  return <>
    <header className="nav-shell"><div className="wrap nav"><Link className="brand" href="/">Up<b>Shift</b></Link><nav className="navlinks"><Link href="/courses">Explore courses</Link><Link href="/about">About</Link></nav></div></header>
    <main className="wrap pathway-page">
      <Link className="back-link" href="/"><ArrowLeft size={15}/> Home</Link>
      <div className="eyebrow">Career mind maps</div>
      <h1>Make your next move with a clear path.</h1>
      <p className="muted pathway-intro">Success looks different for everyone. Choose a direction to explore a practical roadmap, one connected step at a time.</p>
      <div className="pathway-grid">{pathways.map((pathway, index) => <Link className={`pathway-card pathway-${pathway.color}`} href={`/pathways/${pathway.slug}`} key={pathway.slug}>
        <span className="pathway-card-top"><span className="pathway-number">0{index + 1}</span><Compass size={19}/></span>
        <h2>{pathway.title}</h2><p>{pathway.short}</p>
        <span className="pathway-card-bottom">Open roadmap <ArrowUpRight size={16}/></span>
      </Link>)}</div>
      <div className="pathway-note"><span className="eyebrow">Small steps, meaningful direction</span><p>Each roadmap is a starting point. Follow the steps in order, explore what fits, and shape the journey around your own goals.</p></div>
    </main>
  </>;
}
