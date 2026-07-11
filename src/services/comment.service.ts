import httpStatus from 'http-status'
import { Comment } from '../models/comment.model'
import { Post } from '../models/post.model'
import { ApiError } from '../utils/ApiError'
import { CreateCommentInput, UpdateCommentInput } from '../interfaces/comment.validation'

type ListQuery = {
  page?: string
  limit?: string
}

const createComment = async (
  postId: string,
  userId: string,
  payload: CreateCommentInput
) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }

  const comment = await Comment.create({ postId, userId, comment: payload.comment })

  // Keep the denormalized counter on Post in sync
  post.commentsCount += 1
  await post.save()

  return comment.populate('userId', 'name avatar')
}

const getCommentsForPost = async (postId: string, query: ListQuery) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    Comment.find({ postId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar'),
    Comment.countDocuments({ postId }),
  ])

  return { meta: { page, limit, total }, data }
}

const updateComment = async (
  commentId: string,
  requesterId: string,
  requesterRole: string,
  payload: UpdateCommentInput
) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found.')
  }

  if (comment.userId.toString() !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only edit your own comments.')
  }

  comment.comment = payload.comment
  await comment.save()
  return comment.populate('userId', 'name avatar')
}

const deleteComment = async (
  commentId: string,
  requesterId: string,
  requesterRole: string
) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found.')
  }

  if (comment.userId.toString() !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own comments.')
  }

  await comment.deleteOne()

  // Keep Post.commentsCount accurate — guard against going negative just in case
  await Post.findByIdAndUpdate(comment.postId, {
    $inc: { commentsCount: -1 },
  })
  const post = await Post.findById(comment.postId)
  if (post && post.commentsCount < 0) {
    post.commentsCount = 0
    await post.save()
  }

  return null
}

export const CommentService = {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
}
