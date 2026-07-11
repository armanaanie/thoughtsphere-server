import { Response } from 'express'

type ApiResponse<T> = {
  statusCode: number
  success: boolean
  message: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
  data?: T
}

export const sendResponse = <T>(res: Response, payload: ApiResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta,
    data: payload.data,
  })
}
