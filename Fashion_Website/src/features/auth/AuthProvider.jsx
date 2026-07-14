import { useEffect, useMemo, useState } from "react"
import { googleLogout } from "@react-oauth/google"
import { authApi } from "../../api/authApi"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    authApi.getSession()
      .then((data) => active && setUser(data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  async function login(credential) {
    const data = await authApi.loginWithGoogle(credential)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await authApi.logout()
    googleLogout()
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
