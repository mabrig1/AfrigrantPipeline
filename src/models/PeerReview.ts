import mongoose, { Schema, Model } from 'mongoose'
import type { IPeerReview } from '@/types/database'

const PeerReviewSchema = new Schema<IPeerReview>(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article is required'],
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'declined'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    recommendation: {
      type: String,
      enum: {
        values: ['accept', 'minor_revision', 'major_revision', 'reject'],
        message: '{VALUE} is not a valid recommendation',
      },
      default: null,
      // Required when status is completed
      validate: {
        validator(this: IPeerReview, v: string | null) {
          return this.status !== 'completed' || v !== null
        },
        message: 'Recommendation is required when review is completed',
      },
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [5000, 'Comments cannot exceed 5000 characters'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// A reviewer can only be assigned to an article once
PeerReviewSchema.index({ article: 1, reviewer: 1 }, { unique: true })

// Indexes for reviewer dashboard and article management
PeerReviewSchema.index({ reviewer: 1, status: 1 })
PeerReviewSchema.index({ article: 1, status: 1 })
PeerReviewSchema.index({ status: 1, dueDate: 1 })

const PeerReview: Model<IPeerReview> =
  mongoose.models.PeerReview ?? mongoose.model<IPeerReview>('PeerReview', PeerReviewSchema)
export default PeerReview
