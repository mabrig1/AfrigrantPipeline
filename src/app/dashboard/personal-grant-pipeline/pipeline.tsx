'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Loader2, Radar, Rocket, ShieldCheck, Sparkles } from 'lucide-react'

type PortfolioProject = {
  name: string
  url: string
  theme: string
  topic: string
  fundingAngle: string
}

type CaseSummary = {
  _id: string
  topic: string
  stage: string
  careerStage: string
  clientEmail: string
  updatedAt: string
}

const portfolio: PortfolioProject[] = [
  { name: 'ICT Pilot', url: 'https://ictpilot.mabrigkorie.org', theme: 'Digital inclusion', topic: 'Affordable digital skills, ICT access and practical technology adoption for underserved Nigerian communities', fundingAngle: 'Digital inclusion, youth skills, employability and community technology access' },
  { name: 'KnowledgeForge', url: 'https://knowledgeforge.mabrigkorie.org/admin', theme: 'AI & education', topic: 'Responsible agentic AI infrastructure for academics, scholars, students, authors and publishers in Africa', fundingAngle: 'AI for education, research capacity, responsible innovation and knowledge access' },
  { name: 'DDEI', url: 'https://ddei.online/', theme: 'Skills & jobs', topic: 'Digital skills training, employability pathways and practical AI upskilling for Nigerian learners', fundingAngle: 'Workforce development, youth employment, digital skills and inclusion' },
  { name: 'Academic Assistance', url: 'https://academic.mabrigkorie.org/', theme: 'Higher education', topic: 'Research and academic productivity infrastructure for Nigerian universities and postgraduate students', fundingAngle: 'Higher education innovation, research capacity and student success' },
  { name: 'Publisher', url: 'https://publisher.mabrigkorie.org/', theme: 'Publishing', topic: 'Digital publishing infrastructure that expands African authorship, scholarly communication and knowledge dissemination', fundingAngle: 'Creative economy, open knowledge, publishing innovation and African scholarship' },
  { name: 'Scholar', url: 'https://scholar.mabrigkorie.org/', theme: 'Research systems', topic: 'Research administration, lecturer workflow automation, student records and academic integrity systems for African institutions', fundingAngle: 'Research management, institutional capacity and digital transformation' },
  { name: 'Agridome', url: 'https://agridome.mabrigkorie.org/', theme: 'Agriculture', topic: 'Evidence-first urban and controlled-environment agriculture for resilient food production in Nigeria', fundingAngle: 'Food security, climate resilience, agritech and youth agriculture' },
  { name: 'AfriGrant Pipeline', url: 'https://www.afrigrantpipeline.com/', theme: 'Research funding', topic: 'AI-assisted grant intelligence, proposal development and partnership infrastructure for African researchers', fundingAngle: 'Research capacity, Africa-Europe collaboration and innovation ecosystems' },
  { name: 'Mabrig Research Institute', url: 'https://www.mabrigresearch.online/', theme: 'Research', topic: 'Applied interdisciplinary research, innovation translation and evidence generation for African development challenges', fundingAngle: 'Research grants, institutional partnerships and innovation translation' },
  { name: 'iJournal', url: 'https://www.ijournal.uk/', theme: 'Scholarly communication', topic: 'Accessible digital scholarly publishing and research dissemination infrastructure for African academics', fundingAngle: 'Open science, research dissemination and scholarly communication' },
  { name: 'BuildRx', url: 'https://www.buildrx.online/', theme: 'Software innovation', topic: 'Agentic AI software development infrastructure that helps African innovators build and deploy useful applications', fundingAngle: 'Innovation ecosystems, SME digitisation, AI adoption and entrepreneurship' },
  { name: 'Mabrig Korie', url: 'https://www.mabrigkorie.org/', theme: 'Creator & innovation', topic: 'Technology-enabled education, research, media and social-impact innovation led from Nigeria', fundingAngle: 'Fellowships, innovation awards, leadership and social impact' },
  { name: 'Mabrig Store', url: 'https://store.mabrigkorie.org/login', theme: 'Digital economy', topic: 'Digital product infrastructure that converts African knowledge and technical expertise into globally accessible products', fundingAngle: 'Creative economy, digital entrepreneurship and SME growth' },
  { name: 'Fintigen', url: 'https://www.fintigen.com/', theme: 'Fintech & business services', topic: 'Digital business operations infrastructure for Nigerian entrepreneurs and small enterprises', fundingAngle: 'Financial inclusion, SME digitisation, entrepreneurship and formalisation' },
  { name: 'NigerFlora', url: 'https://nigerflora.mabrigkorie.org/', theme: 'Biodiversity', topic: 'Digital biodiversity, plant knowledge and conservation infrastructure focused on Nigerian flora', fundingAngle: 'Biodiversity, conservation, environmental data and citizen science' },
  { name: 'CampusVerse', url: 'https://www.campusverse.store/', theme: 'Campus economy', topic: 'Digital marketplace and service infrastructure for students and campus communities in Nigeria', fundingAngle: 'Youth entrepreneurship, campus innovation, digital commerce and local economic development' },
]

