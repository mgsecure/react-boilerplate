export const API_PREFIX = '/api'

export const sleep = ms => new Promise(r => setTimeout(r, ms))

// Minimal helper to fetch required env vars with optional fallback
export function assertEnv(name, fallback) {
  const val = process.env[name]
  if (val === null || val === '') {
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required env var: ${name}`)
  }
  return val
}
