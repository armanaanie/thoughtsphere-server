import { z } from 'zod'

export const updateProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      bio: z.string().trim().max(300).optional(),
      location: z.string().trim().max(100).optional(),
      profession: z.string().trim().max(100).optional(),
      avatar: z.string().trim().url('Avatar must be a valid URL').optional(),
      coverPhoto: z.string().trim().url('Cover photo must be a valid URL').optional(),
    })
    .strict('Unknown field in profile update. Allowed: name, bio, location, profession, avatar, coverPhoto'),
})

export const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters long'),
  }),
})

export const searchUsersValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().trim().optional(),
    page: z.string().regex(/^\d+$/, 'page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'limit must be a number').optional(),
  }),
})

export type UpdateProfileInput = z.infer<typeof updateProfileValidationSchema>['body']
export type ChangePasswordInput = z.infer<typeof changePasswordValidationSchema>['body']
