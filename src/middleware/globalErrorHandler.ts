import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError'
import { config } from '../config'

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorDetails: unknown = undefined

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err instanceof ZodError) {
    statusCode = 400
    message = 'Validation error'
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = 'Validation error'
    errorDetails = Object.values(err.errors).map((val) => val.message)
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Invalid value for field '${err.path}'`
  } else if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    statusCode = 409
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue
    message = `Duplicate value for field: ${Object.keys(keyValue || {}).join(', ')}`
  } else if (err instanceof Error) {
    message = err.message
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: config.env === 'development' && err instanceof Error ? err.stack : undefined,
  })
}
