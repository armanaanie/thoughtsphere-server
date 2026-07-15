import { Schema, model } from 'mongoose'
import { INotification } from '../interfaces/notification.interface'

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    type: {
      type: String,
      enum: ['friend_request', 'friend_accept', 'like', 'comment'],
      required: [true, 'Notification type is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
)

// The main read pattern: "my notifications, newest first" and "my unread count"
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, isRead: 1 })

export const Notification = model<INotification>('Notification', notificationSchema)
