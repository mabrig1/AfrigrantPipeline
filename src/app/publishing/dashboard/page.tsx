'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ClipboardCheck, FileText, Search, ShieldCheck, Users, ArrowLeft, AlertTriangle } from 'lucide-react'

type Stage = 'All' | 'Submitted' | 'Screening' | 'Peer review' | 'Revision' | 'Accepted' | 'Published'
const stages: Stage[] = ['All','Submitted','Screening','Peer review','Revision','Accepted','Published']
const tools = [
  { title: 'Submission intake', description: 'Validate manuscript metadata and author details.', icon: FileText, status: 'Foundation ready' },
  { title: 'Citation verification', description: 'Crossref and OpenAlex resolution, source matching and audit.', icon: Search, status: 'Integration pending' },
  { title: 'Integrity screening', description: 'Ethics declarations, similarity evidence and editorial flags.', icon: ShieldCheck, status: 'Integration pending' },
  { title: 'Reviewer coordination', description: 'Conflict-aware suggestions and invitation tracking.', icon: Users, status: 'Integration pending' },
  { title: 'Editorial decisions', description: 'Human approval, revision requests and decision history.', icon: ClipboardCheck, status: 'Integration pending' },
  { title: 'Publication services', description: 'Approved metadata, repository deposits and DOI workflows.', icon: BookOpen, status: 'Integration pending' },
]
export default function PublishingDashboard() {
  const [stage, setStage] = useState<Stage>('All')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [author, setAuthor] = useState('')
  const [notice, setNotice] = useState('')
  const matches = useMemo(() => tools.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(query.toLowerCase())),[query])
  function validateDraft() {
    if (title.trim().length < 10 || abstract.trim().length < 100 || author.trim().length < 2) {
      setNotice('Please provide a title (10+ characters), abstract (100+ characters), and author name.')
      return
    }
    setNotice('Draft metadata validated locally. Submission is not saved: authenticated publishing API integration is still pending.')
  }
  return <main className="min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16}/> AfrigrantPipeline</Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">AfriPublish / Research infrastructure</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Publishing command centre</h1><p className="mt-3 max-w-2xl text-muted-foreground">Manage scholarly submissions, editorial screening, peer review and research dissemination from one workspace.</p></div>
        <button onClick={() => setShowForm(v=>!v)} className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">{showForm ? 'Close intake' : 'New manuscript'}</button>
      </div>
      <div className="mt-7 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm"><AlertTriangle className="mt-0.5 shrink-0 text-amber-400" size={18}/><p><strong>Development preview.</strong> Live submission metrics, user-specific records, review assignments and publishing actions are not connected yet. No sample figures are presented as real data.</p></div>
      {showForm && <section className="mt-6 rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Manuscript intake preview</h2><p className="mt-1 text-sm text-muted-foreground">Local validation only. Nothing is uploaded or published.</p><div className="mt-5 grid gap-4"><label className="text-sm">Title<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={300} className="mt-2 w-full rounded-lg border border-border bg-background p-3" placeholder="Research article title"/></label><label className="text-sm">Corresponding author<input value={author} onChange={e=>setAuthor(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background p-3" placeholder="Full name"/></label><label className="text-sm">Abstract<textarea value={abstract} onChange={e=>setAbstract(e.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-border bg-background p-3" placeholder="Paste the abstract"/></label><button onClick={validateDraft} className="w-fit rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Validate draft</button>{notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}</div></section>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Submissions','Awaiting integration'],['Editorial queue','Awaiting integration'],['Peer reviews','Awaiting integration'],['Published papers','Awaiting integration']].map(([name,value])=><div key={name} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{name}</p><p className="mt-3 text-lg font-semibold">{value}</p></div>)}</div>
      <section className="mt-9"><h2 className="text-xl font-bold">Publishing agents</h2><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{matches.map(item=><div key={item.title} className="rounded-2xl border border-border bg-card p-5"><item.icon className="text-primary" size={24}/><h3 className="mt-4 font-semibold">{item.title}</h3><p className="mt-2 min-h-12 text-sm text-muted-foreground">{item.description}</p><p className="mt-4 text-xs font-medium text-primary">{item.status}</p></div>)}</div></section>
      <section className="mt-9 rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Editorial pipeline</h2><p className="mt-1 text-sm text-muted-foreground">Filtering will apply to authenticated submissions when connected.</p></div><input aria-label="Search publishing agents" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search agents" className="rounded-lg border border-border bg-background px-4 py-2"/></div><div className="mt-5 flex flex-wrap gap-2">{stages.map(s=><button key={s} onClick={()=>setStage(s)} aria-pressed={stage===s} className={`rounded-full border px-4 py-2 text-sm ${stage===s?'border-primary bg-primary text-primary-foreground':'border-border text-muted-foreground'}`}>{s}</button>)}</div><div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center"><FileText className="mx-auto text-muted-foreground" size={32}/><p className="mt-3 font-medium">No live {stage==='All'?'submission':stage.toLowerCase()} records loaded</p><p className="mt-2 text-sm text-muted-foreground">Connect the protected publishing API to populate this queue.</p></div></section>
    </div>
  </main>
}
