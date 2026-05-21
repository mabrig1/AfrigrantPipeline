import mongoose, { Schema, Document, Model } from 'mongoose'

export type GrantStatus = 'open' | 'closed' | 'draft'

export interface IGrant extends Document {
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: Date
  status: GrantStatus
  eligibility: string[]
  categories: string[]
  applicationLink?: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const GrantSchema = new Schema<IGrant>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    funder: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
    eligibility: [{ type: String }],
    categories: [{ type: String }],
    applicationLink: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Grant: Model<IGrant> = mongoose.models.Grant || mongoose.model<IGrant>('Grant', GrantSchema)
export default Grant
