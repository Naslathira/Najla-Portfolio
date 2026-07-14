import { useEffect, useMemo, useState } from "react"
import { googleLogout } from "@react-oauth/google"
import { authApi } from "../../api/authApi"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bodyProfile, setBodyProfile] = useState(null)

  useEffect(() => {
    let active = true
    authApi.getSession()
      .then(async (data) => {
        if (!active) return
        setUser(data.user)
        if (data.user) {
          const profileData = await authApi.getProfile()
          if (active) setBodyProfile(profileData.profile.bodyProfile)
        }
      })
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  async function login(credential) {
    const data = await authApi.loginWithGoogle(credential)
    setUser(data.user)
    const profileData = await authApi.getProfile()
    setBodyProfile(profileData.profile.bodyProfile)
    return data.user
  }

  async function logout() {
    await authApi.logout()
    googleLogout()
    setUser(null)
    setBodyProfile(null)
  }

  async function saveProfile(profile) {
    const data = await authApi.saveBodyProfile(profile)
    setBodyProfile(data.bodyProfile)
    return data.bodyProfile
  }

  const value = useMemo(
    () => ({ user, bodyProfile, loading, login, logout, saveProfile }),
    [user, bodyProfile, loading],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
