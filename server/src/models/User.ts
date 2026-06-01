import mongoose, { Schema, Model } from 'mongoose'

export type UserRole = 'admin' | 'student' | 'researcher' | 'lecturer' | 'institution'

export interface IUser {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  organization?: string
  bio?: string
  avatar?: string
  researchInterests?: string[]
  country?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student', 'researcher', 'lecturer', 'institution'] as const, default: 'student' },
    organization: String,
    bio: String,
    avatar: String,
    researchInterests: [String],
    country: String,
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export default User
