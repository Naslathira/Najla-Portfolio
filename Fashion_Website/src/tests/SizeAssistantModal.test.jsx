import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { products } from '../data/products'
import SizeAssistantModal from '../components/SizeAssistantModal'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach } from 'vitest'

const { authState } = vi.hoisted(() => ({ authState: {} }))
vi.mock('../features/auth/useAuth', () => ({ useAuth: () => authState }))

function renderModal(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<SizeAssistantModal product={products[0]} onClose={onClose} />} />
        <Route path="/body-type" element={<h1>Body Type Destination</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function openMeasurementForm(user) {
  await user.click(screen.getByRole('button', { name: /next/i }))
  await user.click(screen.getByRole('button', { name: /enter measurements manually/i }))
}

describe('SizeAssistantModal', () => {
  beforeEach(() => {
    authState.bodyProfile = null
  })

  it('guides a shopper from measurements to a recommendation', async () => {
    const user = userEvent.setup()
    renderModal()

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
    renderModal()

    await openMeasurementForm(user)
    await user.click(screen.getByRole('button', { name: /find my size/i }))

    expect(screen.getByText(/please enter bust, waist, hip/i)).toBeVisible()
  })

  it('rejects measurements outside the available size chart', async () => {
    const user = userEvent.setup()
    renderModal()

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
    renderModal(onClose)

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('uses saved Body Type measurements without showing the manual form', async () => {
    const user = userEvent.setup()
    authState.bodyProfile = { bust: 89, waist: 70, hip: 94 }
    renderModal()
    await user.click(screen.getByRole('button', { name: /next/i }))
    await user.click(screen.getByRole('button', { name: /use my body type measurements/i }))
    expect(screen.getByRole('heading', { name: /recommended size/i })).toBeVisible()
    expect(screen.getByText('S')).toBeVisible()
  })

  it('navigates to Body Type Calculator when saved measurements are unavailable', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(onClose)
    await user.click(screen.getByRole('button', { name: /next/i }))
    await user.click(screen.getByRole('button', { name: /use my body type measurements/i }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.getByRole('heading', { name: /body type destination/i })).toBeVisible()
  })
})
