import mongoose, { Schema, Model } from 'mongoose'
import type { ICollaboration } from '@/types/database'

const CollaborationSchema = new Schema<ICollaboration>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

const Collaboration: Model<ICollaboration> =
  mongoose.models.Collaboration || mongoose.model<ICollaboration>('Collaboration', CollaborationSchema)
export default Collaboration
