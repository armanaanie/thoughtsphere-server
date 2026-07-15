import { Document, Types } from 'mongoose'

export type NotificationType =
  | 'friend_request'
  | 'friend_accept'
  | 'like'
  | 'comment'

export interface INotification extends Document {
  userId: Types.ObjectId // recipient
  type: NotificationType
  message: string
  relatedId?: Types.ObjectId // e.g. the post, or the friend request, this notification is about
  isRead: boolean
  createdAt: Date
}
