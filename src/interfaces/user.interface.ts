import { Document, Types } from 'mongoose'

export type UserRole = 'user' | 'admin'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  coverPhoto?: string
  bio?: string
  location?: string
  profession?: string
  role: UserRole
  isVerified: boolean
  isSuspended: boolean
  friends: Types.ObjectId[]
  friendRequests: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}
