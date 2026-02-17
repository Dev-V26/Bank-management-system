export function getToken() {
  return localStorage.getItem('bank_token');
}

export function setToken(token) {
  localStorage.setItem('bank_token', token);
}

export function clearToken() {
  localStorage.removeItem('bank_token');
}

export function isAuthed() {
  return Boolean(getToken());
}

export function getRole() {
  return localStorage.getItem('bank_role') || 'user';
}

export function setRole(role) {
  localStorage.setItem('bank_role', role);
}

export function clearRole() {
  localStorage.removeItem('bank_role');
}
