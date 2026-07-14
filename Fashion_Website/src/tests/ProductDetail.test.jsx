import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProductDetail from '../pages/ProductDetail'
import { renderRoute } from './renderWithRouter'

describe('ProductDetail', () => {
  it('renders the product selected by the URL and its size chart', () => {
    renderRoute(<ProductDetail />, { route: '/product/1', path: '/product/:productId' })

    expect(screen.getByRole('heading', { name: 'Soft Pink Sculpt Bra' })).toBeVisible()
    expect(screen.getByRole('table')).toBeVisible()
    expect(screen.getByRole('cell', { name: 'XXS' })).toBeVisible()
  })

  it('shows a not-found state for an unknown product', () => {
    renderRoute(<ProductDetail />, { route: '/product/999', path: '/product/:productId' })
    expect(screen.getByText(/product not found/i)).toBeVisible()
  })

  it('opens the size assistant from the product page', async () => {
    const user = userEvent.setup()
    renderRoute(<ProductDetail />, { route: '/product/1', path: '/product/:productId' })

    await user.click(screen.getByRole('button', { name: /help me find my size/i }))
    expect(screen.getByRole('heading', { name: /fit assistant/i })).toBeVisible()
  })
})
