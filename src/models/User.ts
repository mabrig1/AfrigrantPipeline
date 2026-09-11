import mongoose, { Schema, Model } from 'mongoose'
import type { IUser } from '@/types/database'

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'student', 'researcher', 'lecturer', 'institution'],
        message: '{VALUE} is not a valid role',
      },
      default: 'student',
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [200, 'Organization name cannot exceed 200 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    avatar: {
      type: String,
      trim: true,
    },
    researchInterests: {
      type: [String],
      default: [],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name cannot exceed 100 characters'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL'],
    },
    emailVerified: {
      type: Date,
    },
    emergencyResetUsedAt: {
      type: Date,
    },
    emergencyLoginUsedAt: {
      type: Date,
    },
    subscription: {
      type: String,
      enum: ['free', 'silver', 'gold', 'platinum'],
      default: 'free',
    },
    subscriptionExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Compound text index for search
UserSchema.index({ name: 'text', organization: 'text', bio: 'text' })

// Indexes for filtered queries
UserSchema.index({ role: 1 })
UserSchema.index({ country: 1 })
UserSchema.index({ createdAt: -1 })

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
export default User
