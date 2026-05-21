import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { openai } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, context } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a grant writing assistant helping African organizations write compelling grant applications. Provide clear, concise, and impactful content.',
        },
        ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch {
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
