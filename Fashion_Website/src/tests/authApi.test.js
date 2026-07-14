import jwt from 'jsonwebtoken'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { verifyIdTokenMock } = vi.hoisted(() => ({ verifyIdTokenMock: vi.fn() }))

vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdTokenMock
  },
}))

import app from '../../server/app.js'

describe('authentication API', () => {
  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
    process.env.JWT_SECRET = 'test-jwt-secret'
    verifyIdTokenMock.mockReset()
  })

  it('rejects a Google login without a credential', async () => {
    const response = await request(app).post('/auth/google').send({})

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Credential is required' })
  })

  it('creates a secure application session after Google verification', async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-1',
        name: 'Najla',
        email: 'najla@example.com',
        picture: '/profile.jpg',
      }),
    })

    const response = await request(app)
      .post('/auth/google')
      .send({ credential: 'valid-google-token' })

    expect(response.status).toBe(200)
    expect(response.body.user).toMatchObject({ id: 'google-user-1', email: 'najla@example.com' })
    expect(response.headers['set-cookie'][0]).toContain('np_token=')
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly')
  })

  it('rejects a credential that Google cannot verify', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('invalid token'))

    const response = await request(app)
      .post('/auth/google')
      .send({ credential: 'invalid-google-token' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid Google credential')
  })

  it('returns no user when a session cookie is absent', async () => {
    const response = await request(app).get('/me')

    expect(response.status).toBe(200)
    expect(response.body.user).toBeNull()
  })

  it('restores a user from a valid signed session cookie', async () => {
    const token = jwt.sign({ id: 'user-1', email: 'najla@example.com' }, process.env.JWT_SECRET)
    const response = await request(app).get('/me').set('Cookie', `np_token=${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user).toMatchObject({ id: 'user-1', email: 'najla@example.com' })
  })

  it('returns 401 for a tampered session cookie', async () => {
    const response = await request(app).get('/me').set('Cookie', 'np_token=tampered-token')

    expect(response.status).toBe(401)
    expect(response.body.user).toBeNull()
  })

  it('clears the session cookie during logout', async () => {
    const response = await request(app).post('/logout')

    expect(response.status).toBe(200)
    expect(response.headers['set-cookie'][0]).toContain('np_token=;')
  })
})
