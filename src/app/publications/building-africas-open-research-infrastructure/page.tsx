import Link from 'next/link'
import { BookOpen, ExternalLink, Quote, FileText } from 'lucide-react'

export const metadata = {
  title: "Building Africa's Open Research Infrastructure | AfriPublish",
  description: "Mabrig Korie's 2026 manuscript on AfrigrantPipeline and open research infrastructure in Africa.",
  robots: { index: true, follow: true },
  alternates:{canonical:'https://www.afrigrantpipeline.com/publications/building-africas-open-research-infrastructure'},
  other:{citation_title:"Building Africa’s Open Research Infrastructure: Design, Implementation, and Impact Evaluation of a Unified Grant Marketplace, Collaboration, and Scholarly Publishing Platform",citation_author:'Mabrig Korie',citation_publication_date:'2026',citation_public_url:'https://www.afrigrantpipeline.com/publications/building-africas-open-research-infrastructure'},
}

const title = "Building Africa’s Open Research Infrastructure: Design, Implementation, and Impact Evaluation of a Unified Grant Marketplace, Collaboration, and Scholarly Publishing Platform"
const abstract = "This article examines AfrigrantPipeline as a proposed and partially implemented socio-technical infrastructure integrating grant discovery, researcher identity, collaboration, mentorship, and scholarly publishing for African research communities. The analysis synthesizes the supplied technical and pilot narrative with established open-science, FAIR-data, and African digital-transformation frameworks. Its central contribution is an integrative architecture and an explicitly testable evaluation framework rather than a demonstrated causal effect. The source manuscript describes favourable early user feedback, but does not supply the participant count, observation dates, instruments, baseline measures, or analyzable event logs required to substantiate statistical improvement. Accordingly, this expanded article treats reported experiences as provisional and specifies an ethically governed, reproducible mixed-methods evaluation for future deployment. The resulting design emphasizes discoverability, identity interoperability, accessibility, security, transparent AI assistance, and sustainable institutional stewardship."
const source = 'https://github.com/mabrig1/AfrigrantPipeline/blob/954ccf4f1d71fe84b2632180cbeeea72d3c2b445/publications/2026-building-africas-open-research-infrastructure.md'
const citation = `Korie, M. (2026). ${title}. AfrigrantPipeline open manuscript repository. ${source}`
const bib = `@misc{korie2026openresearch,
  author = {Korie, Mabrig},
  title = {${title}},
  year = {2026},
  howpublished = {AfrigrantPipeline open manuscript repository},
  url = {${source}},
  note = {Repository manuscript; not peer reviewed}
}`

export default function PublicationPage() {
 return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-4xl px-5 py-12">
  <Link href="/" className="text-sm text-primary">← AfrigrantPipeline</Link>
  <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-primary/15 px-3 py-2 text-primary">AfriPublish</span><span className="rounded-full border border-border px-3 py-2">Open manuscript · 2026</span><span className="rounded-full border border-border px-3 py-2">Not peer reviewed</span></div>
  <h1 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
  <div className="mt-6 text-muted-foreground"><p className="font-semibold text-foreground">Mabrig Korie</p><p>Mabrig Technologies · 2026</p><a href="mailto:Mabrig@mabrigkorie.org" className="text-primary">Mabrig@mabrigkorie.org</a></div>
  <section className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8"><h2 className="text-xl font-bold">Abstract</h2><p className="mt-4 leading-8 text-muted-foreground">{abstract}</p><p className="mt-5 text-sm"><strong>Keywords:</strong> African research infrastructure; open science; grant discovery; research collaboration; FAIR data; responsible artificial intelligence; digital equity</p></section>
  <div className="mt-8 flex flex-wrap gap-3"><a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"><FileText size={18}/> Read full manuscript <ExternalLink size={15}/></a><a href={`data:text/plain;charset=utf-8,${encodeURIComponent(citation)}`} download="korie-2026-citation.txt" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3"><Quote size={18}/> Citation (.txt)</a><a href={`data:text/plain;charset=utf-8,${encodeURIComponent(bib)}`} download="korie-2026.bib" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3"><BookOpen size={18}/> BibTeX</a></div>
  <section className="mt-12 rounded-xl border border-border p-6"><h2 className="text-lg font-bold">How to cite</h2><p className="mt-3 break-words text-sm leading-7 text-muted-foreground">{citation}</p><p className="mt-5 text-sm text-muted-foreground">This is a public repository manuscript, not an accepted journal article. No DOI has been assigned. Pilot findings are preliminary and lack underlying datasets for independent verification.</p></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'ScholarlyArticle',headline:title,author:{'@type':'Person',name:'Mabrig Korie'},datePublished:'2026',description:abstract,keywords:'African research infrastructure, open science, FAIR data',url:'https://afrigrantpipeline.com/publications/building-africas-open-research-infrastructure',isAccessibleForFree:true,creativeWorkStatus:'Repository manuscript (not peer reviewed)',encodingFormat:'text/markdown'})}}/>
 </div></main>
}
