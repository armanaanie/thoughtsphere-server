import { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Wraps an async route handler so any rejected promise (thrown error)
 * is automatically forwarded to Express's error-handling middleware
 * via next(error), instead of needing try/catch in every controller.
 */
export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
