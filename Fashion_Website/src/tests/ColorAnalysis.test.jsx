import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ColorAnalysis from "../pages/ColorAnalysis"
import { MemoryRouter } from "react-router-dom"

const { authState } = vi.hoisted(() => ({ authState: {} }))
vi.mock("../features/auth/useAuth", () => ({ useAuth: () => authState }))

function renderPage() {
  return render(<MemoryRouter><ColorAnalysis /></MemoryRouter>)
}

async function selectProfile(user, undertone = "Warm") {
  await user.selectOptions(screen.getByRole("combobox", { name: /hair color/i }), "Black")
  await user.selectOptions(screen.getByRole("combobox", { name: /eye color/i }), "Brown")
  await user.selectOptions(screen.getByRole("combobox", { name: /skin tone/i }), "Medium")
  await user.selectOptions(screen.getByRole("combobox", { name: /^undertone/i }), undertone)
}

describe("ColorAnalysis page", () => {
  beforeEach(() => {
    Object.assign(authState, { user: null, bodyProfile: null, saveProfile: vi.fn() })
  })

  it("offers every input option present in the dataset", () => {
    renderPage()
    expect(screen.getByRole("combobox", { name: /hair color/i })).toHaveTextContent("Grey")
    expect(screen.getByRole("combobox", { name: /eye color/i })).toHaveTextContent("Light Blue")
    expect(screen.getByRole("combobox", { name: /skin tone/i })).toHaveTextContent("Very Dark")
    expect(screen.getByRole("combobox", { name: /^undertone/i })).toHaveTextContent("Neutral")
  })

  it("validates an incomplete profile", async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole("button", { name: /analyze my colors/i }))
    expect(screen.getByRole("alert")).toHaveTextContent(/select all four/i)
  })

  it("shows recommended and avoid colors from the warm dataset profile", async () => {
    const user = userEvent.setup()
    renderPage()
    await selectProfile(user, "Warm")
    await user.click(screen.getByRole("button", { name: /analyze my colors/i }))

    const result = screen.getByRole("region", { name: /color analysis result/i })
    expect(within(result).getByRole("heading", { name: "Warm palette" })).toBeVisible()
    expect(within(result).getByText("Earth Tones")).toBeVisible()
    expect(within(result).getByText("Cool Blue")).toBeVisible()
    expect(within(result).getByText("Gold")).toBeVisible()
  })

  it("shows a saved palette and lets the user update it", async () => {
    const user = userEvent.setup()
    authState.user = { id: "user-1" }
    authState.bodyProfile = { hairColor: "Black", eyeColor: "Brown", skinTone: "Medium", undertone: "Warm" }
    renderPage()
    expect(screen.getByRole("heading", { name: /your color palette is warm palette/i })).toBeVisible()
    expect(screen.queryByRole("button", { name: /analyze my colors/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /update my color analysis/i }))
    expect(screen.getByRole("combobox", { name: /hair color/i })).toHaveValue("Black")
  })
})
