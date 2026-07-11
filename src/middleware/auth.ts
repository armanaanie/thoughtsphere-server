import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { ApiError } from '../utils/ApiError'
import { verifyToken, JwtPayload } from '../utils/jwt'
import { config } from '../config'
import { User } from '../models/user.model'

// Augment Express's Request type so req.user is typed everywhere
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const auth = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized. Please log in.')
    }

    let decoded: JwtPayload
    try {
      decoded = verifyToken(token, config.jwt.accessSecret)
    } catch {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token. Please log in again.')
    }

    // Confirm the user still exists and isn't suspended
    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'This user no longer exists.')
    }
    if (user.isSuspended) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been suspended.')
    }

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action.')
    }

    req.user = decoded
    next()
  }
}
