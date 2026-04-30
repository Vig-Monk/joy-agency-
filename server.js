import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes     from './routes/auth.js'
import workerRoutes   from './routes/workers.js'
import bookingRoutes  from './routes/bookings.js'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/workers',   workerRoutes)
app.use('/api/bookings',  bookingRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// Global error handler — catches any thrown error from routes
// Without this, Express 4 silently swallows async errors in some cases
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Joy Agency API running on port ${PORT}`))
