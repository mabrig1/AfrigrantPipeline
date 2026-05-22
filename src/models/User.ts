import mongoose, { Schema, Model } from 'mongoose'
import type { IUser } from '@/types/database'

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'applicant', 'reviewer', 'researcher'], default: 'applicant' },
    organization: { type: String },
    bio: { type: String },
    avatar: { type: String },
    researchInterests: [{ type: String }],
    country: { type: String },
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export default User
