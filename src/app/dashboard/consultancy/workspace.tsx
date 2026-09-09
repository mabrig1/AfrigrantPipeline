'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BriefcaseBusiness,
  Search,
  FileText,
  Plus,
  ArrowLeft,
  Download,
  Loader2,
} from 'lucide-react'
import { consultancyRequest } from '@/lib/api'
import {
  services,
  documentTypes,
  stages,
  type ConsultancyCase,
  type CaseList,
  type DocumentKind,
} from '@/lib/consultancy/contracts'

const field =
  'mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base'
const button =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-black disabled:opacity-50'
const secondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50'
const money = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
const date = (value: string) => new Date(value).toLocaleDateString('en-NG')

export default function ConsultancyWorkspace({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const [data, setData] = useState<CaseList | null>(null)
  const [selectedId, setSelectedId] = useState('')
  const [selected, setSelected] = useState<ConsultancyCase | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const load = useCallback(async () => {
    const result = await consultancyRequest<CaseList>()
    setData(result)
  }, [])
  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [load])
  useEffect(() => {
    let active = true
    setSelected(null)
    if (selectedId)
      consultancyRequest<ConsultancyCase>(`/${selectedId}`)
        .then((c) => {
          if (active) setSelected(c)
        })
        .catch((e) => {
          if (active) setError(e.message)
        })
    return () => {
      active = false
    }
  }, [selectedId])
  async function execute(
    label: string,
    path: string,
    method: string,
    body: unknown,
  ) {
    setBusy(label)
    setError('')
    setNotice('')
    try {
      await consultancyRequest(path, method, body)
      await load()
      if (selectedId)
        setSelected(await consultancyRequest<ConsultancyCase>(`/${selectedId}`))
      setNotice(`${label} completed.`)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please retry.')
      return false
    } finally {
      setBusy('')
    }
  }
  const cases =
    data?.cases.filter((c) =>
      `${c.clientName} ${c.institution} ${c.topic} ${c.stage}`
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ) || []
  const collected =
    data?.cases.reduce(
      (sum, c) => sum + c.payments.reduce((s, p) => s + p.amount, 0),
      0,
    ) || 0
  const outstanding =
    data?.cases.reduce(
      (sum, c) =>
        sum +
        (c.quote?.status === 'accepted'
          ? Math.max(
              0,
              c.quote.amount - c.payments.reduce((s, p) => s + p.amount, 0),
            )
          : 0),
      0,
    ) || 0
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-gold">
            {data?.isCreator
              ? 'Mabrig Korie · Creator premium access'
              : 'Academic consultancy'}
          </p>
          <h1 className="text-3xl font-bold">
            {data?.isCreator ? 'Consultancy desk' : 'My consultancy cases'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data?.isCreator
              ? 'Turn research briefs into funding applications and managed projects.'
              : 'Request support, review your quote, and follow your project.'}
          </p>
        </div>
        <button
          className={button}
          onClick={() => {
            setCreating(true)
            setSelectedId('')
          }}
        >
          <Plus className="size-4" />
          {data?.isCreator ? 'New client / own project' : 'Request a service'}
        </button>
      </header>
      <nav className="flex flex-wrap gap-3 text-sm">
        <Link
          className="text-gold underline"
          href="/dashboard/grant-intelligence"
        >
          Grant intelligence
        </Link>
        <Link className="text-gold underline" href="/admin">
          Creator access
        </Link>
        <Link className="text-gold underline" href="/consultancy">
          Service information
        </Link>
      </nav>
      <p className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm">
        Project-based consultancy for lecturers and postgraduate students,
        starting with UNN and NOUN. Fees and deliverables are agreed for each
        case. No recurring membership charge.
      </p>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-red-300"
        >
          {error}{' '}
          {!data && (
            <button
              className="ml-3 underline"
              onClick={() =>
                load()
                  .then(() => setError(''))
                  .catch((e) => setError(e.message))
              }
            >
              Retry
            </button>
          )}
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-lg border border-emerald-400/30 p-3 text-emerald-300"
        >
          {notice}
        </p>
      )}
      {busy && (
        <p role="status" className="flex items-center gap-2 text-gold">
          <Loader2 className="size-4 animate-spin" />
          {busy}…
        </p>
      )}
      {!data && !error && <p role="status">Loading your workspace…</p>}
      {data?.isCreator && !selected && !creating && (
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            [
              'Active cases',
              data.cases.filter(
                (c) => !['completed', 'closed'].includes(c.stage),
              ).length,
            ],
            ['Recorded receipts', money(collected)],
            ['Agreed fees outstanding', money(outstanding)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </section>
      )}
      {creating && data && (
        <IntakeForm
          name={name}
          email={email}
          isCreator={data.isCreator}
          busy={Boolean(busy)}
          cancel={() => setCreating(false)}
          submit={async (body) => {
            if (await execute('Service request', '', 'POST', body))
              setCreating(false)
          }}
        />
      )}
      {selectedId && !selected && <p role="status">Loading case…</p>}
      {selected && data && (
        <CaseDetail
          key={selected._id}
          record={selected}
          creator={data.isCreator}
          email={email}
          config={data.configuration}
          busy={Boolean(busy)}
          back={() => setSelectedId('')}
          action={(label, body, agent) =>
            execute(
              label,
              `/${selected._id}${agent ? '/agent' : ''}`,
              agent ? 'POST' : 'PATCH',
              body,
            )
          }
        />
      )}
      {data && !selectedId && !creating && (
        <section className="rounded-xl border border-border bg-card p-5">
          <label className="text-sm font-medium">
            Find a case
            <input
              className={field}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Client, institution, topic or stage"
            />
          </label>
          <div className="mt-5 divide-y divide-border">
            {cases.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelectedId(c._id)}
                className="flex w-full flex-col gap-3 py-5 text-left sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{c.topic}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.clientName} · {c.institution}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {services[c.service]}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-gold/30 px-3 py-1 text-sm capitalize text-gold">
                  {c.stage}
                </span>
              </button>
            ))}
          </div>
          {cases.length === 0 && (
            <div className="py-12 text-center">
              <BriefcaseBusiness className="mx-auto mb-3 size-9 text-gold" />
              <h2 className="font-semibold">
                {filter
                  ? 'No matching cases'
                  : 'Your first engagement starts here'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {filter
                  ? 'Try another name or topic.'
                  : 'Add a research brief to start a grant search or request proposal support.'}
              </p>
            </div>
          )}
          {data.cases.length === 200 && (
            <p className="text-sm text-muted-foreground">
              Showing the 200 most recently updated cases.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
function IntakeForm({
  name,
  email,
  isCreator,
  busy,
  cancel,
  submit,
}: {
  name: string
  email: string
  isCreator: boolean
  busy: boolean
  cancel: () => void
  submit: (body: unknown) => Promise<void>
}) {
  return (
    <form
      className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-7"
      onSubmit={async (e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        await submit({
          ...Object.fromEntries(f),
          consent: f.get('consent') === 'on',
        })
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Research & service brief</h2>
        <button type="button" onClick={cancel} className="text-sm underline">
          Cancel
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Full name
          <input
            required
            name="clientName"
            defaultValue={name}
            readOnly={!isCreator}
            maxLength={100}
            className={field}
          />
        </label>
        <label className="text-sm">
          Account email
          <input
            required
            name="clientEmail"
            type="email"
            defaultValue={email}
            readOnly={!isCreator}
            className={field}
          />
          {isCreator && (
            <span className="text-muted-foreground">
              Use your email for your own project, or a registered client’s
              email.
            </span>
          )}
        </label>
        <label className="text-sm">
          Institution
          <input
            required
            name="institution"
            list="institutions"
            maxLength={200}
            className={field}
            placeholder="Choose or enter institution"
          />
          <datalist id="institutions">
            <option>University of Nigeria, Nsukka (UNN)</option>
            <option>National Open University of Nigeria (NOUN)</option>
            <option>Independent researcher / MABRIG Technologies</option>
          </datalist>
        </label>
        <label className="text-sm">
          Career stage
          <select name="careerStage" className={field}>
            <option value="lecturer">Lecturer</option>
            <option value="masters">Master’s student</option>
            <option value="phd">PhD student</option>
            <option value="researcher">Researcher</option>
            {isCreator && (
              <option value="creator">Creator / own project</option>
            )}
          </select>
        </label>
        <label className="text-sm">
          Department / research field
          <input required name="department" maxLength={200} className={field} />
        </label>
        <label className="text-sm">
          Service
          <select name="service" className={field}>
            {Object.entries(services).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Phone / WhatsApp (optional)
          <input name="phone" maxLength={40} className={field} />
        </label>
        <label className="text-sm">
          Target deadline (optional)
          <input name="deadline" type="date" className={field} />
        </label>
      </div>
      <label className="block text-sm">
        Research topic
        <input
          required
          name="topic"
          minLength={10}
          maxLength={500}
          className={field}
        />
      </label>
      <label className="block text-sm">
        Project brief, capacity and support needed
        <textarea
          required
          name="brief"
          rows={6}
          minLength={30}
          maxLength={12000}
          className={field}
          placeholder="Describe the problem, objectives, methods, current research stage, available partners and any funder requirements. Include only facts you can support."
        />
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input required name="consent" type="checkbox" className="mt-1" />
        <span>
          I authorize use of this brief for consultancy and AI-assisted
          drafting. Research topics may be used for web searches. I have
          authority to share these details. Funding decisions remain with the
          funder.
        </span>
      </label>
      <button className={button} disabled={busy}>
        Save consultancy request
      </button>
    </form>
  )
}
function CaseDetail({
  record: c,
  creator,
  email,
  config,
  busy,
  back,
  action,
}: {
  record: ConsultancyCase
  creator: boolean
  email: string
  config: CaseList['configuration']
  busy: boolean
  back: () => void
  action: (label: string, body: unknown, agent?: boolean) => Promise<boolean>
}) {
  const [tab, setTab] = useState('overview')
  const [kind, setKind] = useState<DocumentKind>('proposal')
  const [content, setContent] = useState('')
  const paid = c.payments.reduce((s, p) => s + p.amount, 0)
  function exportDoc(doc: ConsultancyCase['documents'][number]) {
    const blob = new Blob(
      [
        `# ${c.topic}\nApplicant: ${c.clientName}\nInstitution: ${c.institution}\nStatus: ${doc.status} · Version ${doc.version}\nCreator approval does not constitute funder or institutional approval.\n\n${doc.content}`,
      ],
      { type: 'text/markdown;charset=utf-8' },
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${doc.kind}-v${doc.version}.md`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <section className="space-y-5">
      <button onClick={back} className={secondary}>
        <ArrowLeft className="size-4" />
        All cases
      </button>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-gold">
          {c.clientName} · {c.institution}
        </p>
        <h2 className="mt-2 text-2xl font-bold">{c.topic}</h2>
        <p className="mt-2 text-muted-foreground">
          {services[c.service]} · {c.careerStage} · {c.department}
        </p>
        <p className="mt-2 text-sm">
          Target date: {c.deadline || 'To be agreed'} · Opened{' '}
          {date(c.createdAt)}
        </p>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Case sections"
      >
        {['overview', 'grants', 'documents', 'partners', 'milestones'].map(
          (t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`${tab === t ? button : secondary} capitalize`}
            >
              {t}
            </button>
          ),
        )}
      </div>
      {tab === 'overview' && (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-5 rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-bold">Client brief</h3>
            <p className="whitespace-pre-wrap leading-7">{c.brief}</p>
            <p className="text-sm text-muted-foreground">
              Contact: {c.clientEmail}
              {c.phone ? ` · ${c.phone}` : ''}
            </p>
            {creator && (
              <label className="block text-sm">
                Case stage
                <select
                  className={field}
                  value={c.stage}
                  disabled={busy}
                  onChange={(e) =>
                    action('Stage update', {
                      action: 'stage',
                      stage: e.target.value,
                    })
                  }
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="space-y-5 rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-bold">
              Consultancy fee & agreed scope
            </h3>
            {c.quote ? (
              <div>
                <p className="text-2xl font-bold text-gold">
                  {money(c.quote.amount)}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{c.quote.scope}</p>
                <p className="mt-3 text-sm capitalize">
                  Quote v{c.quote.version} · {c.quote.status}
                </p>
                {c.quote.status === 'pending' &&
                  c.clientEmail.toLowerCase() === email.toLowerCase() && (
                    <button
                      disabled={busy}
                      className={`${button} mt-4`}
                      onClick={() =>
                        action('Quote acceptance', {
                          action: 'accept_quote',
                          version: c.quote!.version,
                        })
                      }
                    >
                      Accept fee & scope
                    </button>
                  )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No quote issued. The creator will assess this brief and agree a
                fee.
              </p>
            )}
            {creator && c.quote?.status !== 'accepted' && (
              <form
                key={c.quote?.version || 0}
                className="space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const f = new FormData(e.currentTarget)
                  await action('Quote', {
                    action: 'quote',
                    amount: Number(f.get('amount')),
                    scope: f.get('scope'),
                    version: c.quote?.version || 0,
                  })
                }}
              >
                <label className="block text-sm">
                  Fee (NGN)
                  <input
                    required
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    defaultValue={c.quote?.amount}
                    className={field}
                  />
                </label>
                <label className="block text-sm">
                  Deliverables, turnaround and payment terms
                  <textarea
                    required
                    name="scope"
                    minLength={20}
                    maxLength={4000}
                    defaultValue={c.quote?.scope}
                    rows={3}
                    className={field}
                  />
                </label>
                <button className={button} disabled={busy}>
                  Issue project quote
                </button>
              </form>
            )}
            <div className="border-t border-border pt-4">
              <p>
                Recorded payments: <strong>{money(paid)}</strong>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.quote?.status === 'accepted'
                  ? `Outstanding: ${money(Math.max(0, c.quote.amount - paid))}`
                  : 'Payments are recorded after quote acceptance.'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Receipts are recorded manually by the creator; this page does
                not charge a card.
              </p>
              {c.payments.map((p) => (
                <p key={p.id} className="mt-2 text-sm">
                  {money(p.amount)} · {p.reference} · {date(p.recordedAt)}
                </p>
              ))}
              {creator && c.quote?.status === 'accepted' && (
                <form
                  className="mt-4 space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const f = new FormData(form)
                    if (
                      await action('Payment record', {
                        action: 'payment',
                        amount: Number(f.get('amount')),
                        reference: f.get('reference'),
                      })
                    )
                      form.reset()
                  }}
                >
                  <label className="block text-sm">
                    Amount received (NGN)
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      name="amount"
                      className={field}
                    />
                  </label>
                  <label className="block text-sm">
                    Transfer / receipt reference
                    <input
                      required
                      minLength={3}
                      name="reference"
                      className={field}
                    />
                  </label>
                  <button disabled={busy} className={secondary}>
                    Record received payment
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
            <h3 className="font-bold">Case activity</h3>
            <ul className="mt-4 space-y-3">
              {[...c.activity]
                .reverse()
                .slice(0, 30)
                .map((a, i) => (
                  <li key={`${a.at}-${i}`} className="text-sm">
                    <span className="text-muted-foreground">
                      {date(a.at)} · {a.actor}
                    </span>
                    <p>{a.text}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      {tab === 'grants' && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h3 className="text-xl font-bold">Grant discovery & shortlist</h3>
          <p className="text-muted-foreground">
            Search the web for this research topic and compare it with current
            Nigeria-eligible calls in the grant database. Search evidence is
            saved under Documents.
          </p>
          {creator && (
            <button
              disabled={busy || !config.webSearch}
              className={button}
              onClick={() =>
                action('Grant search', { action: 'discover' }, true)
              }
            >
              <Search className="size-4" />
              Search grants for this case
            </button>
          )}
          {!config.webSearch && creator && (
            <p className="text-sm text-amber-300">
              Live search needs TAVILY_API_KEY. The Grant intelligence page can
              scan its official sources with an AI provider.
            </p>
          )}
          {c.matches.map((g) => (
            <article
              key={g.grantId}
              className="rounded-lg border border-border p-4"
            >
              <p className="text-sm text-gold">
                {g.funder} · {g.deadline}
              </p>
              <h4 className="mt-1 font-semibold">{g.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{g.reason}</p>
              <p className="mt-2 text-sm">
                Source status: {g.verificationStatus}
              </p>
              {/^https?:\/\//.test(g.url) && (
                <a
                  className="mt-2 inline-block text-gold underline"
                  href={g.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check source and eligibility
                </a>
              )}
            </article>
          ))}
          {!c.matches.length && (
            <p className="py-6 text-muted-foreground">
              No database shortlist yet. Run a search, then review the saved
              source notes. A web lead is not a verified grant.
            </p>
          )}
        </div>
      )}
      {tab === 'documents' && (
        <div className="space-y-5">
          {creator && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h3 className="text-xl font-bold">Drafting studio</h3>
              <p className="text-sm text-muted-foreground">
                Drafts use this client’s brief and selected grant. Review facts,
                budgets and institutional requirements before approval.
              </p>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const f = new FormData(e.currentTarget)
                  await action(
                    'AI drafting',
                    {
                      action: 'generate',
                      kind,
                      ...(f.get('grantId')
                        ? { grantId: f.get('grantId') }
                        : {}),
                      instructions: f.get('instructions'),
                    },
                    true,
                  )
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    Document type
                    <select
                      className={field}
                      value={kind}
                      onChange={(e) => setKind(e.target.value as DocumentKind)}
                    >
                      {Object.entries(documentTypes).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    Grant context
                    <select name="grantId" className={field}>
                      <option value="">
                        General draft — funder to confirm
                      </option>
                      {c.matches.map((g) => (
                        <option key={g.grantId} value={g.grantId}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-sm">
                  Call requirements, actual costs or drafting instructions
                  <textarea
                    name="instructions"
                    rows={4}
                    maxLength={12000}
                    className={field}
                    placeholder="Paste the official call requirements, budget facts and specific section you need."
                  />
                </label>
                <button className={button} disabled={busy || !config.ai}>
                  <FileText className="size-4" />
                  Generate review draft
                </button>
                {!config.ai && (
                  <p className="text-sm text-amber-300">
                    Connect OpenRouter or Anthropic to generate drafts. Manual
                    editing is available below.
                  </p>
                )}
              </form>
              <label className="block text-sm">
                Manual draft / revised document
                <textarea
                  className={field}
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={50000}
                  placeholder="Write here, or select Edit as new version on a saved document."
                />
              </label>
              <button
                disabled={busy || content.trim().length < 20}
                className={secondary}
                onClick={async () => {
                  if (
                    await action('Document save', {
                      action: 'save_document',
                      kind,
                      content,
                    })
                  )
                    setContent('')
                }}
              >
                Save new {documentTypes[kind].toLowerCase()} version
              </button>
            </div>
          )}
          {[...c.documents].reverse().map((d) => (
            <article
              key={d.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <h3 className="font-bold">
                  {documentTypes[d.kind]} · v{d.version}
                </h3>
                <span className="text-sm capitalize text-gold">
                  {d.status} · {date(d.createdAt)}
                </span>
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm underline">
                  Read document
                </summary>
                <div className="mt-4 whitespace-pre-wrap break-words leading-7">
                  {d.content}
                </div>
              </details>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className={secondary} onClick={() => exportDoc(d)}>
                  <Download className="size-4" />
                  Download text (.md)
                </button>
                {creator && (
                  <>
                    <button
                      className={secondary}
                      onClick={() => {
                        setKind(d.kind)
                        setContent(d.content)
                      }}
                    >
                      Edit as new version
                    </button>
                    {d.status === 'draft' && (
                      <button
                        disabled={busy}
                        className={secondary}
                        onClick={() =>
                          action('Creator review', {
                            action: 'approve_document',
                            id: d.id,
                          })
                        }
                      >
                        Mark reviewed & approved
                      </button>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
          {!c.documents.length && (
            <p className="rounded-xl border border-border p-8 text-muted-foreground">
              No documents yet. Drafts and search evidence will appear here.
            </p>
          )}
        </div>
      )}
      {tab === 'partners' && (
        <div className="space-y-5 rounded-xl border border-border bg-card p-5">
          <h3 className="text-xl font-bold">Partnership development</h3>
          <p className="text-muted-foreground">
            Track potential collaborators and record agreed roles. Outreach and
            MoU drafts are prepared in Documents; contacts and agreements need
            real confirmation.
          </p>
          {creator && (
            <>
              <button
                disabled={busy || !config.webSearch}
                className={button}
                onClick={() =>
                  action('Partner search', { action: 'partners' }, true)
                }
              >
                Find research partners
              </button>
              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  if (
                    await action('Partner record', {
                      action: 'partner',
                      ...Object.fromEntries(new FormData(form)),
                    })
                  )
                    form.reset()
                }}
              >
                <label className="text-sm">
                  Institution / partner name
                  <input required minLength={2} name="name" className={field} />
                </label>
                <label className="text-sm">
                  Official website
                  <input required type="url" name="url" className={field} />
                </label>
                <label className="text-sm">
                  Proposed / confirmed role
                  <input required minLength={5} name="role" className={field} />
                </label>
                <label className="text-sm">
                  Confirmed relationship stage
                  <select name="status" className={field}>
                    {['prospect', 'contacted', 'interested', 'agreed'].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </label>
                <button className={secondary} disabled={busy}>
                  Add partner record
                </button>
              </form>
            </>
          )}
          {c.partners.map((p) => (
            <article key={p.id} className="rounded-lg border border-border p-4">
              <h4 className="font-semibold">{p.name}</h4>
              <p className="mt-2">{p.role}</p>
              <p className="mt-1 text-sm capitalize">{p.status}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-gold underline"
              >
                Partner website
              </a>
            </article>
          ))}
          {!c.partners.length && (
            <p className="text-muted-foreground">No partner records yet.</p>
          )}
        </div>
      )}
      {tab === 'milestones' && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h3 className="text-xl font-bold">Grant delivery & reporting</h3>
          <p className="text-muted-foreground">
            Track applications, institutional approvals, deliverables and funder
            reporting dates.
          </p>
          {creator && (
            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                if (
                  await action('Milestone', {
                    action: 'milestone',
                    ...Object.fromEntries(new FormData(form)),
                  })
                )
                  form.reset()
              }}
            >
              <label className="min-w-0 flex-1 text-sm">
                Deliverable
                <input required minLength={3} name="title" className={field} />
              </label>
              <label className="text-sm">
                Due date
                <input required type="date" name="dueDate" className={field} />
              </label>
              <button className={button} disabled={busy}>
                Add milestone
              </button>
            </form>
          )}
          {c.milestones.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-semibold">{m.title}</p>
                <p
                  className={`mt-1 text-sm ${!m.completed && m.dueDate < new Date().toISOString().slice(0, 10) ? 'text-red-300' : 'text-muted-foreground'}`}
                >
                  {m.dueDate} · {m.completed ? 'Completed' : 'Pending'}
                </p>
              </div>
              {creator && !m.completed && (
                <button
                  disabled={busy}
                  className={secondary}
                  onClick={() =>
                    action('Milestone completion', {
                      action: 'complete_milestone',
                      id: m.id,
                    })
                  }
                >
                  Mark complete
                </button>
              )}
            </div>
          ))}
          {!c.milestones.length && (
            <p className="py-5 text-muted-foreground">
              Add the next application or reporting deadline to start tracking
              delivery.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
