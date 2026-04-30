import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// PUBLIC: submit booking request
router.post('/', async (req, res) => {
  try {
    const { worker_id, client_name, client_phone, message } = req.body

    if (!worker_id || !client_name || !client_phone) {
      return res.status(400).json({
        error: 'worker_id, client_name, and client_phone are required'
      })
    }

    // verify worker exists
    const { rows: workers } = await pool.query(
      'SELECT id FROM workers WHERE id = $1',
      [worker_id]
    )
    if (!workers.length) {
      return res.status(404).json({ error: 'Worker not found' })
    }

    const { rows } = await pool.query(
      `INSERT INTO booking_requests (worker_id, client_name, client_phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [worker_id, client_name, client_phone, message || null]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: get all booking requests with worker name
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        br.*,
        w.name AS worker_name,
        w.category AS worker_category
      FROM booking_requests br
      LEFT JOIN workers w ON br.worker_id = w.id
      ORDER BY br.created_at DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: mark booking as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(
      'UPDATE booking_requests SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Request not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
