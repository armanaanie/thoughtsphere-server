import { Router } from 'express'
import { AuthRoutes } from './auth.routes'
import { UserRoutes } from './user.routes'
import { PostRoutes } from './post.routes'
import { CommentRoutes } from './comment.routes'
import { FriendRoutes } from './friend.routes'
import { SavedPostRoutes } from './savedPost.routes'
import { NotificationRoutes } from './notification.routes'

const router = Router()

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/posts', route: PostRoutes },
  { path: '/comments', route: CommentRoutes },
  { path: '/friends', route: FriendRoutes },
  { path: '/saved', route: SavedPostRoutes },
  { path: '/notifications', route: NotificationRoutes },
  // Upcoming: admin routes
]

moduleRoutes.forEach(({ path, route }) => router.use(path, route))

export const routes = router
