import { Router } from 'express'
import { FriendController } from '../controllers/friend.controller'
import { auth } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { sendFriendRequestValidationSchema } from '../interfaces/friendRequest.validation'

const router = Router()

router.get('/', auth(), FriendController.getFriendsList)
router.get('/requests', auth(), FriendController.getPendingRequests)
router.post(
  '/request',
  auth(),
  validateRequest(sendFriendRequestValidationSchema),
  FriendController.sendRequest
)
router.patch('/accept/:requestId', auth(), FriendController.acceptRequest)
router.patch('/reject/:requestId', auth(), FriendController.rejectRequest)
router.delete('/:friendId', auth(), FriendController.unfriend)

export const FriendRoutes = router
