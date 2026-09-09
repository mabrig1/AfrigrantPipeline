import mongoose, { Schema } from 'mongoose'
import type { ConsultancyCase } from '@/lib/consultancy/contracts'

type StoredCase = Omit<ConsultancyCase, '_id'> & {
  consentAt: string
  agentLockUntil?: Date
}
const schema = new Schema<StoredCase>(
  {
    clientUserId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    institution: { type: String, required: true },
    careerStage: String,
    department: String,
    topic: { type: String, required: true },
    brief: { type: String, required: true },
    service: String,
    phone: String,
    deadline: String,
    consentAt: { type: String, required: true },
    stage: { type: String, default: 'requested', index: true },
    quote: {
      type: new Schema(
        {
          amount: Number,
          scope: String,
          version: Number,
          status: String,
          acceptedAt: String,
        },
        { _id: false },
      ),
      default: undefined,
    },
    payments: [
      {
        _id: false,
        id: String,
        amount: Number,
        reference: String,
        recordedAt: String,
      },
    ],
    milestones: [
      {
        _id: false,
        id: String,
        title: String,
        dueDate: String,
        completed: Boolean,
      },
    ],
    partners: [
      {
        _id: false,
        id: String,
        name: String,
        url: String,
        role: String,
        status: String,
      },
    ],
    documents: [
      {
        _id: false,
        id: String,
        kind: String,
        content: String,
        version: Number,
        status: String,
        createdAt: String,
        approvedAt: String,
      },
    ],
    matches: [
      {
        _id: false,
        grantId: String,
        title: String,
        funder: String,
        url: String,
        deadline: String,
        reason: String,
        verificationStatus: String,
      },
    ],
    activity: [{ _id: false, at: String, actor: String, text: String }],
    agentLockUntil: Date,
  },
  { timestamps: true, optimisticConcurrency: true },
)
schema.index({ clientUserId: 1, updatedAt: -1 })
export default (mongoose.models.ConsultancyCase as
  | mongoose.Model<StoredCase>
  | undefined) ?? mongoose.model<StoredCase>('ConsultancyCase', schema)
