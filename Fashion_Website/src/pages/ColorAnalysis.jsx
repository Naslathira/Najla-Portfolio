import { useState } from "react"
import { colorAnalysisOptions } from "../data/colorAnalysisData"
import { analyzeColors } from "../utils/colorAnalysis"
import { Link } from "react-router-dom"
import { useAuth } from "../features/auth/useAuth"

const initialInput = { hairColor: "", eyeColor: "", skinTone: "", undertone: "" }
const fields = [
  { name: "hairColor", label: "Hair Color", options: "hairColors" },
  { name: "eyeColor", label: "Eye Color", options: "eyeColors" },
  { name: "skinTone", label: "Skin Tone", options: "skinTones" },
  { name: "undertone", label: "Undertone", options: "undertones" },
]

const swatches = {
  "Earth Tones": "#9a6b45", Olive: "#777b38", Coral: "#ed7864", Peach: "#f4b183", Mustard: "#d2a21b", "Warm Red": "#b63d32",
  "Cool Blue": "#6389b8", "Icy Gray": "#c9d3dc", "Jewel Tones": "#633b78", "Icy Blue": "#b9dff2", Lavender: "#a995cf", Silver: "#aaaeb5", Emerald: "#167c5a",
  Orange: "#df7426", Brown: "#754b35", "Soft Pinks": "#df9bb2", Plums: "#75405e", Teal: "#287d7c", "Neutral Beige": "#c8b69f", Fluorescents: "#d8f336", "Harsh Yellow": "#f2d21b",
}

function ColorList({ title, colors, avoid = false }) {
  return (
    <div className={`rounded-2xl p-6 ${avoid ? "bg-gray-50" : "bg-pink-50"}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {colors.map((color) => (
          <div key={color} className="flex items-center gap-2 rounded-full border bg-white py-2 pl-2 pr-4 text-sm">
            <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: swatches[color] || "#ddd" }} />
            {color}
          </div>
        ))}
      </div>
    </div>
  )
}

function ColorAnalysis() {
  const { user, bodyProfile, saveProfile } = useAuth()
  const [input, setInput] = useState(initialInput)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    setInput((current) => ({ ...current, [event.target.name]: event.target.value }))
    setResult(null)
    setError("")
  }

  function handleSubmit(event) {
    event.preventDefault()
    const analysis = analyzeColors(input)
    if (!analysis) {
      setError("Please select all four characteristics before analyzing your colors.")
      return
    }
    setResult(analysis)
  }

  async function saveResult() {
    try {
      setSaving(true)
      setError("")
      await saveProfile(result.input)
      setResult(null)
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  function updateColorAnalysis() {
    setInput({
      hairColor: bodyProfile.hairColor || "",
      eyeColor: bodyProfile.eyeColor || "",
      skinTone: bodyProfile.skinTone || "",
      undertone: bodyProfile.undertone || "",
    })
    setResult(null)
    setError("")
    setIsEditing(true)
  }

  const savedAnalysis = bodyProfile?.undertone ? analyzeColors(bodyProfile) : null
  const hasSavedAnalysis = Boolean(user && savedAnalysis)

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Personal palette</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Color Analysis</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-500">Find clothing colors that complement your natural features using recommendations derived from our fashion dataset.</p>
      </div>

      {hasSavedAnalysis && !isEditing ? (
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-pink-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Saved to your profile</p>
          <h2 className="mt-3 text-3xl font-semibold">Your color palette is {savedAnalysis.profile}</h2>
          <p className="mt-4 text-gray-500">Your latest color-analysis profile is saved to your account.</p>
          <div className="mt-6"><ColorList title="Your Recommended Clothing Colors" colors={savedAnalysis.recommended} /></div>
          <button type="button" onClick={updateColorAnalysis} className="mt-7 rounded-full bg-pink-500 px-7 py-3 font-medium text-white hover:bg-pink-600">Update My Color Analysis</button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-3xl rounded-3xl border bg-white p-7 shadow-sm" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="text-sm font-medium">
              {field.label}
              <select name={field.name} value={input[field.name]} onChange={handleChange} className="mt-2 w-full rounded-xl border bg-white px-4 py-3 font-normal outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100">
                <option value="">Select {field.label.toLowerCase()}</option>
                {colorAnalysisOptions[field.options].map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <button className="mt-6 w-full rounded-full bg-pink-500 px-6 py-3 font-medium text-white hover:bg-pink-600">Analyze My Colors</button>
      </form>
      )}

      {result && (
        <div role="region" aria-label="Color analysis result" aria-live="polite" className="mt-10 rounded-3xl border bg-white p-8">
          <p className="text-sm font-medium uppercase tracking-wider text-pink-500">Your result</p>
          <h2 className="mt-2 text-3xl font-semibold">{result.profile}</h2>
          <p className="mt-3 text-gray-600">Based on your selected {result.input.hairColor.toLowerCase()} hair, {result.input.eyeColor.toLowerCase()} eyes, {result.input.skinTone.toLowerCase()} skin tone, and {result.input.undertone.toLowerCase()} undertone.</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <ColorList title="Recommended Clothing Colors" colors={result.recommended} />
            <ColorList title="Colors to Use Carefully" colors={result.avoid} avoid />
          </div>
          <div className="mt-6 grid gap-4 rounded-2xl border p-5 sm:grid-cols-2">
            <div><p className="text-sm text-gray-500">Best color-wheel region</p><p className="mt-1 font-medium">{result.wheelRegion}</p></div>
            <div><p className="text-sm text-gray-500">Suggested jewelry metal</p><p className="mt-1 font-medium">{result.jewelry}</p></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-gray-400">The source dataset maps clothing palettes primarily by undertone. Hair, eye, and skin selections describe your profile but do not change its palette in this dataset. Treat recommendations as styling inspiration, not fixed rules.</p>
          {user ? (
            <button type="button" disabled={saving} onClick={saveResult} className="mt-6 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-60">
              {saving ? "Saving…" : "Save to My Profile"}
            </button>
          ) : (
            <Link to="/login" className="mt-6 inline-block rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white">Login to Save Result</Link>
          )}
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </section>
  )
}

export default ColorAnalysis
