import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { UpdateProfileInput, ChangePasswordInput } from '../interfaces/user.validation'

type SearchQuery = {
  searchTerm?: string
  page?: string
  limit?: string
}

const getAllUsers = async (query: SearchQuery) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {}
  if (query.searchTerm) {
    filter.$or = [
      { name: { $regex: query.searchTerm, $options: 'i' } },
      { email: { $regex: query.searchTerm, $options: 'i' } },
    ]
  }

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(filter),
  ])

  return {
    meta: { page, limit, total },
    data: users,
  }
}

const getSingleUser = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }
  return user
}

const updateProfile = async (
  targetUserId: string,
  requesterId: string,
  requesterRole: string,
  payload: UpdateProfileInput
) => {
  if (targetUserId !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own profile.')
  }

  const user = await User.findByIdAndUpdate(targetUserId, payload, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }

  return user
}

const changePassword = async (
  targetUserId: string,
  requesterId: string,
  payload: ChangePasswordInput
) => {
  if (targetUserId !== requesterId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only change your own password.')
  }

  const user = await User.findById(targetUserId).select('+password')
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }

  const isCurrentPasswordValid = await user.comparePassword(payload.currentPassword)
  if (!isCurrentPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect.')
  }

  const isSameAsOld = await bcrypt.compare(payload.newPassword, user.password)
  if (isSameAsOld) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'New password must be different from the current password.')
  }

  // Assigning triggers the pre('save') hook, which hashes it using bcrypt_salt_rounds
  user.password = payload.newPassword
  await user.save()

  return null
}

const deleteUser = async (
  targetUserId: string,
  requesterId: string,
  requesterRole: string
) => {
  if (targetUserId !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own account.')
  }

  const user = await User.findByIdAndDelete(targetUserId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }

  return null
}

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateProfile,
  changePassword,
  deleteUser,
}
