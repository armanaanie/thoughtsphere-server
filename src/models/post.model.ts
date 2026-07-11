import { Schema, model } from 'mongoose'
import { IPost } from '../interfaces/post.interface'

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [5000, 'Post content cannot exceed 5000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public',
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Feed queries filter by visibility and sort by recency — index supports both patterns
postSchema.index({ visibility: 1, createdAt: -1 })

export const Post = model<IPost>('Post', postSchema)
