import { Document, Types } from 'mongoose'

export type PostVisibility = 'public' | 'friends' | 'private'

export interface IPost extends Document {
  authorId: Types.ObjectId
  content: string
  images: string[]
  visibility: PostVisibility
  likes: Types.ObjectId[]
  commentsCount: number
  createdAt: Date
  updatedAt: Date
}
