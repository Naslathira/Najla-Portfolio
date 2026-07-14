import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'

vi.mock('../features/auth/useAuth', () => ({ useAuth: () => ({ user: null }) }))

describe('application routing', () => {
  it('renders the cart page instead of silently falling back to home', () => {
    render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /your cart/i })).toBeVisible()
  })

  it('renders a dedicated 404 page for unknown URLs', () => {
    render(<MemoryRouter initialEntries={['/does-not-exist']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeVisible()
  })

  it('renders the body type calculator route', () => {
    render(<MemoryRouter initialEntries={['/body-type']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /body type calculator/i })).toBeVisible()
  })

  it('renders the color analysis route', () => {
    render(<MemoryRouter initialEntries={['/color-analysis']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /color analysis/i })).toBeVisible()
  })
})
