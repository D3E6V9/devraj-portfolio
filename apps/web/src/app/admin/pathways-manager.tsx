"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import type { CareerPathway, PathwayStep } from "@/lib/api";

const api = "/api/v1";
const blankStep: PathwayStep = { title: "", focus: "", action: "", courseSearch: "" };
type PathwayDraft = Omit<CareerPathway, "id">;
const blankPathway: PathwayDraft = { title: "", slug: "", short: "", description: "", outcome: "", color: "mint", order: 0, status: "DRAFT", steps: [{ ...blankStep }] };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${api}${path}`, { credentials: "include", ...init });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not save the pathway.");
  return data as T;
}
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function PathwaysManager() {
  const [rows, setRows] = useState<CareerPathway[]>([]);
  const [draft, setDraft] = useState<PathwayDraft>(blankPathway);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    try { const result = await request<{ items: CareerPathway[] }>("/admin/pathways"); setRows(result.items); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load pathways."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function startNew() { setEditingId(null); setDraft({ ...blankPathway, order: rows.length }); setEditorOpen(true); setError(""); setNotice(""); }
  function startEdit(pathway: CareerPathway) { setEditingId(pathway.id); setDraft({ ...pathway }); setEditorOpen(true); setError(""); setNotice(""); }
  function updateStep(index: number, field: keyof PathwayStep, value: string) {
    setDraft(current => ({ ...current, steps: current.steps.map((step, stepIndex) => stepIndex === index ? { ...step, [field]: value } : step) }));
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      await request<CareerPathway>(editingId ? `/admin/pathways/${editingId}` : "/admin/pathways", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      setNotice(editingId ? "Pathway updated. The public roadmap now reflects your changes." : "Pathway created. Publish it to show it in the career pathways section.");
      setEditingId(null); setDraft(blankPathway); setEditorOpen(false); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save the pathway."); }
    finally { setBusy(false); }
  }
  async function remove(pathway: CareerPathway) {
    if (!window.confirm(`Delete “${pathway.title}” and its roadmap? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try { await request(`/admin/pathways/${pathway.id}`, { method: "DELETE" }); if (editingId === pathway.id) { setEditingId(null); setDraft(blankPathway); setEditorOpen(false); } setNotice("Pathway deleted from the public site."); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete the pathway."); }
    finally { setBusy(false); }
  }
  function changeOrder(pathway: CareerPathway, direction: -1 | 1) {
    const sorted = [...rows].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(item => item.id === pathway.id);
    const other = sorted[index + direction];
    if (!other) return;
    void (async () => {
      setBusy(true); setError("");
      try {
        await request(`/admin/pathways/${pathway.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) });
        await request(`/admin/pathways/${other.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: pathway.order }) });
        await load();
      } catch (e) { setError(e instanceof Error ? e.message : "Could not reorder pathways."); }
      finally { setBusy(false); }
    })();
  }

  const inputClass = "search pathway-admin-input";
  const labelClass = "pathway-admin-label";
  const update = <K extends keyof PathwayDraft>(key: K, value: PathwayDraft[K]) => setDraft(current => ({ ...current, [key]: value }));
  return <section className="note pathway-admin">
    <div className="pathway-admin-heading"><div><div className="eyebrow">Public learning journeys</div><h2>Career pathways</h2><p className="muted">Create and arrange the roadmaps shown on the homepage and pathway pages. Drafts stay private until published.</p></div><button className="btn btn-primary" type="button" onClick={startNew}><Plus size={16}/> New pathway</button></div>
    {error && <div className="notice pathway-admin-message" role="alert">{error}</div>}{notice && <div className="notice pathway-admin-message" role="status">{notice}</div>}
    {loading ? <p className="muted">Loading pathways…</p> : rows.length === 0 ? <div className="pathway-admin-empty">No pathways yet. Create a roadmap to introduce an organized route for learners.</div> : <div className="pathway-admin-list">{[...rows].sort((a, b) => a.order - b.order).map((pathway, index, sorted) => <article className="pathway-admin-row" key={pathway.id}>
      <span className={`pathway-admin-swatch pathway-${pathway.color}`}/><div className="pathway-admin-info"><div className="pathway-admin-title"><strong>{pathway.title}</strong><span className={`pathway-admin-status ${pathway.status === "PUBLISHED" ? "is-published" : ""}`}>{pathway.status === "PUBLISHED" ? "Published" : "Draft"}</span></div><p>{pathway.short}</p><small>{pathway.steps.length} milestones · /pathways/{pathway.slug}</small></div>
      <div className="pathway-admin-actions"><button className="btn" type="button" title="Move up" aria-label={`Move ${pathway.title} up`} disabled={busy || index === 0} onClick={() => changeOrder(pathway, -1)}><ArrowUp size={15}/></button><button className="btn" type="button" title="Move down" aria-label={`Move ${pathway.title} down`} disabled={busy || index === sorted.length - 1} onClick={() => changeOrder(pathway, 1)}><ArrowDown size={15}/></button><button className="btn" type="button" onClick={() => startEdit(pathway)}>Edit</button><button className="btn pathway-delete" type="button" disabled={busy} onClick={() => void remove(pathway)}><Trash2 size={15}/><span className="sr-only">Delete {pathway.title}</span></button></div>
    </article>)}</div>}
    {editorOpen && <form className="pathway-editor" onSubmit={save}>
      <div className="pathway-editor-title"><div><span className="eyebrow">{editingId ? "Edit roadmap" : "New roadmap"}</span><h3>{editingId ? draft.title || "Update pathway" : "Build a career pathway"}</h3></div><button className="btn" type="button" onClick={() => { setEditingId(null); setDraft(blankPathway); setEditorOpen(false); }}>Cancel</button></div>
      <div className="pathway-form-grid">
        <label className={labelClass}>Pathway title<input className={inputClass} required minLength={2} maxLength={100} value={draft.title} placeholder="Personal mastery" onChange={event => setDraft(current => ({ ...current, title: event.target.value, slug: current.slug ? current.slug : slugify(event.target.value) }))}/></label>
        <label className={labelClass}>Page address<input className={inputClass} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} placeholder="personal-mastery" onChange={event => update("slug", slugify(event.target.value))}/></label>
        <label className={`${labelClass} pathway-form-wide`}>Short introduction<input className={inputClass} required minLength={10} maxLength={280} value={draft.short} placeholder="A one-sentence invitation shown on the pathway card" onChange={event => update("short", event.target.value)}/></label>
        <label className={`${labelClass} pathway-form-wide`}>Roadmap description<textarea className={inputClass} required minLength={10} maxLength={2000} rows={3} value={draft.description} placeholder="Explain what this pathway helps people work toward." onChange={event => update("description", event.target.value)}/></label>
        <label className={labelClass}>Success outcome<input className={inputClass} required minLength={5} maxLength={300} value={draft.outcome} placeholder="What learners can work toward" onChange={event => update("outcome", event.target.value)}/></label>
        <label className={labelClass}>Color theme<select className={inputClass} value={draft.color} onChange={event => update("color", event.target.value as PathwayDraft["color"])}><option value="mint">Mint</option><option value="violet">Violet</option><option value="blue">Blue</option><option value="lime">Lime</option></select></label>
        <label className={labelClass}>Visibility<select className={inputClass} value={draft.status} onChange={event => update("status", event.target.value as PathwayDraft["status"])}><option value="DRAFT">Draft · private</option><option value="PUBLISHED">Published · public</option></select></label>
        <label className={labelClass}>Display order<input className={inputClass} type="number" min={0} max={1000} value={draft.order} onChange={event => update("order", Number(event.target.value))}/></label>
      </div>
      <div className="pathway-step-editor-heading"><div><div className="eyebrow">Roadmap content</div><h4>Milestones · {draft.steps.length}</h4></div><button className="btn" type="button" disabled={draft.steps.length >= 30} onClick={() => update("steps", [...draft.steps, { ...blankStep }])}><Plus size={15}/> Add milestone</button></div>
      {draft.steps.map((step, index) => <fieldset className="pathway-step-editor" key={index}><legend>Step {String(index + 1).padStart(2, "0")}</legend>{draft.steps.length > 1 && <button className="pathway-step-remove" type="button" title="Remove milestone" aria-label={`Remove step ${index + 1}`} onClick={() => update("steps", draft.steps.filter((_, stepIndex) => stepIndex !== index))}><Trash2 size={15}/></button>}
        <div className="pathway-form-grid"><label className={labelClass}>Milestone name<input className={inputClass} required minLength={2} maxLength={120} value={step.title} placeholder="Know your patterns" onChange={event => updateStep(index, "title", event.target.value)}/></label><label className={labelClass}>Related course search<input className={inputClass} maxLength={100} value={step.courseSearch} placeholder="time management" onChange={event => updateStep(index, "courseSearch", event.target.value)}/></label><label className={`${labelClass} pathway-form-wide`}>What this step develops<textarea className={inputClass} required minLength={5} maxLength={500} rows={2} value={step.focus} placeholder="Explain the idea behind this step." onChange={event => updateStep(index, "focus", event.target.value)}/></label><label className={`${labelClass} pathway-form-wide`}>Practical action<textarea className={inputClass} required minLength={5} maxLength={500} rows={2} value={step.action} placeholder="Give the learner one useful action to try." onChange={event => updateStep(index, "action", event.target.value)}/></label></div>
      </fieldset>)}
      <div className="pathway-editor-footer"><span className="muted">Changes appear on the public pathway pages after saving.</span><button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : editingId ? "Save roadmap" : "Create roadmap"} <ArrowUpRight size={15}/></button></div>
    </form>}
  </section>;
}
