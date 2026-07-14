import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from '../pages/Login'

const { authState } = vi.hoisted(() => ({ authState: {} }))

vi.mock('../features/auth/useAuth', () => ({ useAuth: () => authState }))
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <div>
      <button onClick={() => onSuccess({ credential: 'google-token' })}>Google success</button>
      <button onClick={onError}>Google failure</button>
    </div>
  ),
}))

describe('Login', () => {
  beforeEach(() => {
    Object.assign(authState, { user: null, loading: false, login: vi.fn(), logout: vi.fn() })
  })

  it('submits the Google credential through the authentication layer', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /google success/i }))
    expect(authState.login).toHaveBeenCalledWith('google-token')
  })

  it('shows an authentication error', async () => {
    const user = userEvent.setup()
    authState.login.mockRejectedValue(new Error('Invalid Google credential'))
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /google success/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid Google credential')
  })

  it('shows a client error when the Google flow fails', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.click(screen.getByRole('button', { name: /google failure/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('Google login failed')
  })

  it('renders an existing user and logs them out', async () => {
    const user = userEvent.setup()
    authState.user = { name: 'Najla', email: 'najla@example.com', picture: '/profile.jpg' }
    render(<Login />)
    expect(screen.getByText(/hi, najla/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: /logout/i }))
    expect(authState.logout).toHaveBeenCalledOnce()
  })

  it('shows session restoration progress', () => {
    authState.loading = true
    render(<Login />)
    expect(screen.getByText(/checking your session/i)).toBeVisible()
  })
})
