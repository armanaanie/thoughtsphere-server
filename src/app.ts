import 'express-async-errors'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { connectDB } from './config/database'
import { routes } from './routes'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import { notFound } from './middleware/notFound'

const app: Application = express()

// Core middleware
app.use(helmet())
app.use(cors({ origin: config.clientUrl, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'ThoughtSphere API is running 🚀' })
})

// API routes
app.use('/api/v1', routes)

// 404 + error handling (must be last)
app.use(notFound)
app.use(globalErrorHandler)

const startServer = async () => {
  await connectDB()
  app.listen(config.port, () => {
    console.log(`✅ Server running on port ${config.port}`)
  })
}

startServer()

export default app
