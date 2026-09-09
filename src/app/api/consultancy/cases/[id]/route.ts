import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import Case from '@/models/ConsultancyCase'
import {
  actionSchema,
  mayAccessCase,
  canAcceptQuote,
} from '@/lib/consultancy/contracts'
import {
  consultancyActor,
  failure,
  readBody,
  checkOrigin,
  ConsultancyError,
} from '@/lib/consultancy/access'
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    checkOrigin(req)
    const actor = await consultancyActor()
    const { id } = await params
    if (!/^[a-f\d]{24}$/i.test(id))
      throw new ConsultancyError('Case not found.', 404)
    const input = actionSchema.parse(await readBody(req))
    const record = await Case.findById(id)
    if (
      !record ||
      !mayAccessCase(actor.isCreator, actor.id, record.clientUserId)
    )
      throw new ConsultancyError('Case not found.', 404)
    if (input.action !== 'accept_quote' && !actor.isCreator)
      throw new ConsultancyError('Creator access is required.', 403)
    if (input.action === 'save_document' && record.documents.length >= 100)
      throw new ConsultancyError(
        'Document limit reached for this engagement.',
        409,
      )
    if (record.activity.length >= 2000)
      throw new ConsultancyError(
        'This engagement has reached its activity limit. Start a new case.',
        409,
      )
    const now = new Date().toISOString()
    let event: string = input.action
    switch (input.action) {
      case 'quote':
        if (record.quote?.status === 'accepted')
          throw new ConsultancyError(
            'This quote is already accepted. Its agreed fee and scope cannot be overwritten.',
            409,
          )
        if ((record.quote?.version ?? 0) !== input.version)
          throw new ConsultancyError(
            'Quote changed. Refresh before saving.',
            409,
          )
        record.quote = {
          amount: input.amount,
          scope: input.scope,
          version: input.version + 1,
          status: 'pending',
        }
        record.stage = 'quoted'
        event = `Quote v${input.version + 1} issued: NGN ${input.amount.toLocaleString()}.`
        break
      case 'accept_quote':
        if (
          record.clientUserId !== actor.id ||
          !canAcceptQuote(record.quote, input.version)
        )
          throw new ConsultancyError(
            'This quote cannot be accepted. Refresh and check the latest version.',
            409,
          )
        record.quote!.status = 'accepted'
        record.quote!.acceptedAt = now
        record.stage = 'active'
        event = `Client accepted quote v${input.version}.`
        break
      case 'stage':
        record.stage = input.stage
        event = `Case moved to ${input.stage}.`
        break
      case 'payment':
        if (record.quote?.status !== 'accepted')
          throw new ConsultancyError(
            'An accepted quote is required before recording payment.',
            409,
          )
        if (
          record.payments.some(
            (p) => p.reference.toLowerCase() === input.reference.toLowerCase(),
          )
        )
          throw new ConsultancyError(
            'This payment reference is already recorded.',
            409,
          )
        if (
          record.payments.reduce((sum, p) => sum + p.amount, 0) + input.amount >
          record.quote.amount
        )
          throw new ConsultancyError(
            'Payment exceeds the outstanding consultancy fee.',
            400,
          )
        record.payments.push({
          id: randomUUID(),
          amount: input.amount,
          reference: input.reference,
          recordedAt: now,
        })
        event = `Payment recorded manually: NGN ${input.amount.toLocaleString()} (${input.reference}).`
        break
      case 'milestone':
        record.milestones.push({
          id: randomUUID(),
          title: input.title,
          dueDate: input.dueDate,
          completed: false,
        })
        event = `Milestone added: ${input.title}.`
        break
      case 'complete_milestone': {
        const milestone = record.milestones.find((m) => m.id === input.id)
        if (!milestone) throw new ConsultancyError('Milestone not found.', 404)
        milestone.completed = true
        event = `Milestone completed: ${milestone.title}.`
        break
      }
      case 'partner':
        record.partners.push({
          id: randomUUID(),
          name: input.name,
          url: input.url,
          role: input.role,
          status: input.status,
        })
        event = `Partner record added: ${input.name} (${input.status}).`
        break
      case 'save_document': {
        const version =
          record.documents.filter((d) => d.kind === input.kind).length + 1
        record.documents.push({
          id: randomUUID(),
          kind: input.kind,
          content: input.content,
          version,
          status: 'draft',
          createdAt: now,
        })
        event = `${input.kind} v${version} saved for review.`
        break
      }
      case 'approve_document': {
        const doc = record.documents.find((d) => d.id === input.id)
        if (!doc) throw new ConsultancyError('Document not found.', 404)
        doc.status = 'approved'
        doc.approvedAt = now
        event = `${doc.kind} v${doc.version} approved by creator.`
        break
      }
    }
    record.activity.push({ at: now, actor: actor.name, text: event })
    await record.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    return failure(error)
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await consultancyActor()
    const { id } = await params
    if (!/^[a-f\d]{24}$/i.test(id))
      throw new ConsultancyError('Case not found.', 404)
    const record = await Case.findById(id)
      .select('-agentLockUntil -consentAt')
      .lean()
    if (
      !record ||
      !mayAccessCase(actor.isCreator, actor.id, record.clientUserId)
    )
      throw new ConsultancyError('Case not found.', 404)
    return NextResponse.json(record, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    return failure(error)
  }
}
