import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { auth } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import {
  updateProfileValidationSchema,
  changePasswordValidationSchema,
  searchUsersValidationSchema,
} from '../interfaces/user.validation'

const router = Router()

// Search / list users — logged-in users only (e.g. to find people to friend)
router.get('/', auth(), validateRequest(searchUsersValidationSchema), UserController.getAllUsers)

// View a specific profile
router.get('/:id', auth(), UserController.getSingleUser)

// Update own profile (or admin updating anyone)
router.patch(
  '/:id',
  auth(),
  validateRequest(updateProfileValidationSchema),
  UserController.updateProfile
)

// Change password — owner only
router.patch(
  '/:id/password',
  auth(),
  validateRequest(changePasswordValidationSchema),
  UserController.changePassword
)

// Delete account (or admin deleting anyone)
router.delete('/:id', auth(), UserController.deleteUser)

export const UserRoutes = router
