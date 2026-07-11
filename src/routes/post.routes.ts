import { Router } from 'express'
import { PostController } from '../controllers/post.controller'
import { auth } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import {
  createPostValidationSchema,
  updatePostValidationSchema,
  getPostsValidationSchema,
} from '../interfaces/post.validation'

const router = Router()

router.get('/', auth(), validateRequest(getPostsValidationSchema), PostController.getFeed)
router.get('/:id', auth(), PostController.getSinglePost)
router.post('/', auth(), validateRequest(createPostValidationSchema), PostController.createPost)
router.patch(
  '/:id',
  auth(),
  validateRequest(updatePostValidationSchema),
  PostController.updatePost
)
router.delete('/:id', auth(), PostController.deletePost)
router.post('/:id/like', auth(), PostController.toggleLike)

export const PostRoutes = router
