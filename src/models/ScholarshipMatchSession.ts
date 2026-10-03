import mongoose, { Schema, Model, Types } from 'mongoose'

export interface IScholarshipMatchSession {
  _id: Types.ObjectId
  publicId: string
  email: string
  targetLevel: 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'fellowship'
  profile: {
    nationality: string
    field: string
    gpa?: number
    workExperienceYears: number
    keywords: string[]
    educationSummary: string
    experienceSummary: string
  }
  readinessScore: number
  screenedCount: number
  matchCount: number
  strongCount: number
  possibleCount: number
  matches: Array<{
    grant: Types.ObjectId
    score: number
    label: 'Strong match' | 'Possible match' | 'Low match'
    reasons: string[]
    gaps: string[]
  }>
  unlockedAt?: Date
  paymentReference?: string
  paymentCurrency?: 'NGN' | 'USD'
  paymentAmountMinor?: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const ScholarshipMatchSessionSchema = new Schema<IScholarshipMatchSession>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    targetLevel: {
      type: String,
      enum: ['undergraduate', 'masters', 'phd', 'postdoc', 'fellowship'],
      required: true,
    },
    profile: {
      nationality: { type: String, required: true },
      field: { type: String, required: true },
      gpa: Number,
      workExperienceYears: { type: Number, default: 0 },
      keywords: { type: [String], default: [] },
      educationSummary: String,
      experienceSummary: String,
    },
    readinessScore: { type: Number, required: true, min: 0, max: 100 },
    screenedCount: { type: Number, required: true, min: 0 },
    matchCount: { type: Number, required: true, min: 0 },
    strongCount: { type: Number, required: true, min: 0 },
    possibleCount: { type: Number, required: true, min: 0 },
    matches: [
      {
        grant: { type: Schema.Types.ObjectId, ref: 'Grant', required: true },
        score: { type: Number, required: true },
        label: {
          type: String,
          enum: ['Strong match', 'Possible match', 'Low match'],
          required: true,
        },
        reasons: { type: [String], default: [] },
        gaps: { type: [String], default: [] },
      },
    ],
    unlockedAt: Date,
    paymentReference: { type: String, trim: true },
    paymentCurrency: { type: String, enum: ['NGN', 'USD'] },
    paymentAmountMinor: Number,
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

ScholarshipMatchSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const ScholarshipMatchSession: Model<IScholarshipMatchSession> =
  mongoose.models.ScholarshipMatchSession ??
  mongoose.model<IScholarshipMatchSession>('ScholarshipMatchSession', ScholarshipMatchSessionSchema)

export default ScholarshipMatchSession
