const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function readJsonResponse(response) {
  const body = await response.text();
  let data = {};

  if (body.trim()) {
    try {
      data = JSON.parse(body);
    } catch (error) {
      throw new Error(`The API returned an invalid response (${response.status}).`);
    }
  }

  if (!response.ok) {
    throw new Error(data.detail || data.message || `The API request failed (${response.status}).`);
  }

  return data;
}

export default API_BASE_URL;
