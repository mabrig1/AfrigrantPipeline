import mongoose, { Schema, Model } from 'mongoose'
import type { IMentorship } from '@/types/database'

const MentorshipSchema = new Schema<IMentorship>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentor is required'],
    },
    mentee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mentee is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      minlength: [5, 'Topic must be at least 5 characters'],
      maxlength: [300, 'Topic cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'completed', 'declined'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    goals: {
      type: [String],
      default: [],
    },
    meetingFrequency: {
      type: String,
      enum: {
        values: ['weekly', 'biweekly', 'monthly', 'as_needed'],
        message: '{VALUE} is not a valid meeting frequency',
      },
      default: 'as_needed',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator(this: IMentorship, v: Date | undefined) {
          return !v || !this.startDate || v > this.startDate
        },
        message: 'End date must be after start date',
      },
    },
  },
  {
    timestamps: true,
  }
)

// A mentee can only have one active/pending request per mentor
MentorshipSchema.index(
  { mentor: 1, mentee: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'active'] } },
  }
)

// Indexes for dashboard queries
MentorshipSchema.index({ mentor: 1, status: 1 })
MentorshipSchema.index({ mentee: 1, status: 1 })
MentorshipSchema.index({ status: 1, createdAt: -1 })

// Ensure mentor and mentee are not the same person
MentorshipSchema.pre('save', function (next) {
  if (this.mentor.equals(this.mentee)) {
    next(new Error('Mentor and mentee cannot be the same user'))
  } else {
    next()
  }
})

const Mentorship: Model<IMentorship> =
  mongoose.models.Mentorship ?? mongoose.model<IMentorship>('Mentorship', MentorshipSchema)
export default Mentorship
