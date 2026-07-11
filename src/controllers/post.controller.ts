import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { PostService } from '../services/post.service'

const createPost = catchAsync(async (req: Request, res: Response) => {
  const post = await PostService.createPost(req.user!.userId, req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post created successfully',
    data: post,
  })
})

const getFeed = catchAsync(async (req: Request, res: Response) => {
  const { meta, data } = await PostService.getFeed(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully',
    meta,
    data,
  })
})

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const post = await PostService.getSinglePost(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully',
    data: post,
  })
})

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const post = await PostService.updatePost(
    req.params.id,
    req.user!.userId,
    req.user!.role,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: post,
  })
})

const deletePost = catchAsync(async (req: Request, res: Response) => {
  await PostService.deletePost(req.params.id, req.user!.userId, req.user!.role)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
  })
})

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.toggleLike(req.params.id, req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.liked ? 'Post liked' : 'Post unliked',
    data: result,
  })
})

export const PostController = {
  createPost,
  getFeed,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
}
