import mongoose, { Schema, Model } from 'mongoose'
import type { IApplication } from '@/types/database'

const ApplicationSchema = new Schema<IApplication>(
  {
    grant: {
      type: Schema.Types.ObjectId,
      ref: 'Grant',
      required: [true, 'Grant is required'],
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [5, 'Project title must be at least 5 characters'],
      maxlength: [300, 'Project title cannot exceed 300 characters'],
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: [50, 'Project description must be at least 50 characters'],
      maxlength: [5000, 'Project description cannot exceed 5000 characters'],
    },
    requestedAmount: {
      type: Number,
      required: [true, 'Requested amount is required'],
      min: [1, 'Requested amount must be greater than 0'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    aiScore: {
      type: Number,
      min: [0, 'AI score cannot be negative'],
      max: [100, 'AI score cannot exceed 100'],
    },
    reviewerNotes: {
      type: String,
      trim: true,
      maxlength: [3000, 'Reviewer notes cannot exceed 3000 characters'],
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// One application per applicant per grant
ApplicationSchema.index({ grant: 1, applicant: 1 }, { unique: true })

// Indexes for dashboard and admin queries
ApplicationSchema.index({ applicant: 1, status: 1 })
ApplicationSchema.index({ applicant: 1, createdAt: -1 })
ApplicationSchema.index({ grant: 1, status: 1 })
ApplicationSchema.index({ status: 1, submittedAt: -1 })

const Application: Model<IApplication> =
  mongoose.models.Application ?? mongoose.model<IApplication>('Application', ApplicationSchema)
export default Application
