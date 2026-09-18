import mongoose, { Schema, Model } from 'mongoose'

export type ScholarshipSyncRunStatus = 'running' | 'completed' | 'failed'

export interface IScholarshipSyncRun {
  startedAt: Date
  completedAt?: Date
  status: ScholarshipSyncRunStatus
  triggeredBy: string
  provider?: string
  model?: string
  sourcesChecked: number
  candidatesFound: number
  created: number
  updated: number
  skipped: number
  verified: number
  errors: string[]
  createdAt: Date
  updatedAt: Date
}

const ScholarshipSyncRunSchema = new Schema<IScholarshipSyncRun>(
  {
    startedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed'],
      default: 'running',
      required: true,
    },
    triggeredBy: { type: String, required: true, trim: true, maxlength: 200 },
    provider: { type: String, trim: true, maxlength: 100 },
    model: { type: String, trim: true, maxlength: 200 },
    sourcesChecked: { type: Number, default: 0, min: 0 },
    candidatesFound: { type: Number, default: 0, min: 0 },
    created: { type: Number, default: 0, min: 0 },
    updated: { type: Number, default: 0, min: 0 },
    skipped: { type: Number, default: 0, min: 0 },
    verified: { type: Number, default: 0, min: 0 },
    errors: { type: [String], default: [] },
  },
  { timestamps: true }
)

ScholarshipSyncRunSchema.index({ startedAt: -1 })
ScholarshipSyncRunSchema.index({ status: 1, startedAt: -1 })

const ScholarshipSyncRun: Model<IScholarshipSyncRun> =
  mongoose.models.ScholarshipSyncRun ??
  mongoose.model<IScholarshipSyncRun>('ScholarshipSyncRun', ScholarshipSyncRunSchema)

export default ScholarshipSyncRun
