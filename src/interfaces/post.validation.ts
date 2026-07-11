import { z } from 'zod'

export const createPostValidationSchema = z.object({
  body: z
    .object({
      content: z
        .string({ required_error: 'Post content is required' })
        .trim()
        .min(1, 'Post content cannot be empty')
        .max(5000, 'Post content cannot exceed 5000 characters'),
      images: z.array(z.string().url('Each image must be a valid URL')).max(10).optional(),
      visibility: z.enum(['public', 'friends', 'private']).optional(),
    })
    .strict(),
})

export const updatePostValidationSchema = z.object({
  body: z
    .object({
      content: z.string().trim().min(1).max(5000).optional(),
      images: z.array(z.string().url('Each image must be a valid URL')).max(10).optional(),
      visibility: z.enum(['public', 'friends', 'private']).optional(),
    })
    .strict(),
})

export const getPostsValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().trim().optional(),
    authorId: z.string().trim().optional(),
    page: z.string().regex(/^\d+$/, 'page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'limit must be a number').optional(),
    sortBy: z.enum(['newest', 'oldest', 'mostLiked']).optional(),
  }),
})

export type CreatePostInput = z.infer<typeof createPostValidationSchema>['body']
export type UpdatePostInput = z.infer<typeof updatePostValidationSchema>['body']
