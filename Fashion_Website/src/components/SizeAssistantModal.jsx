import { useEffect, useRef, useState } from "react"
import { recommendSize } from "../utils/sizeRecommendation"

function SizeAssistantModal({ product, onClose }) {
  const [step, setStep] = useState(1)
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hip: ""
  })
  const [recommendedSize, setRecommendedSize] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dialogRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  function handleDragStart(event) {
    if (event.button !== 0) return

    const dialog = dialogRef.current
    if (!dialog) return

    const rect = dialog.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: position,
      minX: position.x - rect.left,
      maxX: position.x + window.innerWidth - rect.right,
      minY: position.y - rect.top,
      maxY: position.y + window.innerHeight - rect.bottom,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleDragMove(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const nextX = drag.startPosition.x + event.clientX - drag.startX
    const nextY = drag.startPosition.y + event.clientY - drag.startY
    setPosition({
      x: Math.min(Math.max(nextX, drag.minX), drag.maxX),
      y: Math.min(Math.max(nextY, drag.minY), drag.maxY),
    })
  }

  function handleDragEnd(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setErrorMessage("")
    setMeasurements((prev) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  function handleSubmit(event) {
    event.preventDefault()

    // Validation - all fields are required
    const missingFields = Object.entries(measurements).filter(([, value]) => !value)
    if (missingFields.length > 0) {
      setErrorMessage(`Please enter ${missingFields.map(([field]) => field).join(", ")} before continuing.`) 
      return
    }

    // Boundary validation - check if measurements are within any size range
    const sizeChart = product.sizeChart
    const bustValid = Object.values(sizeChart).some(size =>  
      size.bust[0] <= Number(measurements.bust) && size.bust[1] >= Number(measurements.bust)
    )
    const waistValid = Object.values(sizeChart).some(size =>  
      size.waist[0] <= Number(measurements.waist) && size.waist[1] >= Number(measurements.waist)
    )
    const hipValid = Object.values(sizeChart).some(size =>  
      size.hip[0] <= Number(measurements.hip) && size.hip[1] >= Number(measurements.hip)
    )

    if (!bustValid || !waistValid || !hipValid) {
      setErrorMessage("Your measurements are outside our current size range. Please check your input.")
      return
    }

    const recommended = recommendSize(product, measurements)
    
    if (recommended) {
      setRecommendedSize(recommended)
      setStep(3)
    } else {
      setErrorMessage("No suitable size found for your measurements.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-assistant-title"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl"
      >
        <div
          aria-label="Drag size assistant"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className="mb-5 flex cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing"
          title="Click and drag to move"
        >
          <span className="h-1.5 w-16 rounded-full bg-gray-300" />
        </div>
        {step === 1 && (
          <>
            <h2 id="size-assistant-title" className="text-2xl font-semibold text-pink-500">
              Hi, I'm your fit assistant
            </h2>
            <p className="mt-4 text-gray-600">
              I'll help you find the best size for this item based on your body
              measurements.
            </p>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-pink-500 text-white py-3 rounded-full"
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2 id="size-assistant-title" className="text-2xl font-semibold">Your Measurements</h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your measurements in cm.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium" htmlFor="bust">Bust / chest (cm)</label>
              <input
                id="bust"
                type="number"
                min="1"
                step="0.1"
                name="bust"
                value={measurements.bust}
                onChange={handleChange}
                placeholder="For example, 89"
                className="w-full border rounded-xl px-4 py-3"
              />
              <label className="block text-sm font-medium" htmlFor="waist">Waist (cm)</label>
              <input
                id="waist"
                type="number"
                min="1"
                step="0.1"
                name="waist"
                value={measurements.waist}
                onChange={handleChange}
                placeholder="For example, 70"
                className="w-full border rounded-xl px-4 py-3"
              />
              <label className="block text-sm font-medium" htmlFor="hip">Hip (cm)</label>
              <input
                id="hip"
                type="number"
                min="1"
                step="0.1"
                name="hip"
                value={measurements.hip}
                onChange={handleChange}
                placeholder="For example, 94"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            {errorMessage && (
              <p role="alert" className="mt-4 text-red-500 text-sm">
                {errorMessage}
              </p>
            )}
            <button className="mt-6 w-full bg-pink-500 text-white py-3 rounded-full">
              Find My Size
            </button>
          </form>
        )}
        {step === 3 && (
          <>
            <h2 id="size-assistant-title" className="text-2xl font-semibold text-pink-500">
              Recommended Size
            </h2>
            <p className="mt-4 text-gray-600">
              Based on your measurements, we recommend:
            </p>
            <div className="mt-6 text-5xl font-bold text-center text-pink-500">
              {recommendedSize || "No recommendation available"}
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center">
              This is an estimated fit recommendation based on the selected
              product size chart.
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full border py-3 rounded-full text-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default SizeAssistantModal
