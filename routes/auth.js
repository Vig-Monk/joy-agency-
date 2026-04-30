import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

// Single admin user — store credentials in .env
// ADMIN_EMAIL=admin@joyagency.com
// ADMIN_PASSWORD=yourpassword
// JWT_SECRET=your_long_random_secret

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token })
})

export default router
