import { z } from 'zod'

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim().min(2).max(100),
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
  }),
})

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

export type RegisterInput = z.infer<typeof registerValidationSchema>['body']
export type LoginInput = z.infer<typeof loginValidationSchema>['body']
