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

  const contentType = response.headers?.get?.("content-type") || ""
  let data

  if (contentType.includes("application/json")) {
    data = await response.json()
  } else {
    const text = await response.text()
    if (!response.ok) {
      throw new Error(`API request failed (${response.status}). Make sure the backend server is running and up to date.`)
    }
    throw new Error(`API returned an unexpected response${text ? ` (${text.slice(0, 40)})` : ""}.`)
  }

  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`)
  return data
}
