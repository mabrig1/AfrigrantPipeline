import mongoose, { Schema, Model } from 'mongoose'
import type { IPeerReview } from '@/types/database'

const PeerReviewSchema = new Schema<IPeerReview>(
  {
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed', 'declined'], default: 'pending' },
    recommendation: {
      type: String,
      enum: ['accept', 'minor_revision', 'major_revision', 'reject'],
      default: null,
    },
    comments: { type: String },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

const PeerReview: Model<IPeerReview> =
  mongoose.models.PeerReview || mongoose.model<IPeerReview>('PeerReview', PeerReviewSchema)
export default PeerReview
