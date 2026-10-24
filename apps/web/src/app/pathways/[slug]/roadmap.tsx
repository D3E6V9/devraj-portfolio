"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Compass, Route, Sparkles } from "lucide-react";
import type { Course } from "@/lib/api";
import type { Pathway } from "@/lib/pathways";

export function Roadmap({ pathway, courses }: { pathway: Pathway; courses: Course[] }) {
  const [openStep, setOpenStep] = useState<number | null>(null);
  return <>
    <header className="nav-shell"><div className="wrap nav"><Link className="brand" href="/">Up<b>Shift</b></Link><nav className="navlinks"><Link href="/courses">Explore courses</Link><Link href="/pathways">All pathways</Link></nav></div></header>
    <main className={`wrap roadmap-page pathway-${pathway.color}`}>
      <Link className="back-link" href="/pathways"><ArrowLeft size={15}/> All pathways</Link>
      <section className="roadmap-heading">
        <span className="roadmap-mark"><Route size={23}/></span>
        <div><div className="eyebrow">Your roadmap</div><h1>{pathway.title}</h1><p className="muted">{pathway.description}</p></div>
      </section>
      <div className="roadmap-outcome"><Sparkles size={17}/><span><b>Where this can take you</b>{pathway.outcome}</span></div>
      <div className="roadmap-instruction"><span className="eyebrow">Follow the road</span><p>Choose any milestone to see what it means and take one practical action. Your progress can begin wherever you are.</p></div>
      <section className="roadmap-track" aria-label={`${pathway.title} milestones`}>
        <svg className="roadmap-road" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path className="road-base" d="M50 0 C50 75 50 90 50 125 C50 190 74 200 74 250 C74 310 26 320 26 375 C26 435 74 445 74 500 C74 560 26 570 26 625 C26 685 50 700 50 750 C50 820 50 875 50 1000"/><path className="road-glow" d="M50 0 C50 75 50 90 50 125 C50 190 74 200 74 250 C74 310 26 320 26 375 C26 435 74 445 74 500 C74 560 26 570 26 625 C26 685 50 700 50 750 C50 820 50 875 50 1000"/></svg>
        {pathway.steps.map((step, index) => {
          const isOpen = openStep === index;
          const terms = step.courseSearch.toLowerCase().split(/\s+/).filter((word) => word.length > 3);
          const matches = courses.filter((course) => terms.some((term) => `${course.title} ${course.category} ${course.shortDescription}`.toLowerCase().includes(term))).slice(0, 2);
          return <article className={`roadmap-stop stop-${index + 1} ${index % 2 ? "stop-right" : "stop-left"} ${isOpen ? "is-open" : ""}`} key={step.title}>
            <span className="roadmap-stop-dot" aria-hidden="true"><span>{isOpen ? <Check size={15}/> : `0${index + 1}`}</span></span>
            <button className="roadmap-stop-button" type="button" aria-expanded={isOpen} onClick={() => setOpenStep(isOpen ? null : index)}>
              <span className="roadmap-stop-copy"><small>STEP 0{index + 1}</small><strong>{step.title}</strong><span>{step.focus}</span></span><ChevronDown className="roadmap-chevron" size={18}/>
            </button>
            {isOpen && <div className="roadmap-step-detail"><div><span className="eyebrow">Try this next</span><p>{step.action}</p></div><div className="roadmap-related"><span className="eyebrow">Keep learning</span>{matches.length ? matches.map((course) => <Link href={`/courses/${course.slug}`} key={course.id}>{course.title}<ArrowUpRight size={14}/></Link>) : <Link href="/courses">Explore the course library<ArrowUpRight size={14}/></Link>}</div></div>}
          </article>;
        })}
      </section>
      <div className="roadmap-finish"><span className="roadmap-finish-icon"><Compass size={19}/></span><div><span className="eyebrow">Keep moving</span><h2>Your path grows as you do.</h2><p className="muted">Revisit your direction, explore new skills, and choose the next step that feels right.</p><Link className="btn btn-primary" href="/courses">Explore courses <ArrowUpRight size={16}/></Link></div></div>
    </main>
  </>;
}
