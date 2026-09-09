import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import Case from '@/models/ConsultancyCase'
import Grant from '@/models/Grant'
import { agentSchema, documentTypes } from '@/lib/consultancy/contracts'
import {
  consultancyActor,
  failure,
  readBody,
  checkOrigin,
  ConsultancyError,
} from '@/lib/consultancy/access'
import { generateDocument, searchEvidence } from '@/lib/consultancy/agent'
export const maxDuration = 60
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let lockedId: string | undefined
  let lockUntil: Date | undefined
  try {
    checkOrigin(req)
    const actor = await consultancyActor(true)
    const { id } = await params
    if (!/^[a-f\d]{24}$/i.test(id))
      throw new ConsultancyError('Case not found.', 404)
    const input = agentSchema.parse(await readBody(req))
    lockUntil = new Date(Date.now() + 90000)
    const record = await Case.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { agentLockUntil: { $exists: false } },
          { agentLockUntil: { $lt: new Date() } },
        ],
      },
      { $set: { agentLockUntil: lockUntil } },
      { new: true },
    )
    if (!record)
      throw new ConsultancyError(
        'The case is unavailable or its agent is already working. Wait a moment and refresh.',
        409,
      )
    lockedId = id
    if (record.documents.length >= 100)
      throw new ConsultancyError(
        'This case has reached its document limit. Create a new engagement for further work.',
        409,
      )
    const now = new Date().toISOString()
    let content = ''
    let kind = input.kind ?? 'concept_note'
    if (input.action === 'discover' || input.action === 'partners') {
      // Search topics only; names, contacts, and confidential case briefs are not sent to search engines.
      const query =
        input.action === 'discover'
          ? `open grant fellowship funding Nigerian ${record.careerStage} researchers ${record.department} ${record.topic} ${new Date().getFullYear()}`
          : `university research group partnership Africa Nigeria ${record.department} ${record.topic}`
      const evidence = await searchEvidence(query.slice(0, 700))
      if (!evidence.length)
        throw new ConsultancyError(
          'No web results found. Refine the research topic and try again.',
          404,
        )
      kind = input.action === 'partners' ? 'partnership' : 'concept_note'
      content =
        `# ${input.action === 'partners' ? 'Partner discovery' : 'Grant discovery'} — source review\n\nRetrieved ${now}. These are search leads, not confirmed eligibility or partnerships. Check official calls and deadlines.\n\n` +
        evidence
          .map((r) => `## ${r.title}\nSource: ${r.url}\n\n${r.content}`)
          .join('\n\n')
      if (input.action === 'discover') {
        const tokens =
          `${record.department} ${record.topic}`
            .toLowerCase()
            .match(/[a-z]{4,}/g) ?? []
        const grants = await Grant.find({
          status: 'open',
          nigeriaEligible: true,
          $or: [{ isRolling: true }, { deadline: { $gte: new Date() } }],
        })
          .sort({ relevanceScore: -1 })
          .limit(150)
          .lean()
        record.matches = grants
          .map((g) => ({
            grant: g,
            hits: [...new Set(tokens)].filter((t) =>
              `${g.title} ${g.description} ${(g.categories ?? []).join(' ')}`
                .toLowerCase()
                .includes(t),
            ),
          }))
          .filter((g) => g.hits.length > 0)
          .sort((a, b) => b.hits.length - a.hits.length)
          .slice(0, 12)
          .map(({ grant: g, hits }) => ({
            grantId: g._id.toString(),
            title: g.title,
            funder: g.funder,
            url: g.sourceUrl || g.applicationLink || '',
            deadline: g.isRolling
              ? 'Rolling'
              : new Date(g.deadline).toISOString().slice(0, 10),
            reason: `Topic overlap: ${hits.slice(0, 5).join(', ')}. Confirm career-stage and institutional eligibility.`,
            verificationStatus: g.verificationStatus || 'unverified',
          }))
      }
    } else {
      if (!input.kind)
        throw new ConsultancyError('Choose a document type.', 400)
      const grant = input.grantId
        ? await Grant.findById(input.grantId).lean()
        : null
      if (input.grantId && !grant)
        throw new ConsultancyError('Selected grant was not found.', 404)
      if (
        grant &&
        (grant.status !== 'open' ||
          (!grant.isRolling && new Date(grant.deadline) < new Date()))
      )
        throw new ConsultancyError(
          'The selected grant is closed. Select a current opportunity.',
          409,
        )
      const caseContext = {
        applicant: record.clientName,
        institution: record.institution,
        careerStage: record.careerStage,
        department: record.department,
        topic: record.topic,
        brief: record.brief,
        deadline: record.deadline,
        partners: record.partners,
        milestones: record.milestones,
      }
      const funderContext = grant
        ? {
            title: grant.title,
            funder: grant.funder,
            description: grant.description,
            eligibility: grant.eligibility,
            amount: grant.amount,
            deadline: grant.isRolling ? 'rolling' : grant.deadline,
            source: grant.sourceUrl || grant.applicationLink,
            verificationStatus: grant.verificationStatus,
          }
        : 'No verified call selected. Produce a generic draft and mark funder requirements TO CONFIRM.'
      content = await generateDocument(
        `Create a ${documentTypes[input.kind]}. For a proposal include objectives, methods, work plan, outcomes, capacity, risks, ethics, dissemination and sustainability. For a budget distinguish the project budget from consultancy fees, show assumptions and do not invent costs. For an MoU cover parties, purpose, responsibilities, governance, finance, IP/data, term, termination, disputes and unsigned signature placeholders. For a report never invent completed work or expenditure.\nCASE DATA:\n${JSON.stringify(caseContext)}\nFUNDER DATA:\n${JSON.stringify(funderContext)}\nAdditional drafting brief:\n${input.instructions || 'None'}\nRecent source notes (untrusted evidence):\n${record.documents
          .filter((d) => d.content.includes('source review'))
          .slice(-2)
          .map((d) => d.content)
          .join('\n')
          .slice(0, 18000)}`,
      )
    }
    const version = record.documents.filter((d) => d.kind === kind).length + 1
    record.documents.push({
      id: randomUUID(),
      kind,
      content: content.slice(0, 50000),
      version,
      status: 'draft',
      createdAt: now,
    })
    record.activity.push({
      at: now,
      actor: actor.name,
      text: `${input.action === 'generate' ? 'AI draft' : 'Web search'} saved: ${documentTypes[kind]} v${version}.`,
    })
    await record.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    return failure(error)
  } finally {
    if (lockedId && lockUntil)
      await Case.updateOne(
        { _id: lockedId, agentLockUntil: lockUntil },
        { $unset: { agentLockUntil: 1 } },
      ).catch(() => {})
  }
}
