import { z } from 'zod'

export const services = {
  discovery: 'Grant search & eligibility review',
  proposal: 'Proposal & budget preparation',
  partnership: 'Partner search & MoU preparation',
  management: 'Grant management & reporting',
  complete: 'Complete application consultancy',
} as const
export const documentTypes = {
  concept_note: 'Concept note',
  proposal: 'Grant proposal',
  budget: 'Budget & justification',
  partnership: 'Partnership brief & outreach draft',
  mou: 'Memorandum of understanding',
  report: 'Progress report & monitoring plan',
} as const
export const stages = [
  'requested',
  'scoping',
  'quoted',
  'active',
  'review',
  'submitted',
  'awarded',
  'reporting',
  'completed',
  'closed',
] as const
const text = (max: number) => z.string().trim().max(max)
export const intakeSchema = z
  .object({
    clientName: text(100).min(2),
    clientEmail: z.string().trim().email().max(200),
    institution: text(200).min(2),
    careerStage: z.enum([
      'lecturer',
      'masters',
      'phd',
      'researcher',
      'creator',
    ]),
    department: text(200).min(2),
    topic: text(500).min(10),
    brief: text(12000).min(30),
    service: z.enum([
      'discovery',
      'proposal',
      'partnership',
      'management',
      'complete',
    ]),
    phone: text(40).optional(),
    deadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .or(z.literal(''))
      .optional(),
    consent: z.literal(true),
  })
  .strict()
export const actionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('quote'),
    amount: z.number().positive().max(100000000),
    scope: text(4000).min(20),
    version: z.number().int().nonnegative(),
  }),
  z.object({
    action: z.literal('accept_quote'),
    version: z.number().int().positive(),
  }),
  z.object({ action: z.literal('stage'), stage: z.enum(stages) }),
  z.object({
    action: z.literal('payment'),
    amount: z.number().positive().max(100000000),
    reference: text(200).min(3),
  }),
  z.object({
    action: z.literal('milestone'),
    title: text(300).min(3),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  z.object({ action: z.literal('complete_milestone'), id: z.string().uuid() }),
  z.object({
    action: z.literal('partner'),
    name: text(200).min(2),
    url: z
      .string()
      .url()
      .refine((v) => /^https?:\/\//.test(v)),
    role: text(1000).min(5),
    status: z.enum(['prospect', 'contacted', 'interested', 'agreed']),
  }),
  z.object({
    action: z.literal('save_document'),
    kind: z.enum([
      'concept_note',
      'proposal',
      'budget',
      'partnership',
      'mou',
      'report',
    ]),
    content: text(50000).min(20),
  }),
  z.object({ action: z.literal('approve_document'), id: z.string().uuid() }),
])
export const agentSchema = z.object({
  action: z.enum(['discover', 'partners', 'generate']),
  kind: z
    .enum([
      'concept_note',
      'proposal',
      'budget',
      'partnership',
      'mou',
      'report',
    ])
    .optional(),
  grantId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .optional(),
  instructions: text(12000).optional(),
})
export type Intake = z.infer<typeof intakeSchema>
export type DocumentKind = keyof typeof documentTypes
export interface CaseDocument {
  id: string
  kind: DocumentKind
  content: string
  version: number
  status: 'draft' | 'approved'
  createdAt: string
  approvedAt?: string
}
export interface ConsultancyCase extends Omit<Intake, 'consent'> {
  _id: string
  clientUserId: string
  createdBy: string
  stage: (typeof stages)[number]
  createdAt: string
  updatedAt: string
  quote?: {
    amount: number
    scope: string
    version: number
    status: 'pending' | 'accepted'
    acceptedAt?: string
  }
  payments: {
    id: string
    amount: number
    reference: string
    recordedAt: string
  }[]
  milestones: {
    id: string
    title: string
    dueDate: string
    completed: boolean
  }[]
  partners: {
    id: string
    name: string
    url: string
    role: string
    status: string
  }[]
  documents: CaseDocument[]
  matches: {
    grantId: string
    title: string
    funder: string
    url: string
    deadline: string
    reason: string
    verificationStatus: string
  }[]
  activity: { at: string; actor: string; text: string }[]
}
export interface CaseList {
  cases: ConsultancyCase[]
  isCreator: boolean
  configuration: { ai: boolean; webSearch: boolean }
}
export function mayAccessCase(
  isCreator: boolean,
  userId: string,
  clientUserId: string,
) {
  return isCreator || userId === clientUserId
}
export function canAcceptQuote(
  quote: ConsultancyCase['quote'],
  version: number,
) {
  return Boolean(
    quote && quote.status === 'pending' && quote.version === version,
  )
}
