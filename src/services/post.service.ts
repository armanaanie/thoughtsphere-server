import httpStatus from 'http-status'
import { Post } from '../models/post.model'
import { ApiError } from '../utils/ApiError'
import { CreatePostInput, UpdatePostInput } from '../interfaces/post.validation'

type FeedQuery = {
  searchTerm?: string
  authorId?: string
  page?: string
  limit?: string
  sortBy?: 'newest' | 'oldest' | 'mostLiked'
}

const sortMap: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  mostLiked: { createdAt: -1 }, // likes count sort handled via aggregation below
}

const createPost = async (authorId: string, payload: CreatePostInput) => {
  const post = await Post.create({ ...payload, authorId })
  return post.populate('authorId', 'name avatar')
}

const getFeed = async (query: FeedQuery) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = { visibility: 'public' }
  if (query.authorId) filter.authorId = query.authorId
  if (query.searchTerm) filter.content = { $regex: query.searchTerm, $options: 'i' }

  if (query.sortBy === 'mostLiked') {
    // Sorting by array length requires aggregation rather than a simple .sort()
    const pipeline = [
      { $match: filter },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: { likesCount: -1 as const, createdAt: -1 as const } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, avatar: 1 } }],
        },
      },
      { $unwind: '$author' },
    ]
    const [data, total] = await Promise.all([
      Post.aggregate(pipeline),
      Post.countDocuments(filter),
    ])
    return { meta: { page, limit, total }, data }
  }

  const sort = sortMap[query.sortBy || 'newest']

  const [data, total] = await Promise.all([
    Post.find(filter).sort(sort).skip(skip).limit(limit).populate('authorId', 'name avatar'),
    Post.countDocuments(filter),
  ])

  return { meta: { page, limit, total }, data }
}

const getSinglePost = async (id: string) => {
  const post = await Post.findById(id).populate('authorId', 'name avatar bio')
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }
  return post
}

const updatePost = async (
  postId: string,
  requesterId: string,
  requesterRole: string,
  payload: UpdatePostInput
) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }

  if (post.authorId.toString() !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only edit your own posts.')
  }

  Object.assign(post, payload)
  await post.save()
  return post.populate('authorId', 'name avatar')
}

const deletePost = async (postId: string, requesterId: string, requesterRole: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }

  if (post.authorId.toString() !== requesterId && requesterRole !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own posts.')
  }

  await post.deleteOne()
  return null
}

const toggleLike = async (postId: string, requesterId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.')
  }

  const alreadyLiked = post.likes.some((id) => id.toString() === requesterId)

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== requesterId) as typeof post.likes
  } else {
    post.likes.push(requesterId as unknown as typeof post.likes[number])
  }

  await post.save()
  return { liked: !alreadyLiked, likesCount: post.likes.length }
}

export const PostService = {
  createPost,
  getFeed,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
}
