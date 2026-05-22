import mongoose, { Schema, Model } from 'mongoose'
import type { IArticle } from '@/types/database'

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    content: { type: String, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    journal: { type: Schema.Types.ObjectId, ref: 'Journal' },
    keywords: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'published', 'rejected'],
      default: 'draft',
    },
    doi: { type: String },
    attachments: [{ type: String }],
    publishedAt: { type: Date },
  },
  { timestamps: true }
)

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)
export default Article
