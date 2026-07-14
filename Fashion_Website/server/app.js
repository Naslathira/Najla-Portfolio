import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

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
    const user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    }
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

export default app
