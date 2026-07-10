import { Router } from 'express'
import { AuthRoutes } from './auth.routes'

const router = Router()

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  // Upcoming: /users, /posts, /comments, /friends, /saved, /notifications
]

moduleRoutes.forEach(({ path, route }) => router.use(path, route))

export const routes = router
