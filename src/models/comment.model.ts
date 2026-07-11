import { Schema, model } from 'mongoose'
import { IComment } from '../interfaces/comment.interface'

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    comment: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Comments are almost always listed per-post, newest first
commentSchema.index({ postId: 1, createdAt: -1 })

export const Comment = model<IComment>('Comment', commentSchema)
