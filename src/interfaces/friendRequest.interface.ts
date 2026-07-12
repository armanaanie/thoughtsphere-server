import { Document, Types } from 'mongoose'

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected'

export interface IFriendRequest extends Document {
  senderId: Types.ObjectId
  receiverId: Types.ObjectId
  status: FriendRequestStatus
  createdAt: Date
  updatedAt: Date
}
