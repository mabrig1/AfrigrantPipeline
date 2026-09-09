import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ error: 'Sign in and activate creator access at /admin. URL-based setup is retired.' }, { status: 410 }) }
