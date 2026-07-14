import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { authenticate } from './middleware/authenticate.js'
import { getUserProfile, saveBodyProfile, upsertGoogleUser } from './repositories/userRepository.js'

const app = express()
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientBuildDirectory = path.resolve(currentDirectory, '../dist')

app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173']
    : ['http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ message: 'Credential is required' })
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const user = await upsertGoogleUser(payload)
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('np_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.json({ message: 'Login successful', user })
  } catch {
    return res.status(401).json({ message: 'Invalid Google credential' })
  }
})

app.get('/me', (req, res) => {
  try {
    const token = req.cookies.np_token

    if (!token) {
      return res.json({ user: null, message: 'Not logged in' })
    }

    return res.json({ user: jwt.verify(token, process.env.JWT_SECRET) })
  } catch {
    return res.status(401).json({ user: null, message: 'Invalid or expired token' })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('np_token')
  res.json({ message: 'Logged out successfully' })
})

app.get('/profile', authenticate, async (req, res) => {
  const profile = await getUserProfile(req.user.id)
  if (!profile) return res.status(404).json({ message: 'User profile not found' })
  return res.json({ profile })
})

app.put('/profile/body', authenticate, async (req, res) => {
  const allowedText = ['bodyType', 'hairColor', 'eyeColor', 'skinTone', 'undertone']
  const allowedNumbers = ['bust', 'waist', 'highHip', 'hip']
  const profile = {}

  for (const field of allowedText) {
    if (req.body[field] !== undefined) profile[field] = req.body[field] || null
  }
  for (const field of allowedNumbers) {
    if (req.body[field] !== undefined) {
      const value = Number(req.body[field])
      if (!Number.isFinite(value) || value < 30 || value > 250) {
        return res.status(400).json({ message: `${field} must be between 30 and 250 cm` })
      }
      profile[field] = value
    }
  }

  if (Object.keys(profile).length === 0) {
    return res.status(400).json({ message: 'No profile fields provided' })
  }
  const bodyProfile = await saveBodyProfile(req.user.id, profile)
  return res.json({ bodyProfile, message: 'Profile saved' })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildDirectory))
  app.get('/{*path}', (req, res, next) => {
    if (!req.accepts('html')) return next()
    return res.sendFile(path.join(clientBuildDirectory, 'index.html'))
  })
}

app.use((req, res) => {
  res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.path}` })
})

app.use((error, req, res, next) => {
  console.error(error)
  if (res.headersSent) return next(error)
  return res.status(500).json({ message: 'Internal server error' })
})

export default app
