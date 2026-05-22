import mongoose, { Schema, Model } from 'mongoose'

export type ArticleStatus = 'draft' | 'submitted' | 'under_review' | 'published' | 'rejected'
export type ArticleLicense = 'CC BY' | 'CC BY-SA' | 'CC BY-NC' | 'CC BY-ND' | 'CC0' | 'All Rights Reserved'

export interface IArticle {
  _id: mongoose.Types.ObjectId
  title: string
  abstract: string
  content: string
  authors: mongoose.Types.ObjectId[]
  journal?: mongoose.Types.ObjectId
  keywords: string[]
  status: ArticleStatus
  doi?: string
  attachments: string[]
  viewCount: number
  language: string
  license: ArticleLicense
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true },
    content: { type: String, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    journal: { type: Schema.Types.ObjectId, ref: 'Journal' },
    keywords: [{ type: String, lowercase: true, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'published', 'rejected'],
      default: 'draft',
    },
    doi: { type: String, sparse: true, unique: true },
    attachments: [String],
    viewCount: { type: Number, default: 0 },
    language: { type: String, default: 'en' },
    license: {
      type: String,
      enum: ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-ND', 'CC0', 'All Rights Reserved'],
      default: 'CC BY',
    },
    publishedAt: Date,
  },
  { timestamps: true },
)

ArticleSchema.index({ title: 'text', abstract: 'text', keywords: 'text' })
ArticleSchema.index({ status: 1, publishedAt: -1 })
ArticleSchema.index({ journal: 1 })
ArticleSchema.index({ authors: 1 })

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)
export default Article
