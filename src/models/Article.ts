import mongoose, { Schema, Model } from 'mongoose'
import type { IArticle } from '@/types/database'

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
      minlength: [50, 'Abstract must be at least 50 characters'],
      maxlength: [3000, 'Abstract cannot exceed 3000 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    authors: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: [true, 'At least one author is required'],
      validate: {
        validator: (v: mongoose.Types.ObjectId[]) => v.length > 0,
        message: 'Article must have at least one author',
      },
    },
    journal: {
      type: Schema.Types.ObjectId,
      ref: 'Journal',
    },
    keywords: {
      type: [String],
      default: [],
      set: (kws: string[]) => kws.map((k) => k.toLowerCase().trim()),
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'submitted', 'under_review', 'published', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
    doi: {
      type: String,
      trim: true,
      match: [/^10\.\d{4,9}\/\S+$/, 'DOI must be in the format 10.XXXX/XXXX'],
      sparse: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, 'View count cannot be negative'],
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
      maxlength: [10, 'Language code cannot exceed 10 characters'],
    },
    license: {
      type: String,
      enum: {
        values: ['CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'CC0', 'all-rights-reserved'],
        message: '{VALUE} is not a valid license',
      },
      default: 'all-rights-reserved',
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Unique sparse index on DOI (not all articles have one)
ArticleSchema.index({ doi: 1 }, { unique: true, sparse: true })

// Compound text index for search
ArticleSchema.index({ title: 'text', abstract: 'text', keywords: 'text' })

// Indexes for filtered and sorted queries
ArticleSchema.index({ status: 1, publishedAt: -1 })
ArticleSchema.index({ status: 1, createdAt: -1 })
ArticleSchema.index({ authors: 1 })
ArticleSchema.index({ journal: 1, status: 1 })
ArticleSchema.index({ keywords: 1 })
ArticleSchema.index({ language: 1 })

const Article: Model<IArticle> =
  mongoose.models.Article ?? mongoose.model<IArticle>('Article', ArticleSchema)
export default Article
