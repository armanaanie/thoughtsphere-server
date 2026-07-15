import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { SavedPostService } from '../services/savedPost.service'

const savePost = catchAsync(async (req: Request, res: Response) => {
  const saved = await SavedPostService.savePost(req.user!.userId, req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post saved successfully',
    data: saved,
  })
})

const getSavedPosts = catchAsync(async (req: Request, res: Response) => {
  const { meta, data } = await SavedPostService.getSavedPosts(req.user!.userId, req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Saved posts retrieved successfully',
    meta,
    data,
  })
})

const unsavePost = catchAsync(async (req: Request, res: Response) => {
  await SavedPostService.unsavePost(req.user!.userId, req.params.postId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post removed from saved list',
  })
})

export const SavedPostController = { savePost, getSavedPosts, unsavePost }
