import { env } from "../config/env"

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${env.apiUrl}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Something went wrong")
  return data
}
