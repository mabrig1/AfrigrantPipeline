import { Router } from 'express'
import { z } from 'zod'
import OpenAI from 'openai'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const router = Router()

router.post('/assist', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { prompt, context } = z
      .object({ prompt: z.string().min(1), context: z.string().optional() })
      .parse(req.body)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a grant writing assistant helping African organizations and researchers write compelling grant applications and research proposals. Provide clear, concise, and impactful content.',
        },
        ...(context ? [{ role: 'user' as const, content: `Context: ${context}` }] : []),
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    })

    res.json({ data: { result: completion.choices[0].message.content } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'AI request failed' })
  }
})

export default router
