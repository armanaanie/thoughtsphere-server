import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from '../interfaces/user.interface'
import { config } from '../config'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default in queries
    },
    avatar: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 300 },
    location: { type: String, default: '' },
    profession: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Hash password before saving — only when it's actually being set/changed.
// Throwing (instead of just logging) ensures the save is aborted on failure.
userSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return

  const hashed = await bcrypt.hash(this.password, config.bcrypt_salt_rounds)
  this.password = hashed
})

// Never expose the password hash or __v in JSON responses, even by accident
userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    const { password, ...rest } = ret
    return rest
  },
})

userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = model<IUser>('User', userSchema)
