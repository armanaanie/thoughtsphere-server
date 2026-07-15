import httpStatus from 'http-status'
import { Notification } from '../models/notification.model'
import { ApiError } from '../utils/ApiError'
import { NotificationType } from '../interfaces/notification.interface'

type ListQuery = {
  page?: string
  limit?: string
}

/**
 * Internal helper used by other services (friends, posts, comments) to fire a
 * notification. Never throws — a notification failing to save should never
 * block the actual action (e.g. a like succeeding shouldn't roll back just
 * because the notification insert failed).
 */
const notify = async (
  userId: string,
  type: NotificationType,
  message: string,
  relatedId?: string
) => {
  try {
    await Notification.create({ userId, type, message, relatedId })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

const getNotifications = async (userId: string, query: ListQuery) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  const [data, total, unreadCount] = await Promise.all([
    Notification.find({ userId }).sort('-createdAt').skip(skip).limit(limit),
    Notification.countDocuments({ userId }),
    Notification.countDocuments({ userId, isRead: false }),
  ])

  return { meta: { page, limit, total, unreadCount }, data }
}

const markOneAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({ _id: notificationId, userId })
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found.')
  }
  notification.isRead = true
  await notification.save()
  return notification
}

const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true })
  return null
}

export const NotificationService = {
  notify,
  getNotifications,
  markOneAsRead,
  markAllAsRead,
}
