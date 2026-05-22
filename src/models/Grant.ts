import mongoose, { Schema, Model } from 'mongoose'
import type { IGrant } from '@/types/database'

const GrantSchema = new Schema<IGrant>(
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
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
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

// Indexes for filtered and sorted queries
GrantSchema.index({ status: 1, deadline: 1 })
GrantSchema.index({ status: 1, createdAt: -1 })
GrantSchema.index({ categories: 1 })
GrantSchema.index({ grantType: 1 })
GrantSchema.index({ region: 1 })
GrantSchema.index({ countries: 1 })
GrantSchema.index({ createdBy: 1 })
GrantSchema.index({ funder: 1 })
GrantSchema.index({ deadline: 1 })

const Grant: Model<IGrant> = mongoose.models.Grant ?? mongoose.model<IGrant>('Grant', GrantSchema)
export default Grant
