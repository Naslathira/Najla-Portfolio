import { apiRequest } from "./client"

export const authApi = {
  getSession: () => apiRequest("/me"),
  loginWithGoogle: (credential) => apiRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  }),
  logout: () => apiRequest("/logout", { method: "POST" }),
  getProfile: () => apiRequest("/profile"),
  saveBodyProfile: (profile) => apiRequest("/profile/body", {
    method: "PUT",
    body: JSON.stringify(profile),
  }),
}
