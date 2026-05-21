import mongoose, { Schema, Document, Model } from 'mongoose'

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

export interface IApplication extends Document {
  grant: mongoose.Types.ObjectId
  applicant: mongoose.Types.ObjectId
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

const ApplicationSchema = new Schema<IApplication>(
  {
    grant: { type: Schema.Types.ObjectId, ref: 'Grant', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
      default: 'draft',
    },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    requestedAmount: { type: Number, required: true },
    attachments: [{ type: String }],
    aiScore: { type: Number },
    reviewerNotes: { type: String },
    submittedAt: { type: Date },
  },
  { timestamps: true }
)

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
export default Application
