import { apiRequest } from "./client"

export const authApi = {
  getSession: () => apiRequest("/me"),
  loginWithGoogle: (credential) => apiRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  }),
  logout: () => apiRequest("/logout", { method: "POST" }),
}
