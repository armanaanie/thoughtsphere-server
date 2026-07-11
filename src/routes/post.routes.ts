import { Router } from 'express'
import { PostController } from '../controllers/post.controller'
import { CommentController } from '../controllers/comment.controller'
import { auth } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import {
  createPostValidationSchema,
  updatePostValidationSchema,
  getPostsValidationSchema,
} from '../interfaces/post.validation'
import {
  createCommentValidationSchema,
  getCommentsValidationSchema,
} from '../interfaces/comment.validation'

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

// Comments nested under their post
router.get(
  '/:postId/comments',
  auth(),
  validateRequest(getCommentsValidationSchema),
  CommentController.getCommentsForPost
)
router.post(
  '/:postId/comments',
  auth(),
  validateRequest(createCommentValidationSchema),
  CommentController.createComment
)

export const PostRoutes = router
