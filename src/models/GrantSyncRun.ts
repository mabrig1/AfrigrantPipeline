import mongoose, { Schema, Model } from 'mongoose'

export type GrantSyncRunStatus = 'running' | 'completed' | 'failed'

export interface IGrantSyncRun {
  startedAt: Date
  completedAt?: Date
  status: GrantSyncRunStatus
  triggeredBy: string
  provider?: string
  model?: string
  sourcesChecked: number
  candidatesFound: number
  created: number
  updated: number
  skipped: number
  errors: string[]
  createdAt: Date
  updatedAt: Date
}

const GrantSyncRunSchema = new Schema<IGrantSyncRun>(
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
    errors: { type: [String], default: [] },
  },
  { timestamps: true }
)

GrantSyncRunSchema.index({ startedAt: -1 })
GrantSyncRunSchema.index({ status: 1, startedAt: -1 })

const GrantSyncRun: Model<IGrantSyncRun> =
  mongoose.models.GrantSyncRun ?? mongoose.model<IGrantSyncRun>('GrantSyncRun', GrantSyncRunSchema)

export default GrantSyncRun
