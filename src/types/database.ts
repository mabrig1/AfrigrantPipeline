import type { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  role: 'admin' | 'applicant' | 'reviewer' | 'researcher'
  organization?: string
  bio?: string
  avatar?: string
  researchInterests?: string[]
  country?: string
  createdAt: Date
  updatedAt: Date
}

export interface IGrant {
  _id: Types.ObjectId
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: Date
  status: 'open' | 'closed' | 'draft'
  eligibility: string[]
  categories: string[]
  applicationLink?: string
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

export interface IApplication {
  _id: Types.ObjectId
  grant: Types.ObjectId
  applicant: Types.ObjectId
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
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

export interface IArticle {
  _id: Types.ObjectId
  title: string
  abstract: string
  content: string
  authors: Types.ObjectId[]
  journal?: Types.ObjectId
  keywords: string[]
  status: 'draft' | 'submitted' | 'under_review' | 'published' | 'rejected'
  doi?: string
  attachments: string[]
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IJournal {
  _id: Types.ObjectId
  name: string
  description: string
  issn?: string
  editors: Types.ObjectId[]
  categories: string[]
  isOpenAccess: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IPeerReview {
  _id: Types.ObjectId
  article: Types.ObjectId
  reviewer: Types.ObjectId
  status: 'pending' | 'completed' | 'declined'
  recommendation: 'accept' | 'minor_revision' | 'major_revision' | 'reject' | null
  comments?: string
  dueDate: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ICollaboration {
  _id: Types.ObjectId
  title: string
  description: string
  owner: Types.ObjectId
  members: Types.ObjectId[]
  status: 'open' | 'closed' | 'completed'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IMentorship {
  _id: Types.ObjectId
  mentor: Types.ObjectId
  mentee: Types.ObjectId
  topic: string
  status: 'pending' | 'active' | 'completed' | 'declined'
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}
