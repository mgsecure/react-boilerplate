// Reusable submit cooldown utility
// Stores last submit timestamps in localStorage and enforces a time window per key.
// Bypass: if localStorage.beta === 'true', no cooldown is enforced (per AppContext localStorage flag).


const STORAGE_PREFIX = 'lastSubmit:'

/**
 * Check if a submit is allowed based on last timestamp in localStorage.
 * @param {string} key - Unique key for the action/form (e.g., 'discord').
 * @param {number} windowMs - Cooldown window in milliseconds (default 60_000 ms).
 * @param beta
 * @returns {{ allowed: boolean, remainingMs: number, bypass: boolean }}
 */
export function isSubmitAllowed(key, windowMs = 60_000, beta) {

    try {
        // Bypass rule if the beta flag is set to true in localStorage
        if (beta === 'true') {
            return {allowed: true, remainingMs: 0, bypass: true}
        }
    } catch (_) {
        // Ignore storage access errors and continue
    }

    let last = 0
    try {
        last = parseInt(localStorage.getItem(STORAGE_PREFIX + key) || '0', 10) || 0
    } catch (_) {
        last = 0
    }

    const now = Date.now()
    const elapsed = now - last
    const remainingMs = Math.max(0, windowMs - elapsed)
    return {allowed: remainingMs <= 0, remainingMs, bypass: false}
}

/**
 * Mark the action as submitted now (sets the last timestamp in localStorage).
 * @param {string} key
 */
export function markSubmitted(key) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, String(Date.now()))
    } catch (_) {
        // ignore storage errors
    }
}

/**
 * Convenience: formats milliseconds into MM:SS
 * @param {number} ms
 * @returns {string}
 */
export function formatCountdown(ms) {
    const clamped = Math.max(0, Math.floor(ms / 1000))
    const m = Math.floor(clamped / 60)
    const s = clamped % 60
    const pad = (n) => (n < 10 ? '0' + n : String(n))
    return `${pad(m)}:${pad(s)}`
}
