import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import logo from "../assets/logo.png"
import { useAuth } from "../features/auth/useAuth"

function Login() {
  const { user, loading, login, logout } = useAuth()
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleGoogleSuccess(credentialResponse) {
    try {
      setError("")
      setSubmitting(true)
      await login(credentialResponse.credential)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      setError("")
      setSubmitting(true)
      await logout()
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <img src={logo} alt="NP Active" className="h-24 w-auto" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-semibold">Login to NP Active</h1>
        <p className="mt-3 text-center text-sm text-gray-500">Sign in to save your size profile and preferences.</p>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className="mt-8 text-center text-sm text-gray-500">Checking your session…</p>
        ) : !user ? (
          <div className="mt-8 flex justify-center" aria-busy={submitting}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
          </div>
        ) : (
          <div className="mt-8 text-center">
            <img src={user.picture} alt="" className="mx-auto h-20 w-20 rounded-full" />
            <h2 className="mt-4 text-xl font-semibold">Hi, {user.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            <button disabled={submitting} onClick={handleLogout} className="mt-6 w-full rounded-full bg-pink-500 py-3 text-white hover:bg-pink-600 disabled:opacity-60">
              {submitting ? "Logging out…" : "Logout"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Login
