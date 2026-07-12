import { z } from 'zod'

const objectIdRegex = /^[0-9a-fA-F]{24}$/

export const sendFriendRequestValidationSchema = z.object({
  body: z
    .object({
      receiverId: z
        .string({ required_error: 'receiverId is required' })
        .regex(objectIdRegex, 'receiverId must be a valid user id'),
    })
    .strict(),
})

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestValidationSchema>['body']
