
const API_BASE = `http://${window.location.hostname}:3000/api`;
function authHeaders() {
  const token = localStorage.getItem('pluri_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}


export const authApi = {
  async register(username, email, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    localStorage.setItem('pluri_token', data.token);
    return data;
  },

  async login(username, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('pluri_token', data.token);
    return data;
  },

  async me() {
    return apiFetch('/auth/me');
  },

  logout() {
    localStorage.removeItem('pluri_token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('pluri_token');
  },
};


export const quizApi = {
  async getAll() {
    return apiFetch('/quizzes');
  },

  async getById(id) {
    return apiFetch(`/quizzes/${id}`);
  },

  async create(quizData) {
    return apiFetch('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  async update(id, quizData) {
    return apiFetch(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  },

  async delete(id) {
    return apiFetch(`/quizzes/${id}`, { method: 'DELETE' });
  },
};


export const resultsApi = {
  async submit(quizId, answers) {
    return apiFetch('/results', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, answers }),
    });
  },

  async myHistory() {
    return apiFetch('/results/me');
  },


  async leaderboard(quizId) {
    return apiFetch(`/results/leaderboard/${quizId}`);
  },

  async globalLeaderboard() {
    return apiFetch('/results/leaderboard-global');
  },
};