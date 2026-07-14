import { useState } from "react"
import { bodyTypes, calculateBodyType } from "../utils/bodyTypeCalculator"
import { bodyTypeContent } from "../data/bodyTypeContent"
import BodyTypeInfoModal from "../components/BodyTypeInfoModal"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../features/auth/useAuth"

const initialMeasurements = { bust: "", waist: "", highHip: "", hip: "" }
const exampleMeasurements = { bust: "90", waist: "70", highHip: "85", hip: "96" }

const measurementGuide = [
  { name: "Bust", text: "Measure around the fullest part of your bust while wearing a well-fitting, unpadded bra." },
  { name: "Waist", text: "Measure the narrowest part of your natural waist, usually just above your belly button." },
  { name: "High hip", text: "Measure around the upper curve of your hips, approximately 18 cm below your natural waist." },
  { name: "Hip", text: "Measure around the fullest part of your hips and buttocks, keeping the tape level." },
]

function BodyType() {
  const { user, bodyProfile, saveProfile } = useAuth()
  const location = useLocation()
  const [measurements, setMeasurements] = useState(initialMeasurements)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [selectedBodyType, setSelectedBodyType] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const selectedType = bodyTypes.find((type) => type.id === selectedBodyType)
  const selectedContent = bodyTypeContent[selectedBodyType]

  function handleChange(event) {
    setMeasurements((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError("")
    setResult(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const values = Object.values(measurements).map(Number)
    if (Object.values(measurements).some((value) => value === "")) {
      setError("Please complete all four measurements.")
      return
    }
    if (values.some((value) => !Number.isFinite(value) || value < 30 || value > 250)) {
      setError("Enter realistic measurements between 30 cm and 250 cm.")
      return
    }
    if (Number(measurements.waist) >= Math.max(Number(measurements.bust), Number(measurements.hip))) {
      setError("Please check your measurements. The waist should usually be smaller than the bust or hip.")
      return
    }
    setResult(calculateBodyType(measurements))
  }

  function resetForm() {
    setMeasurements(initialMeasurements)
    setResult(null)
    setError("")
  }

  function useExampleMeasurements() {
    setMeasurements(exampleMeasurements)
    setResult(null)
    setError("")
  }

  async function saveResult() {
    const bodyType = result.primary?.name || result.alternatives[0]?.name
    try {
      setSaving(true)
      setError("")
      await saveProfile({
        bust: Number(measurements.bust),
        waist: Number(measurements.waist),
        highHip: Number(measurements.highHip),
        hip: Number(measurements.hip),
        bodyType,
      })
      setResult(null)
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  function updateBodyType() {
    setMeasurements({
      bust: String(bodyProfile.bust ?? ""),
      waist: String(bodyProfile.waist ?? ""),
      highHip: String(bodyProfile.highHip ?? ""),
      hip: String(bodyProfile.hip ?? ""),
    })
    setResult(null)
    setError("")
    setIsEditing(true)
  }

  const hasSavedBodyType = Boolean(user && bodyProfile?.bodyType)
  const showCalculator = !hasSavedBodyType || isEditing

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Fit & proportions</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Body Type Calculator</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-500">
          Discover which fashion body-shape categories most closely match your proportions using four measurements in centimetres.
        </p>
      </div>

      {location.state?.completeMeasurementsForSizeAssistant && !bodyProfile?.bodyType && (
        <div role="status" className="mx-auto mt-8 max-w-3xl rounded-2xl border border-pink-200 bg-pink-50 px-5 py-4 text-center text-sm text-pink-800">
          Complete the calculator and save your measurements to use them automatically in the Size Assistant.
        </div>
      )}

      <section className="mt-10" aria-labelledby="body-type-library-title">
        <h2 id="body-type-library-title" className="sr-only">Explore body type categories</h2>
        <div className="flex flex-wrap justify-center gap-2" aria-label="Body type categories">
          {bodyTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedBodyType(type.id)}
              className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
            >
              {type.name}
            </button>
          ))}
        </div>
      </section>

      {selectedType && selectedContent && (
        <BodyTypeInfoModal type={selectedType} content={selectedContent} onClose={() => setSelectedBodyType(null)} />
      )}

      {hasSavedBodyType && !isEditing ? (
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-pink-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Saved to your profile</p>
          <h2 className="mt-3 text-3xl font-semibold">Your body type is {bodyProfile.bodyType}</h2>
          <p className="mt-4 text-gray-500">Your latest measurements are saved securely to your account and can be updated whenever they change.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <span className="rounded-full bg-pink-50 px-4 py-2">Bust {bodyProfile.bust} cm</span>
            <span className="rounded-full bg-pink-50 px-4 py-2">Waist {bodyProfile.waist} cm</span>
            <span className="rounded-full bg-pink-50 px-4 py-2">High hip {bodyProfile.highHip} cm</span>
            <span className="rounded-full bg-pink-50 px-4 py-2">Hip {bodyProfile.hip} cm</span>
          </div>
          <button type="button" onClick={updateBodyType} className="mt-7 rounded-full bg-pink-500 px-7 py-3 font-medium text-white hover:bg-pink-600">Update My Body Type</button>
        </div>
      ) : showCalculator && <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <aside className="rounded-3xl bg-pink-50 p-7">
          <h2 className="text-2xl font-semibold">How to measure</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Stand straight with your arms relaxed. Keep the tape snug and level, but do not pull it tightly enough to compress your body.
          </p>
          <ol className="mt-6 space-y-5">
            {measurementGuide.map((item, index) => (
              <li key={item.name} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-semibold text-white">{index + 1}</span>
                <div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{item.text}</p></div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rounded-3xl border bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold">Your measurements</h2>
          <p className="mt-2 text-sm text-gray-500">All measurements must be entered in cm.</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-pink-50 px-4 py-3 text-sm">
            <span className="text-gray-600">Valid example: bust 90, waist 70, high hip 85, hip 96 cm.</span>
            <button type="button" onClick={useExampleMeasurements} className="font-semibold text-pink-600 hover:text-pink-700">
              Use example values
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2" noValidate>
            {measurementGuide.map((item) => {
              const name = item.name === "High hip" ? "highHip" : item.name.toLowerCase()
              return (
                <label key={name} className="text-sm font-medium">
                  {item.name} (cm)
                  <input
                    name={name}
                    type="number"
                    min="30"
                    max="250"
                    step="0.1"
                    inputMode="decimal"
                    value={measurements[name]}
                    onChange={handleChange}
                    placeholder={`e.g. ${exampleMeasurements[name]}`}
                    className="mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </label>
              )
            })}
            {error && <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <button className="sm:col-span-2 rounded-full bg-pink-500 px-6 py-3 font-medium text-white hover:bg-pink-600">Calculate Body Type</button>
          </form>
        </div>
      </div>}

      {result && (
        <div role="region" aria-label="Body type calculation result" className="mt-10 rounded-3xl border border-pink-200 bg-white p-8" aria-live="polite">
          {result.isExactMatch ? (
            <>
              <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Your closest match</p>
              <h2 className="mt-2 text-4xl font-semibold">{result.primary.name}</h2>
              <p className="mt-3 text-gray-600">{result.primary.description}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Your proportions are between categories</p>
              <h2 className="mt-2 text-3xl font-semibold">No single exact match</h2>
              <p className="mt-3 text-gray-600">Bodies are individual. These are the categories mathematically closest to your measurements:</p>
            </>
          )}

          {(!result.isExactMatch || result.alternatives.length > 0) && (
            <div className="mt-6">
              <h3 className="font-semibold">{result.isExactMatch ? "Other close possibilities" : "Closest possibilities"}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {result.alternatives.map((type) => (
                  <div key={type.id} className="rounded-2xl bg-pink-50 p-4"><p className="font-semibold">{type.name}</p><p className="mt-1 text-sm text-gray-600">{type.description}</p></div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-sm text-gray-500">Waist-to-hip ratio: {result.waistHipRatio.toFixed(2)}</p>
          <p className="mt-2 text-xs leading-5 text-gray-400">This result describes fashion proportions only. It is not a medical assessment or a standard your body needs to meet.</p>
          <button type="button" onClick={resetForm} className="mt-6 rounded-full border px-6 py-2.5 text-sm hover:border-pink-500 hover:text-pink-500">Calculate Again</button>
          {user ? (
            <button type="button" disabled={saving} onClick={saveResult} className="ml-3 mt-6 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-60">
              {saving ? "Saving…" : "Save to My Profile"}
            </button>
          ) : (
            <Link to="/login" className="ml-3 mt-6 inline-block rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white">Login to Save Result</Link>
          )}
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </section>
  )
}

export default BodyType
