import { z } from 'zod'

export const createCommentValidationSchema = z.object({
  body: z
    .object({
      comment: z
        .string({ required_error: 'Comment text is required' })
        .trim()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment cannot exceed 1000 characters'),
    })
    .strict(),
})

export const updateCommentValidationSchema = z.object({
  body: z
    .object({
      comment: z
        .string({ required_error: 'Comment text is required' })
        .trim()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment cannot exceed 1000 characters'),
    })
    .strict(),
})

export const getCommentsValidationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'limit must be a number').optional(),
  }),
})

export type CreateCommentInput = z.infer<typeof createCommentValidationSchema>['body']
export type UpdateCommentInput = z.infer<typeof updateCommentValidationSchema>['body']
