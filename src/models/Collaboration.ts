import mongoose, { Schema, Model } from 'mongoose'
import type { ICollaboration } from '@/types/database'

const CollaborationSchema = new Schema<ICollaboration>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'open',
    },
    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) => tags.map((t) => t.toLowerCase().trim()),
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    maxMembers: {
      type: Number,
      min: [2, 'maxMembers must be at least 2'],
      max: [100, 'maxMembers cannot exceed 100'],
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Compound text index for search
CollaborationSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Indexes for filtered and sorted queries
CollaborationSchema.index({ status: 1, createdAt: -1 })
CollaborationSchema.index({ owner: 1 })
CollaborationSchema.index({ members: 1 })
CollaborationSchema.index({ tags: 1 })
CollaborationSchema.index({ deadline: 1 })

const Collaboration: Model<ICollaboration> =
  mongoose.models.Collaboration ?? mongoose.model<ICollaboration>('Collaboration', CollaborationSchema)
export default Collaboration
