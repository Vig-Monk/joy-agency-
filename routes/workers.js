import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// PUBLIC: get all workers
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query
    let query = 'SELECT * FROM workers WHERE 1=1'
    const params = []

    if (category) {
      params.push(category)
      query += ` AND category = $${params.length}`
    }
    if (available !== undefined) {
      params.push(available === 'true')
      query += ` AND is_available = $${params.length}`
    }

    query += ' ORDER BY created_at DESC'
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUBLIC: get single worker + log view
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM workers WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Worker not found' })

    pool.query('INSERT INTO worker_views (worker_id) VALUES ($1)', [req.params.id]).catch(console.error)
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: create worker
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, photo_url, category, location, bio, is_available } = req.body

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' })
    }

    const { rows } = await pool.query(
      `INSERT INTO workers (name, photo_url, category, location, bio, is_available)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, photo_url || null, category, location || null, bio || null, is_available ?? true]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: update worker
// Uses explicit SET (not COALESCE) so sending photo_url: null actually clears it.
// COALESCE would silently keep the old photo when the owner removes one.
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, photo_url, category, location, bio, is_available } = req.body

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' })
    }

    const { rows } = await pool.query(
      `UPDATE workers
       SET name         = $1,
           photo_url    = $2,
           category     = $3,
           location     = $4,
           bio          = $5,
           is_available = $6
       WHERE id = $7
       RETURNING *`,
      [name, photo_url || null, category, location || null, bio || null, is_available ?? true, req.params.id]
    )

    if (!rows.length) return res.status(404).json({ error: 'Worker not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: toggle availability
router.patch('/:id/availability', authMiddleware, async (req, res) => {
  try {
    const { is_available } = req.body
    if (typeof is_available !== 'boolean') {
      return res.status(400).json({ error: 'is_available must be a boolean' })
    }
    const { rows } = await pool.query(
      'UPDATE workers SET is_available = $1 WHERE id = $2 RETURNING *',
      [is_available, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Worker not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADMIN: delete worker
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM workers WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'Worker not found' })
    res.json({ message: 'Worker deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router