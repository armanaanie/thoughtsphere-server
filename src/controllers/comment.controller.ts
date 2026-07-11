import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { CommentService } from '../services/comment.service'

const createComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentService.createComment(
    req.params.postId,
    req.user!.userId,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment added successfully',
    data: comment,
  })
})

const getCommentsForPost = catchAsync(async (req: Request, res: Response) => {
  const { meta, data } = await CommentService.getCommentsForPost(req.params.postId, req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    meta,
    data,
  })
})

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentService.updateComment(
    req.params.id,
    req.user!.userId,
    req.user!.role,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: comment,
  })
})

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  await CommentService.deleteComment(req.params.id, req.user!.userId, req.user!.role)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
  })
})

export const CommentController = {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
}
