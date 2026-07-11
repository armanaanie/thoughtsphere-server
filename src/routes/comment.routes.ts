import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller'
import { auth } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { updateCommentValidationSchema } from '../interfaces/comment.validation'

const router = Router()

router.patch(
  '/:id',
  auth(),
  validateRequest(updateCommentValidationSchema),
  CommentController.updateComment
)
router.delete('/:id', auth(), CommentController.deleteComment)

export const CommentRoutes = router
