import mongoose, { Schema, Model } from 'mongoose'
import type { IJournal } from '@/types/database'

const JournalSchema = new Schema<IJournal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    issn: { type: String },
    editors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    categories: [{ type: String }],
    isOpenAccess: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Journal: Model<IJournal> =
  mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema)
export default Journal
