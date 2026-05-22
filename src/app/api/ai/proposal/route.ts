import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type TemplateKey = 'proposal' | 'abstract' | 'description' | 'cover_letter' | 'aim'

interface ProposalBody {
  template: TemplateKey
  topic: string
  organization?: string
  funder?: string
  country?: string
  wordCount?: number
  context?: string
}

const TEMPLATE_INSTRUCTIONS: Record<TemplateKey, string> = {
  proposal:
    'Write a compelling grant proposal executive summary. Cover the problem statement, proposed solution, expected impact, team qualifications, and budget overview.',
  abstract:
    'Write a concise academic research abstract. Include background/motivation, research objectives, methodology, key findings or expected outcomes, and significance.',
  description:
    'Write a detailed project description for a grant application. Include project rationale, specific activities, timeline milestones, evaluation plan, and sustainability.',
  cover_letter:
    'Write a professional cover letter for a grant application. Express genuine interest in the funding opportunity, highlight relevant qualifications and past work, and explain alignment with the funder\'s priorities.',
  aim:
    'Write specific aims and objectives for a research grant. Clearly state the central hypothesis, list 3–4 specific aims with measurable outcomes, and explain how the aims address the research gap.',
}

const SYSTEM_PROMPT = `You are an expert grant writer and academic writing assistant specialising in African research, innovation, and development. You help researchers, students, universities, NGOs, and organisations write compelling grant proposals and academic documents.

Guidelines:
- Write in a professional, clear, and persuasive style appropriate for international funders
- Ground the work in African context: local challenges, regional priorities, and global relevance
- Use specific, concrete language — avoid vague generalisations
- Structure your output with clear paragraphs; use headers only when appropriate for the document type
- Do not include meta-commentary or explain what you are doing — just produce the document text`

function buildUserPrompt(body: ProposalBody): string {
  const wordCount = body.wordCount ?? 300
  const instruction = TEMPLATE_INSTRUCTIONS[body.template] ?? TEMPLATE_INSTRUCTIONS.proposal

  let prompt = `${instruction}\n\nTarget length: approximately ${wordCount} words.\n\nResearch topic / title: ${body.topic}`

  if (body.organization) prompt += `\nApplicant organisation: ${body.organization}`
  if (body.funder) prompt += `\nTarget funder / grant programme: ${body.funder}`
  if (body.country) prompt += `\nCountry / region of implementation: ${body.country}`
  if (body.context) prompt += `\n\nAdditional context provided by the applicant:\n${body.context}`

  return prompt
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: ProposalBody
  try {
    body = (await req.json()) as ProposalBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 422 })
  }
  if (!body.template || !TEMPLATE_INSTRUCTIONS[body.template]) {
    return NextResponse.json({ error: 'Invalid template type' }, { status: 422 })
  }

  const wordCount = Math.min(Math.max(body.wordCount ?? 300, 50), 1200)

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt({ ...body, wordCount }) },
      ],
      max_tokens: Math.ceil(wordCount * 1.6),
      temperature: 0.75,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
      cancel() {
        stream.controller.abort()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
