const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export default API_BASE_URL;
