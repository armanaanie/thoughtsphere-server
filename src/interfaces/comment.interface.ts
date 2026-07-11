import { Document, Types } from 'mongoose'

export interface IComment extends Document {
  postId: Types.ObjectId
  userId: Types.ObjectId
  comment: string
  createdAt: Date
  updatedAt: Date
}
