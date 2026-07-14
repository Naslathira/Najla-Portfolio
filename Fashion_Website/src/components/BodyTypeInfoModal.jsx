import { useEffect, useRef, useState } from "react"

function BodyTypeInfoModal({ type, content, onClose }) {
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

  function startDrag(event) {
    if (event.button !== 0 || !dialogRef.current || event.target.closest("button")) return
    const rect = dialogRef.current.getBoundingClientRect()
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
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const x = drag.startPosition.x + event.clientX - drag.startX
    const y = drag.startPosition.y + event.clientY - drag.startY
    setPosition({
      x: Math.min(Math.max(x, drag.minX), drag.maxX),
      y: Math.min(Math.max(y, drag.minY), drag.maxY),
    })
  }

  function stopDrag(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="body-type-modal-title"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <header
          aria-label="Drag body type information"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          className="sticky top-0 z-10 flex cursor-grab touch-none select-none items-center justify-between border-b bg-white px-6 py-4 active:cursor-grabbing"
        >
          <div>
            <span className="block h-1.5 w-14 rounded-full bg-gray-300" />
            <p className="mt-2 text-xs text-gray-400">Drag this header to move</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border px-4 py-2 text-sm font-medium hover:border-pink-500 hover:text-pink-500" aria-label="Exit body type details">
            Exit ×
          </button>
        </header>

        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex min-h-80 items-center justify-center bg-pink-50 p-6">
            {content.image ? (
              <img src={content.image} alt={`${type.name} body type illustration`} className="h-full max-h-96 w-full object-contain" />
            ) : (
              <div className="max-w-xs rounded-2xl border-2 border-dashed border-pink-200 bg-white/70 p-8 text-center">
                <p className="text-5xl" aria-hidden="true">◇</p>
                <p className="mt-3 font-semibold text-gray-700">{type.name} image</p>
                <p className="mt-2 text-xs leading-5 text-gray-500">Add your image path to <code>bodyTypeContent.js</code>.</p>
              </div>
            )}
          </div>

          <div className="p-7 md:p-9">
            <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Body type guide</p>
            <h2 id="body-type-modal-title" className="mt-2 text-3xl font-semibold">{type.name}</h2>
            <p className="mt-4 leading-7 text-gray-600">{content.overview}</p>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">Common characteristics</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  {content.characteristics.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Styling ideas</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  {content.stylingTips.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-7 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-500">These categories are flexible fashion references, not rules. Individual bodies can share characteristics from several categories.</p>
          </div>
        </div>
      </article>
    </div>
  )
}

export default BodyTypeInfoModal
