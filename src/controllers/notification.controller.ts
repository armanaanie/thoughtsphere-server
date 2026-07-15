import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { NotificationService } from '../services/notification.service'

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const { meta, data } = await NotificationService.getNotifications(req.user!.userId, req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    meta,
    data,
  })
})

const markOneAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await NotificationService.markOneAsRead(req.params.id, req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: notification,
  })
})

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await NotificationService.markAllAsRead(req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
  })
})

export const NotificationController = { getNotifications, markOneAsRead, markAllAsRead }
