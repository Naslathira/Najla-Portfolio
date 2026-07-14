import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import BodyType from "../pages/BodyType"

async function enterMeasurements(user, values) {
  await user.type(screen.getByRole("spinbutton", { name: /^bust/i }), String(values.bust))
  await user.type(screen.getByRole("spinbutton", { name: /^waist/i }), String(values.waist))
  await user.type(screen.getByRole("spinbutton", { name: /^high hip/i }), String(values.highHip))
  await user.type(screen.getByRole("spinbutton", { name: /^hip/i }), String(values.hip))
}

describe("BodyType page", () => {
  it("shows instructions for all four body measurements", () => {
    render(<BodyType />)
    expect(screen.getByRole("heading", { name: /how to measure/i })).toBeVisible()
    expect(screen.getByText(/approximately 18 cm below/i)).toBeVisible()
    expect(screen.getAllByRole("spinbutton")).toHaveLength(4)
  })

  it("lets visitors explore a content template for every body type", async () => {
    const user = userEvent.setup()
    render(<BodyType />)
    expect(screen.getAllByRole("button", { name: /hourglass|spoon|triangle|rectangle/i })).toHaveLength(7)
    await user.click(screen.getByRole("button", { name: "Triangle", exact: true }))
    const dialog = screen.getByRole("dialog", { name: "Triangle" })
    expect(dialog).toHaveTextContent(/lower body appears wider than the upper body/i)
    expect(dialog).toHaveTextContent(/statement sleeves and necklines/i)
    await user.click(within(dialog).getByRole("button", { name: /exit body type details/i }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("can fill the form with valid example measurements", async () => {
    const user = userEvent.setup()
    render(<BodyType />)
    await user.click(screen.getByRole("button", { name: /use example values/i }))
    expect(screen.getByRole("spinbutton", { name: /^bust/i })).toHaveValue(90)
    expect(screen.getByRole("spinbutton", { name: /^waist/i })).toHaveValue(70)
    expect(screen.getByRole("spinbutton", { name: /^high hip/i })).toHaveValue(85)
    expect(screen.getByRole("spinbutton", { name: /^hip/i })).toHaveValue(96)
  })

  it("calculates and displays an exact body type", async () => {
    const user = userEvent.setup()
    render(<BodyType />)
    await enterMeasurements(user, { bust: 90, waist: 65, highHip: 80, hip: 92 })
    await user.click(screen.getByRole("button", { name: /calculate body type/i }))
    const result = screen.getByRole("region", { name: /calculation result/i })
    expect(within(result).getByRole("heading", { name: "Hourglass" })).toBeVisible()
    expect(within(result).getByText(/waist-to-hip ratio: 0.71/i)).toBeVisible()
  })

  it("shows multiple close recommendations for an in-between result", async () => {
    const user = userEvent.setup()
    render(<BodyType />)
    await enterMeasurements(user, { bust: 70, waist: 55, highHip: 65, hip: 100 })
    await user.click(screen.getByRole("button", { name: /calculate body type/i }))
    const result = screen.getByRole("region", { name: /calculation result/i })
    expect(within(result).getByRole("heading", { name: /no single exact match/i })).toBeVisible()
    expect(within(result).getByText("Spoon")).toBeVisible()
    expect(within(result).getByText("Bottom Hourglass")).toBeVisible()
  })

  it("validates missing and unrealistic measurements", async () => {
    const user = userEvent.setup()
    render(<BodyType />)
    await user.click(screen.getByRole("button", { name: /calculate body type/i }))
    expect(screen.getByRole("alert")).toHaveTextContent(/complete all four/i)

    await enterMeasurements(user, { bust: 20, waist: 20, highHip: 20, hip: 20 })
    await user.click(screen.getByRole("button", { name: /calculate body type/i }))
    expect(screen.getByRole("alert")).toHaveTextContent(/between 30 cm and 250 cm/i)
  })
})
