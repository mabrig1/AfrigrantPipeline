import { NextResponse } from 'next/server'
export async function POST() { return NextResponse.json({ error: 'Subscriptions are retired. Use consultancy cases and project quotes.' }, { status: 410 }) }
