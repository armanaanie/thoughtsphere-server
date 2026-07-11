import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { UserService } from '../services/user.service'

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { meta, data } = await UserService.getAllUsers(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta,
    data,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getSingleUser(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  })
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.updateProfile(
    req.params.id,
    req.user!.userId,
    req.user!.role,
    req.body
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: user,
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  await UserService.changePassword(req.params.id, req.user!.userId, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.params.id, req.user!.userId, req.user!.role)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account deleted successfully',
  })
})

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateProfile,
  changePassword,
  deleteUser,
}
