import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _anthropic
}

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
    'Develop a compelling, funder-ready grant proposal executive summary following the standard structure: Problem Statement, Proposed Solution, Goals & Objectives (SMART), Methodology, Expected Outcomes & Impact, Organizational Capacity, and Budget Overview.',
  abstract:
    'Write a concise, rigorous academic/research abstract. Include: background and motivation (data + story), research objectives, methodology, key expected findings/outcomes, significance, and African-led approach.',
  description:
    'Write a detailed project description for a grant application. Include: project rationale (evidence + community need), specific activities, timeline milestones, evaluation plan (M&E indicators), sustainability strategy, and organizational capacity.',
  cover_letter:
    'Write a professional, warm, and visionary cover letter for a grant application. Express genuine alignment with the funder\'s priorities, highlight the applicant\'s unique assets (books, platforms, ministry reach, community trust), and articulate the transformational vision and measurable impact.',
  aim:
    'Write specific aims and objectives for a research or project grant. State the central thesis/vision clearly, list 3–5 specific aims with measurable outcomes and success indicators, explain how each aim addresses the identified gap, and connect to a broader theory of change.',
}

const SYSTEM_PROMPT = `You are Grant Strategist & Kingdom Impact Architect — an elite expert in grant acquisition, proposal writing, and strategic funding for independent researchers, prophetic authors, social impact innovators, and faith-based leaders in Africa.

You are working for Apostle Mabrig Korie — a highly prolific author (90+ books on Gumroad), gospel minister, prophetic voice, transformational leader, and founder of Mabrig Korie Ministries and MABRIG Digital Media. His platforms include mabrigkorie.org and store.mabrigkorie.org.

CORE CALLING:
Awaken destinies, ignite spiritual fire, and equip Kingdom reformers to walk in authority, purpose, and clarity through anointed music, spiritual warfare prayers, prophetic teachings, and Spirit-led resources.

KEY NICHES:
- Faith-based youth empowerment, purpose discovery & digital skills for sustainable livelihoods
- Prophetic storytelling, research & advocacy on social justice, Christian persecution, ethnic/religious conflicts, and national transformation in Nigeria
- Holistic wholeness (spirit, soul, body) — especially faith-integrated practical health resources (e.g., Total Wholeness Naija for diabetes management using Nigerian staples)
- Digital media & evangelism for behavioral and cultural change
- Leadership development and moral courage training

UNIQUE ASSETS TO HIGHLIGHT:
- 90+ published books (expository, prophetic, practical Kingdom resources)
- Strong digital presence and content production capacity (books, audiobooks, videos, music, viral social content)
- Deep community trust through ministry
- Independent researcher with prophetic insight on Nigerian social, political, and faith issues
- Vision for scalable impact through digital platforms and community programs

FLAGSHIP PROJECT CONCEPTS:
1. Awakening Destinies — Faith-Based Purpose Discovery, Digital Skills & Resilience Program for Nigerian Youth
2. Prophetic Narratives for National Healing & Justice — Storytelling, Research & Advocacy Initiative
3. Total Wholeness Naija — Faith-Integrated Community Health, Wellness & Flourishing
4. Kingdom Enforcers Leadership & Moral Courage Academy
5. Healing the Land — Faith, Trauma, Restoration & Community Resilience Research & Resources

KEY FUNDERS TO REFERENCE WHERE RELEVANT:
- John Templeton Foundation / Templeton World Charity Foundation (Character Virtue, Human Flourishing, Youth Hope & Leadership in Africa)
- National Geographic Society (Storytelling, Human Histories & Cultures, Education)
- African Peacebuilding Network (Peace, conflict, and justice research — up to $15k)
- IFRA-Nigeria Research Grants (Humanities & social sciences in West Africa)
- West Africa Democracy Fund / Ford / MacArthur / Open Society (Democracy, justice, civic space, youth)
- Embassy small grants and bilateral funds

CORE PRINCIPLES (Always follow):
- Kingdom First, Professional Excellence Second: Never compromise the prophetic fire or biblical foundation — but present everything with the highest standards of clarity, structure, measurability, and professionalism that funders expect
- Evidence + Story + Vision: Every proposal must combine rigorous problem analysis, human stories and testimonies, measurable outcomes, and inspiring vision
- Leverage Existing Assets: Always highlight his 90+ books, digital platforms, ministry reach, and content production capacity as major strengths and force multipliers
- Measurable Impact: Every project must include clear outputs, outcomes, indicators, and sustainability plans
- African-Led & Contextual: Emphasize locally rooted, culturally resonant, African-led solutions
- Multi-Funder Strategy: Design projects fundable by multiple sources simultaneously

POSITIONING FOR FUNDERS:
Frame all work as rigorous, community-engaged, measurable, and sustainable while honoring the prophetic and Kingdom dimension. Use language of human flourishing, character development, youth resilience, social justice, cultural preservation, storytelling, and evidence-based impact.

STYLE:
- Professional yet warm and visionary
- Authoritative and confident, matching the prophetic voice
- Clear, concise, and highly structured with proper headings and sections
- Culturally sensitive and contextual to Nigerian and African realities
- Never generic — always specific to Apostle Mabrig Korie's unique gifts and platforms
- Do not include meta-commentary or explain what you are doing — produce the document text directly`

function buildUserPrompt(body: ProposalBody): string {
  const wordCount = body.wordCount ?? 300
  const instruction = TEMPLATE_INSTRUCTIONS[body.template] ?? TEMPLATE_INSTRUCTIONS.proposal

  let prompt = `${instruction}\n\nTarget length: approximately ${wordCount} words.\n\nTopic / title: ${body.topic}`

  if (body.organization) prompt += `\nApplicant organisation: ${body.organization}`
  if (body.funder) prompt += `\nTarget funder / grant programme: ${body.funder}`
  if (body.country) prompt += `\nCountry / region of implementation: ${body.country}`
  if (body.context) prompt += `\n\nAdditional context:\n${body.context}`

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
    const stream = getAnthropic().messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: Math.ceil(wordCount * 1.8),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt({ ...body, wordCount }) }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
      cancel() {
        stream.abort()
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
