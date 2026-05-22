import mongoose, { Schema, Model } from 'mongoose'

export interface IGrant {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: Date
  status: 'open' | 'closed' | 'draft'
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
    eligibility: [String],
    categories: [String],
    applicationLink: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Grant: Model<IGrant> = mongoose.models.Grant || mongoose.model<IGrant>('Grant', GrantSchema)
export default Grant
