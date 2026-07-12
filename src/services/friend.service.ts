import httpStatus from 'http-status'
import { FriendRequest } from '../models/friendRequest.model'
import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { SendFriendRequestInput } from '../interfaces/friendRequest.validation'

const sendRequest = async (senderId: string, payload: SendFriendRequestInput) => {
  const { receiverId } = payload

  if (senderId === receiverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot send a friend request to yourself.')
  }

  const receiver = await User.findById(receiverId)
  if (!receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }

  const sender = await User.findById(senderId)
  if (sender!.friends.some((id) => id.toString() === receiverId)) {
    throw new ApiError(httpStatus.CONFLICT, 'You are already friends with this user.')
  }

  // Check both directions — if the other person already sent one, accept theirs instead
  const existingReverse = await FriendRequest.findOne({
    senderId: receiverId,
    receiverId: senderId,
    status: 'pending',
  })
  if (existingReverse) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'This user already sent you a friend request. Accept it instead of sending a new one.'
    )
  }

  const existing = await FriendRequest.findOne({
    senderId,
    receiverId,
    status: 'pending',
  })
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'You already have a pending request to this user.')
  }

  const request = await FriendRequest.create({ senderId, receiverId, status: 'pending' })
  return request.populate('receiverId', 'name avatar')
}

const respondToRequest = async (
  requestId: string,
  receiverId: string,
  action: 'accept' | 'reject'
) => {
  const request = await FriendRequest.findById(requestId)
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Friend request not found.')
  }

  if (request.receiverId.toString() !== receiverId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only respond to requests sent to you.')
  }

  if (request.status !== 'pending') {
    throw new ApiError(httpStatus.CONFLICT, 'This request has already been responded to.')
  }

  if (action === 'accept') {
    await User.findByIdAndUpdate(request.senderId, {
      $addToSet: { friends: request.receiverId },
    })
    await User.findByIdAndUpdate(request.receiverId, {
      $addToSet: { friends: request.senderId },
    })
  }

  // Whether accepted or rejected, the pending request is resolved — remove it.
  // Friendship state itself lives on User.friends, not on this document.
  await request.deleteOne()

  return { status: action === 'accept' ? 'accepted' : 'rejected' }
}

const getFriendsList = async (userId: string) => {
  const user = await User.findById(userId).populate('friends', 'name avatar bio location')
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }
  return user.friends
}

const getPendingRequests = async (userId: string) => {
  const requests = await FriendRequest.find({ receiverId: userId, status: 'pending' })
    .sort('-createdAt')
    .populate('senderId', 'name avatar bio')
  return requests
}

const unfriend = async (userId: string, friendId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }

  if (!user.friends.some((id) => id.toString() === friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not friends with this user.')
  }

  await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } })
  await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } })

  return null
}

export const FriendService = {
  sendRequest,
  respondToRequest,
  getFriendsList,
  getPendingRequests,
  unfriend,
}
