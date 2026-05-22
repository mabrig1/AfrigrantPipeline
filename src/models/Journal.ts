import mongoose, { Schema, Model } from 'mongoose'
import type { IJournal } from '@/types/database'

const JournalSchema = new Schema<IJournal>(
  {
    name: {
      type: String,
      required: [true, 'Journal name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Journal name must be at least 3 characters'],
      maxlength: [300, 'Journal name cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    issn: {
      type: String,
      trim: true,
      // Matches both print ISSN (XXXX-XXXX) and electronic ISSN
      match: [/^\d{4}-\d{3}[\dX]$/, 'ISSN must be in the format XXXX-XXXX'],
      sparse: true,
    },
    editors: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    isOpenAccess: {
      type: Boolean,
      default: true,
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL'],
    },
    impactFactor: {
      type: Number,
      min: [0, 'Impact factor cannot be negative'],
    },
    submissionGuidelines: {
      type: String,
      trim: true,
      maxlength: [5000, 'Submission guidelines cannot exceed 5000 characters'],
    },
  },
  { timestamps: true }
)

// Unique sparse index on ISSN
JournalSchema.index({ issn: 1 }, { unique: true, sparse: true })

// Text search index
JournalSchema.index({ name: 'text', description: 'text' })

// Indexes for filtering
JournalSchema.index({ categories: 1 })
JournalSchema.index({ isOpenAccess: 1 })
JournalSchema.index({ createdAt: -1 })

const Journal: Model<IJournal> =
  mongoose.models.Journal ?? mongoose.model<IJournal>('Journal', JournalSchema)
export default Journal
