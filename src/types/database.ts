import type { Types } from 'mongoose'

// ── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'student' | 'researcher' | 'lecturer' | 'institution'

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  role: UserRole
  organization?: string
  bio?: string
  avatar?: string
  researchInterests?: string[]
  country?: string
  website?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

// ── Grant ────────────────────────────────────────────────────────────────────

export type GrantStatus = 'open' | 'closed' | 'draft'
export type GrantType = 'research' | 'project' | 'scholarship' | 'fellowship' | 'seed' | 'other'

export interface IGrant {
  _id: Types.ObjectId
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: Date
  status: GrantStatus
  grantType: GrantType
  eligibility: string[]
  categories: string[]
  countries: string[]
  region?: string
  applicationLink?: string
  bookmarkedBy?: Types.ObjectId[]
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IGrantBookmark {
  _id: Types.ObjectId
  user: Types.ObjectId
  grant: Types.ObjectId
  createdAt: Date
}

// ── Application ──────────────────────────────────────────────────────────────

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

export interface IApplication {
  _id: Types.ObjectId
  grant: Types.ObjectId
  applicant: Types.ObjectId
  status: ApplicationStatus
  projectTitle: string
  projectDescription: string
  requestedAmount: number
  attachments: string[]
  aiScore?: number
  reviewerNotes?: string
  submittedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ── Article ──────────────────────────────────────────────────────────────────

export type ArticleStatus = 'draft' | 'submitted' | 'under_review' | 'published' | 'rejected'
export type ArticleLicense = 'CC BY' | 'CC BY-SA' | 'CC BY-NC' | 'CC BY-ND' | 'CC0' | 'All Rights Reserved'

export interface IArticle {
  _id: Types.ObjectId
  title: string
  abstract: string
  content: string
  authors: Types.ObjectId[]
  journal?: Types.ObjectId
  keywords: string[]
  status: ArticleStatus
  doi?: string
  attachments: string[]
  viewCount: number
  language: string
  license: ArticleLicense
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ── Journal ──────────────────────────────────────────────────────────────────

export interface IJournal {
  _id: Types.ObjectId
  name: string
  description: string
  issn?: string
  editors: Types.ObjectId[]
  categories: string[]
  isOpenAccess: boolean
  website?: string
  impactFactor?: number
  submissionGuidelines?: string
  createdAt: Date
  updatedAt: Date
}

// ── PeerReview ───────────────────────────────────────────────────────────────

export type PeerReviewStatus = 'pending' | 'completed' | 'declined'
export type PeerReviewRecommendation = 'accept' | 'minor_revision' | 'major_revision' | 'reject'

export interface IPeerReview {
  _id: Types.ObjectId
  article: Types.ObjectId
  reviewer: Types.ObjectId
  status: PeerReviewStatus
  recommendation: PeerReviewRecommendation | null
  comments?: string
  dueDate: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ── Collaboration ─────────────────────────────────────────────────────────────

export type CollaborationStatus = 'open' | 'closed' | 'completed'

export interface ICollaboration {
  _id: Types.ObjectId
  title: string
  description: string
  owner: Types.ObjectId
  members: Types.ObjectId[]
  status: CollaborationStatus
  tags: string[]
  requiredSkills: string[]
  maxMembers?: number
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

// ── Mentorship ────────────────────────────────────────────────────────────────

export type MentorshipStatus = 'pending' | 'active' | 'completed' | 'declined'
export type MeetingFrequency = 'weekly' | 'biweekly' | 'monthly' | 'as_needed'

export interface IMentorship {
  _id: Types.ObjectId
  mentor: Types.ObjectId
  mentee: Types.ObjectId
  topic: string
  status: MentorshipStatus
  message?: string
  goals: string[]
  meetingFrequency: MeetingFrequency
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}
