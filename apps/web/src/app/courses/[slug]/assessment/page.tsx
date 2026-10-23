import Link from "next/link";
import { notFound } from "next/navigation";
import AssessmentClient from "../assessment-client";
import { apiBase } from "@/lib/api";
type Quiz={id:string;title:string;instructions:string;passingPercent:number;timeLimitMinutes:number|null;questions:{id:string;text:string;points:number;options:{id:string;text:string}[]}[]};
export default async function AssessmentPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;let quiz:Quiz|null=null;try{const r=await fetch(`${apiBase}/courses/${encodeURIComponent(slug)}/assessment`,{cache:"no-store"});if(r.ok)quiz=await r.json();else if(r.status!==404)throw new Error("Assessment service unavailable")}catch{}if(!quiz)notFound();return <><header className="wrap nav"><Link className="brand" href="/">Up<b>Shift</b></Link><nav className="navlinks"><Link href={`/courses/${slug}`}>Back to course</Link></nav></header><main className="wrap section" style={{maxWidth:800}}><p className="muted"><Link href={`/courses/${slug}`}>Course</Link> / Assessment</p><AssessmentClient quiz={quiz}/></main></>}
