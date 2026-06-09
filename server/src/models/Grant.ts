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
  grantType?: 'research' | 'project' | 'scholarship' | 'fellowship' | 'seed' | 'other'
  eligibility: string[]
  categories: string[]
  countries: string[]
  region?: string
  applicationLink?: string
  bookmarkedBy: mongoose.Types.ObjectId[]
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
    grantType: { type: String, enum: ['research', 'project', 'scholarship', 'fellowship', 'seed', 'other'] },
    eligibility: [String],
    categories: [String],
    countries: [String],
    region: String,
    applicationLink: String,
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

GrantSchema.index({ title: 'text', description: 'text', funder: 'text' })

const Grant: Model<IGrant> = mongoose.models.Grant || mongoose.model<IGrant>('Grant', GrantSchema)
export default Grant
