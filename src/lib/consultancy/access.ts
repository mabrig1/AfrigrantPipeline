import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ConsultancyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}
export async function consultancyActor(creatorOnly = false) {
  const session = await auth()
  if (!session?.user?.id || !/^[a-f\d]{24}$/i.test(session.user.id))
    throw new ConsultancyError('Please sign in to continue.', 401)
  await connectDB()
  const user = await User.findById(session.user.id)
    .select('_id role email name')
    .lean()
  if (!user)
    throw new ConsultancyError('Account not found. Please sign in again.', 401)
  const isCreator = user.role === 'admin' && session.user.role === 'admin'
  if (creatorOnly && !isCreator)
    throw new ConsultancyError('Creator access is required.', 403)
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    isCreator,
  }
}
export function failure(error: unknown) {
  if (error instanceof ConsultancyError)
    return NextResponse.json({ error: error.message }, { status: error.status })
  if (error instanceof ZodError)
    return NextResponse.json(
      { error: error.issues[0]?.message || 'Please check the form.' },
      { status: 400 },
    )
  if (error instanceof SyntaxError)
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    )
  if (error instanceof Error && error.name === 'VersionError')
    return NextResponse.json(
      { error: 'This case changed. Refresh before saving again.' },
      { status: 409 },
    )
  console.error(
    'Consultancy operation failed',
    error instanceof Error ? error.name : 'unknown',
  )
  return NextResponse.json(
    { error: 'The service could not complete this request. Please try again.' },
    { status: 503 },
  )
}
export async function readBody(req: Request) {
  const raw = await req.text()
  if (raw.length > 60000)
    throw new ConsultancyError('Request is too large.', 413)
  return JSON.parse(raw) as unknown
}
export function checkOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (origin && origin !== new URL(req.url).origin)
    throw new ConsultancyError('Invalid request origin.', 403)
}
