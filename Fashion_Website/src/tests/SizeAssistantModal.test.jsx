import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../data/products'
import SizeAssistantModal from '../components/SizeAssistantModal'

async function openMeasurementForm(user) {
  await user.click(screen.getByRole('button', { name: /next/i }))
}

describe('SizeAssistantModal', () => {
  it('guides a shopper from measurements to a recommendation', async () => {
    const user = userEvent.setup()
    render(<SizeAssistantModal product={products[0]} onClose={vi.fn()} />)

    await openMeasurementForm(user)
    await user.type(screen.getByRole('spinbutton', { name: /bust/i }), '89')
    await user.type(screen.getByRole('spinbutton', { name: /waist/i }), '70')
    await user.type(screen.getByRole('spinbutton', { name: /hip/i }), '94')
    await user.click(screen.getByRole('button', { name: /find my size/i }))

    expect(screen.getByRole('heading', { name: /recommended size/i })).toBeVisible()
    expect(screen.getByText('S')).toBeVisible()
  })

  it('lists every missing field instead of calculating a result', async () => {
    const user = userEvent.setup()
    render(<SizeAssistantModal product={products[0]} onClose={vi.fn()} />)

    await openMeasurementForm(user)
    await user.click(screen.getByRole('button', { name: /find my size/i }))

    expect(screen.getByText(/please enter bust, waist, hip/i)).toBeVisible()
  })

  it('rejects measurements outside the available size chart', async () => {
    const user = userEvent.setup()
    render(<SizeAssistantModal product={products[0]} onClose={vi.fn()} />)

    await openMeasurementForm(user)
    await user.type(screen.getByRole('spinbutton', { name: /bust/i }), '200')
    await user.type(screen.getByRole('spinbutton', { name: /waist/i }), '200')
    await user.type(screen.getByRole('spinbutton', { name: /hip/i }), '200')
    await user.click(screen.getByRole('button', { name: /find my size/i }))

    expect(screen.getByText(/outside our current size range/i)).toBeVisible()
  })

  it('notifies its parent when the shopper closes it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SizeAssistantModal product={products[0]} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
