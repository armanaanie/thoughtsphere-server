import { Router } from 'express'
import { AuthRoutes } from './auth.routes'
import { UserRoutes } from './user.routes'
import { PostRoutes } from './post.routes'
import { CommentRoutes } from './comment.routes'

const router = Router()

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/posts', route: PostRoutes },
  { path: '/comments', route: CommentRoutes },
  // Upcoming: /friends, /saved, /notifications
]

moduleRoutes.forEach(({ path, route }) => router.use(path, route))

export const routes = router
