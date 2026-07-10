import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { sendResponse } from '../utils/sendResponse'
import { AuthService } from '../services/auth.service'
import { config } from '../config'

const cookieOptions = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'strict' as const,
}

const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await AuthService.register(req.body)

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Registered successfully',
    data: { user, accessToken },
  })
})

const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body)

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: { user, accessToken },
  })
})

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', cookieOptions)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
  })
})

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.getMe(req.user!.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  })
})

export const AuthController = { register, login, logout, getMe }
