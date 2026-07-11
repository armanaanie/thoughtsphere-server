import httpStatus from 'http-status'
import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { signToken } from '../utils/jwt'
import { config } from '../config'
import { RegisterInput, LoginInput } from '../interfaces/auth.validation'

const generateTokens = (user: { _id: unknown; email: string; role: string }) => {
  const payload = { userId: String(user._id), email: user.email, role: user.role }
  const accessToken = signToken(payload, config.jwt.accessSecret, config.jwt.accessExpiresIn)
  const refreshToken = signToken(payload, config.jwt.refreshSecret, config.jwt.refreshExpiresIn)
  return { accessToken, refreshToken }
}

const register = async (payload: RegisterInput) => {
  const existingUser = await User.findOne({ email: payload.email })
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'An account with this email already exists.')
  }

  // Password hashing happens automatically in the User model's pre-save hook
  const user = await User.create(payload)
  const tokens = generateTokens(user)

  return { user, ...tokens }
}

const login = async (payload: LoginInput) => {
  // password has `select: false` in the schema, so we explicitly request it here
  const user = await User.findOne({ email: payload.email }).select('+password')
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password.')
  }

  if (user.isSuspended) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been suspended.')
  }

  const isPasswordValid = await user.comparePassword(payload.password)
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password.')
  }

  const tokens = generateTokens(user)

  return { user, ...tokens }
}

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found.')
  }
  return user
}

export const AuthService = { register, login, getMe }
