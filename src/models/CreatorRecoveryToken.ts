import mongoose, { Schema, Model } from 'mongoose'

interface ICreatorRecoveryToken {
  email: string
  tokenHash: string
  expiresAt: Date
  usedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const CreatorRecoveryTokenSchema = new Schema<ICreatorRecoveryToken>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'creator_recovery_tokens',
  },
)

CreatorRecoveryTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const CreatorRecoveryToken: Model<ICreatorRecoveryToken> =
  mongoose.models.CreatorRecoveryToken ??
  mongoose.model<ICreatorRecoveryToken>(
    'CreatorRecoveryToken',
    CreatorRecoveryTokenSchema,
  )

export default CreatorRecoveryToken
