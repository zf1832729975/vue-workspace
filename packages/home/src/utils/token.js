const TOKEN_KEY = "token-admin"

export function setToken(value) {
  localStorage.setItem(TOKEN_KEY, value)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}
