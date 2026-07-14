import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Shop from '../pages/Shop'
import { renderRoute } from './renderWithRouter'

describe('Shop', () => {
  it('shows the entire collection without a category filter', () => {
    renderRoute(<Shop />, { route: '/shop' })
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('filters products using the category query parameter', () => {
    renderRoute(<Shop />, { route: '/shop?category=sport-bra' })

    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.queryByText('Maroon Halter Top')).not.toBeInTheDocument()
  })

  it('shows an empty state for a category with no products', () => {
    renderRoute(<Shop />, { route: '/shop?category=legging' })

    expect(screen.getByText(/no products available/i)).toBeVisible()
  })
})
