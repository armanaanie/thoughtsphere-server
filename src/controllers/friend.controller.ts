import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { FriendService } from '../services/friend.service'

const sendRequest = catchAsync(async (req: Request, res: Response) => {
  const request = await FriendService.sendRequest(req.user!.userId, req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Friend request sent',
    data: request,
  })
})

const acceptRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await FriendService.respondToRequest(
    req.params.requestId,
    req.user!.userId,
    'accept'
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request accepted',
    data: result,
  })
})

const rejectRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await FriendService.respondToRequest(
    req.params.requestId,
    req.user!.userId,
    'reject'
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request rejected',
    data: result,
  })
})

const getFriendsList = catchAsync(async (req: Request, res: Response) => {
  const friends = await FriendService.getFriendsList(req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friends list retrieved successfully',
    data: friends,
  })
})

const getPendingRequests = catchAsync(async (req: Request, res: Response) => {
  const requests = await FriendService.getPendingRequests(req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending friend requests retrieved successfully',
    data: requests,
  })
})

const unfriend = catchAsync(async (req: Request, res: Response) => {
  await FriendService.unfriend(req.user!.userId, req.params.friendId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unfriended successfully',
  })
})

export const FriendController = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getFriendsList,
  getPendingRequests,
  unfriend,
}
