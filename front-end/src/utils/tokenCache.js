const TOKEN_KEY = 'spotify_access_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(accessToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}