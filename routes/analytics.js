import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// ADMIN: analytics summary
router.get('/', authMiddleware, async (req, res) => {
  try {
    // total workers + available count
    const { rows: workerStats } = await pool.query(`
      SELECT
        COUNT(*) AS total_workers,
        COUNT(*) FILTER (WHERE is_available = true) AS available_workers
      FROM workers
    `)

    // total + unread bookings
    const { rows: bookingStats } = await pool.query(`
      SELECT
        COUNT(*) AS total_bookings,
        COUNT(*) FILTER (WHERE is_read = false) AS unread_bookings
      FROM booking_requests
    `)

    // per-worker: views + inquiries
    const { rows: perWorker } = await pool.query(`
      SELECT
        w.id,
        w.name,
        w.category,
        w.is_available,
        COUNT(DISTINCT wv.id) AS views,
        COUNT(DISTINCT br.id) AS inquiries
      FROM workers w
      LEFT JOIN worker_views wv ON wv.worker_id = w.id
      LEFT JOIN booking_requests br ON br.worker_id = w.id
      GROUP BY w.id
      ORDER BY views DESC
    `)

    // bookings over last 7 days (daily count)
    const { rows: dailyBookings } = await pool.query(`
      SELECT
        DATE(created_at) AS day,
        COUNT(*) AS count
      FROM booking_requests
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day ASC
    `)

    res.json({
      summary: {
        ...workerStats[0],
        ...bookingStats[0]
      },
      per_worker: perWorker,
      daily_bookings: dailyBookings
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
