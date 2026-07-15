import { Router } from 'express'
import { NotificationController } from '../controllers/notification.controller'
import { auth } from '../middleware/auth'

const router = Router()

router.get('/', auth(), NotificationController.getNotifications)
router.patch('/read-all', auth(), NotificationController.markAllAsRead)
router.patch('/:id/read', auth(), NotificationController.markOneAsRead)

export const NotificationRoutes = router
