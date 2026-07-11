import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validateRequest } from '../middleware/validateRequest'
import { registerValidationSchema, loginValidationSchema } from '../interfaces/auth.validation'
import { auth } from '../middleware/auth'

const router = Router()

router.post('/register', validateRequest(registerValidationSchema), AuthController.register)
router.post('/login', validateRequest(loginValidationSchema), AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/me', auth(), AuthController.getMe)

export const AuthRoutes = router
