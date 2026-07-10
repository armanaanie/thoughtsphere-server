import mongoose from 'mongoose'
import { config } from './index'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.databaseUrl)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
})
