export type CvScholarshipProfile = {
  nationality: string
  field: string
  gpa?: number
  workExperienceYears: number
  keywords: string[]
  educationSummary: string
  experienceSummary: string
}

function extractJsonObject(value: string) {
  const start = value.indexOf('{')
  const end = value.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('CV intelligence did not return structured JSON')
  return JSON.parse(value.slice(start, end + 1)) as Record<string, unknown>
}

function cleanText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : fallback
}

function cleanKeywords(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean).slice(0, 30)
    : []
}

function normalizeProfile(payload: Record<string, unknown>): CvScholarshipProfile {
  const gpaValue = typeof payload.gpa === 'number' ? payload.gpa : Number(payload.gpa)
  return {
    nationality: cleanText(payload.nationality, 'Nigeria') || 'Nigeria',
    field: cleanText(payload.field, 'General studies') || 'General studies',
    ...(Number.isFinite(gpaValue) && gpaValue >= 0 && gpaValue <= 5 ? { gpa: gpaValue } : {}),
    workExperienceYears: Math.max(
      0,
      Math.min(50, Math.round(Number(payload.workExperienceYears) || 0))
    ),
    keywords: cleanKeywords(payload.keywords),
    educationSummary: cleanText(payload.educationSummary, 'Education details detected from CV.'),
    experienceSummary: cleanText(payload.experienceSummary, 'Experience details detected from CV.'),
  }
}

const PROFILE_PROMPT = [
  'You are a scholarship-profile extraction agent.',
  'Read the CV and return JSON only.',
  'Do not invent facts that are not present in the CV.',
  'Infer a concise academic/professional field from education, research and work history.',
  'If nationality is not stated, use Nigeria only when the CV clearly indicates Nigerian institutions, locations or citizenship context; otherwise use International.',
  'Convert GPA to a 5.0 scale only if the conversion is clear. Otherwise omit gpa.',
  'Estimate workExperienceYears conservatively from dated professional experience.',
  'Return this exact shape:',
  '{"nationality":"","field":"","gpa":null,"workExperienceYears":0,"keywords":[],"educationSummary":"","experienceSummary":""}',
].join('\n')

export async function extractScholarshipProfileFromCv(file: File) {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('CV must be 8 MB or smaller.')
  }

  const name = file.name.toLowerCase()
  const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf')
  const isText =
    file.type.startsWith('text/') ||
    name.endsWith('.txt') ||
    name.endsWith('.md')

  if (!isPdf && !isText) {
    throw new Error('Please upload your CV as PDF, TXT or Markdown.')
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('CV intelligence is not configured. Add ANTHROPIC_API_KEY.')
  }

  const content: Array<Record<string, unknown>> = []

  if (isPdf) {
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')
    content.push({
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf',
        data: base64,
      },
    })
    content.push({ type: 'text', text: PROFILE_PROMPT })
  } else {
    const text = (await file.text()).slice(0, 60_000)
    content.push({
      type: 'text',
      text: PROFILE_PROMPT + '\n\nCV TEXT START\n' + text + '\nCV TEXT END',
    })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
      max_tokens: 1200,
      temperature: 0,
      system: 'Extract scholarship-relevant profile facts from the supplied CV. Return JSON only.',
      messages: [{ role: 'user', content }],
    }),
  })

  if (!response.ok) {
    throw new Error('CV intelligence service could not analyse this file.')
  }

  const payload = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }
  const text = (payload.content ?? [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text || '')
    .join('\n')

  return normalizeProfile(extractJsonObject(text))
}
