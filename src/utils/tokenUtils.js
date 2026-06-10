const TOKEN_KEY = "access_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token) {
  try {
    // JWT payloads are base64url-encoded — atob only accepts standard base64
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}