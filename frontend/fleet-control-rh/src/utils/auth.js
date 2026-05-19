export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function logout(navigate) {
  localStorage.clear();
  navigate('/login');
}
