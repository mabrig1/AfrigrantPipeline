import mongoose, { Schema, Model } from 'mongoose'
import type { IGrant } from '@/types/database'

type GrantVerificationStatus = 'unverified' | 'needs_review' | 'verified' | 'stale'
type GrantDiscoveryMethod = 'manual' | 'agent' | 'import'

export interface IAgenticGrant extends IGrant {
  fundingText?: string
  isRolling?: boolean
  sourceName?: string
  sourceUrl?: string
  sourceDomain?: string
  lastCheckedAt?: Date
  lastVerifiedAt?: Date
  verificationStatus?: GrantVerificationStatus
  confidenceScore?: number
  relevanceScore?: number
  nigeriaEligible?: boolean
  agentNotes?: string
  fingerprint?: string
  discoveredBy?: GrantDiscoveryMethod
}

const GrantSchema = new Schema<IAgenticGrant>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    funder: {
      type: String,
      required: [true, 'Funder is required'],
      trim: true,
      maxlength: [200, 'Funder name cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{3}$/, 'Currency must be a valid 3-letter ISO code'],
    },
    fundingText: {
      type: String,
      trim: true,
      maxlength: [500, 'Funding text cannot exceed 500 characters'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    isRolling: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed', 'draft'],
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
    },
    grantType: {
      type: String,
      enum: {
        values: ['research', 'project', 'scholarship', 'fellowship', 'seed', 'other'],
        message: '{VALUE} is not a valid grant type',
      },
      default: 'other',
    },
    eligibility: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    countries: {
      type: [String],
      default: [],
    },
    region: {
      type: String,
      trim: true,
      maxlength: [100, 'Region cannot exceed 100 characters'],
    },
    applicationLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Application link must be a valid URL'],
    },
    sourceName: {
      type: String,
      trim: true,
      maxlength: [200, 'Source name cannot exceed 200 characters'],
    },
    sourceUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Source URL must be a valid URL'],
    },
    sourceDomain: {
      type: String,
      trim: true,
      maxlength: [255, 'Source domain cannot exceed 255 characters'],
    },
    lastCheckedAt: {
      type: Date,
    },
    lastVerifiedAt: {
      type: Date,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'needs_review', 'verified', 'stale'],
      default: 'unverified',
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    nigeriaEligible: {
      type: Boolean,
      default: false,
    },
    agentNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Agent notes cannot exceed 1000 characters'],
    },
    fingerprint: {
      type: String,
      trim: true,
      maxlength: 128,
    },
    discoveredBy: {
      type: String,
      enum: ['manual', 'agent', 'import'],
      default: 'manual',
    },
    bookmarkedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  { timestamps: true }
)

// Compound text index for search
GrantSchema.index({ title: 'text', description: 'text', funder: 'text' })

// Indexes for filtered, sorted and agentic grant-intelligence queries
GrantSchema.index({ status: 1, deadline: 1 })
GrantSchema.index({ status: 1, createdAt: -1 })
GrantSchema.index({ categories: 1 })
GrantSchema.index({ grantType: 1 })
GrantSchema.index({ region: 1 })
GrantSchema.index({ countries: 1 })
GrantSchema.index({ createdBy: 1 })
GrantSchema.index({ funder: 1 })
GrantSchema.index({ deadline: 1 })
GrantSchema.index({ discoveredBy: 1, status: 1, relevanceScore: -1 })
GrantSchema.index({ verificationStatus: 1, lastCheckedAt: -1 })
GrantSchema.index({ nigeriaEligible: 1, status: 1, deadline: 1 })
GrantSchema.index({ sourceDomain: 1 })
GrantSchema.index({ fingerprint: 1 }, { unique: true, sparse: true })

const Grant: Model<IAgenticGrant> =
  mongoose.models.Grant ?? mongoose.model<IAgenticGrant>('Grant', GrantSchema)

export default Grant
