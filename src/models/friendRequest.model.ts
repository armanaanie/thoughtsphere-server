import { Schema, model } from 'mongoose'
import { IFriendRequest } from '../interfaces/friendRequest.interface'

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Prevent the same sender from spamming duplicate pending requests to the same receiver
friendRequestSchema.index(
  { senderId: 1, receiverId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
)

export const FriendRequest = model<IFriendRequest>('FriendRequest', friendRequestSchema)
