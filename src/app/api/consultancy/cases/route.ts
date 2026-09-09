import { NextResponse } from 'next/server'
import Case from '@/models/ConsultancyCase'
import User from '@/models/User'
import { intakeSchema } from '@/lib/consultancy/contracts'
import {
  consultancyActor,
  failure,
  readBody,
  checkOrigin,
  ConsultancyError,
} from '@/lib/consultancy/access'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const actor = await consultancyActor()
    const cases = await Case.find(
      actor.isCreator ? {} : { clientUserId: actor.id },
    )
      .select(
        '-agentLockUntil -consentAt -documents -matches -partners -milestones -activity',
      )
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean()
    return NextResponse.json(
      {
        cases,
        isCreator: actor.isCreator,
        configuration: {
          ai: Boolean(
            process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY,
          ),
          webSearch: Boolean(process.env.TAVILY_API_KEY),
        },
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    return failure(error)
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req)
    const actor = await consultancyActor()
    const input = intakeSchema.parse(await readBody(req))
    if (!actor.isCreator && input.careerStage === 'creator')
      throw new ConsultancyError(
        'Please select your academic career stage.',
        400,
      )
    if (
      !actor.isCreator &&
      (await Case.countDocuments({
        clientUserId: actor.id,
        createdAt: { $gte: new Date(Date.now() - 86400000) },
      })) >= 5
    )
      throw new ConsultancyError(
        'You have reached today’s request limit. Continue in an existing case.',
        429,
      )
    let clientUserId = actor.id
    if (
      actor.isCreator &&
      input.clientEmail.toLowerCase() !== actor.email.toLowerCase()
    ) {
      const client = await User.findOne({
        email: input.clientEmail.toLowerCase(),
      })
        .select('_id')
        .lean()
      if (!client)
        throw new ConsultancyError(
          'Ask the client to create a free account first, then enter that account email.',
          400,
        )
      clientUserId = client._id.toString()
    }
    const now = new Date().toISOString()
    const record = await Case.create({
      ...input,
      clientEmail: actor.isCreator
        ? input.clientEmail.toLowerCase()
        : actor.email,
      clientName: actor.isCreator ? input.clientName : actor.name,
      clientUserId,
      createdBy: actor.id,
      consentAt: now,
      activity: [
        { at: now, actor: actor.name, text: 'Consultancy brief received.' },
      ],
    })
    return NextResponse.json({ id: record._id.toString() }, { status: 201 })
  } catch (error) {
    return failure(error)
  }
}