export default function PersonalGrantPipeline({ name, email }: { name: string; email: string }) {
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [config, setConfig] = useState({ ai: false, webSearch: false })

  async function loadCases() {
    const res = await fetch('/api/consultancy/cases', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setConfig(data.configuration || { ai: false, webSearch: false })
    setCases(
      (data.cases || []).filter(
        (item: CaseSummary) => item.careerStage === 'creator' && item.clientEmail?.toLowerCase() === email.toLowerCase(),
      ),
    )
  }

  useEffect(() => {
    loadCases()
  }, [])

  const active = useMemo(() => cases.filter((item) => !['completed', 'closed'].includes(item.stage)), [cases])

  async function launch(project: PortfolioProject) {
    setBusy(project.name)
    setMessage(`Creating ${project.name} funding case…`)
    try {
      const create = await fetch('/api/consultancy/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name || 'Mabrig Korie',
          clientEmail: email,
          institution: 'MABRIG Technologies / Mabrig Korie',
          careerStage: 'creator',
          department: project.theme,
          topic: project.topic,
          brief: `${project.fundingAngle}. This is a creator-owned Mabrig Personal Grant Pipeline case based on the live project ${project.name} (${project.url}). Search for credible grants, fellowships, innovation funds and partnership routes that fit Nigeria or African applicants. Do not assume eligibility; verify official requirements and identify when a university, NGO, company or international consortium must lead.`,
          service: 'complete',
          consent: true,
        }),
      })
      const created = await create.json()
      if (!create.ok) throw new Error(created.error || created.message || 'Could not create funding case.')

      setMessage(`Case created. Running agentic grant discovery for ${project.name}…`)
      const discover = await fetch(`/api/consultancy/cases/${created.id}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discover' }),
      })
      const result = await discover.json().catch(() => ({}))
      if (!discover.ok) {
        setMessage(`Pipeline case created for ${project.name}. Live discovery could not run: ${result.error || result.message || 'check web-search configuration'}. Open Consultancy Studio to continue manually.`)
      } else {
        setMessage(`${project.name} is now in your personal pipeline and the first grant discovery run has been saved.`)
      }
      await loadCases()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to launch project.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-card to-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <ShieldCheck className="size-4" /> Creator-only workspace
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Mabrig Personal Grant Pipeline</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Turn your existing technology, research, education, agriculture and digital-economy platforms into fundable project pipelines. Each launch creates a private creator case and can immediately run the existing grant-discovery agent.
            </p>
          </div>
          <Link href="/dashboard/consultancy" className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/20">
            Open Consultancy Studio
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full border border-border px-3 py-1">{portfolio.length} portfolio assets</span>
          <span className="rounded-full border border-border px-3 py-1">{active.length} active personal cases</span>
          <span className="rounded-full border border-border px-3 py-1">Web search: {config.webSearch ? 'ready' : 'needs key'}</span>
          <span className="rounded-full border border-border px-3 py-1">AI drafting: {config.ai ? 'ready' : 'needs key'}</span>
        </div>
        {message && <div className="mt-4 rounded-lg border border-border bg-background/60 px-4 py-3 text-sm">{message}</div>}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Portfolio-to-funding launchpad</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select any live Mabrig platform to create a dedicated funding case and run the grant discovery agent.</p>
          </div>
          <Link href="/dashboard/grant-intelligence" className="hidden items-center gap-2 text-sm font-semibold text-gold sm:flex">
            <Radar className="size-4" /> Global Grant Intelligence
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portfolio.map((project) => (
            <article key={project.name} className="flex flex-col rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gold">{project.theme}</div>
                  <h3 className="mt-1 text-lg font-bold">{project.name}</h3>
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`} className="text-muted-foreground hover:text-foreground">
                  <ExternalLink className="size-4" />
                </a>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.fundingAngle}</p>
              <button
                onClick={() => launch(project)}
                disabled={busy !== null || !email}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === project.name ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
                Create case + discover grants
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-gold" />
          <h2 className="text-lg font-bold">Your funding pipeline</h2>
        </div>
        {cases.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No creator funding cases yet. Launch one of your portfolio projects above.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {cases.slice(0, 12).map((item) => (
              <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                <div>
                  <div className="font-semibold">{item.topic}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Updated {new Date(item.updatedAt).toLocaleDateString()} · Stage: {item.stage}</div>
                </div>
                <Link href="/dashboard/consultancy" className="text-sm font-semibold text-gold">Manage case →</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
