const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = {
  // Auth
  login: (credentials) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  register: (userData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),

  // Histoires publiques
  getHistoiresPubliees: (search = '') =>
    fetch(`${API_BASE_URL}/lecteur/histoires?search=${search}`),

  commencerHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/lecteur/histoires/${id}/commencer`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getPage: (pageId, token) =>
    fetch(`${API_BASE_URL}/lecteur/pages/${pageId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  terminerPartie: (data, token) =>
    fetch(`${API_BASE_URL}/lecteur/parties/terminer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  getMesParties: (token) =>
    fetch(`${API_BASE_URL}/lecteur/mes-parties`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getStatistiquesHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/lecteur/histoires/${id}/statistiques`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Auteur - Histoires
  createHistoire: (data, token) =>
    fetch(`${API_BASE_URL}/auteur`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  getMesHistoires: (token) =>
    fetch(`${API_BASE_URL}/auteur/mes-histoires`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/auteur/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateHistoire: (id, data, token) =>
    fetch(`${API_BASE_URL}/auteur/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  deleteHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/auteur/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  publishHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/auteur/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Pages
  getPagesHistoire: (id, token) =>
    fetch(`${API_BASE_URL}/auteur/${id}/pages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  createPage: (histoireId, data, token) =>
    fetch(`${API_BASE_URL}/auteur/${histoireId}/pages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  updatePage: (histoireId, pageId, data, token) =>
    fetch(`${API_BASE_URL}/auteur/${histoireId}/pages/${pageId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  deletePage: (histoireId, pageId, token) =>
    fetch(`${API_BASE_URL}/auteur/${histoireId}/pages/${pageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  // Admin
  getAllUsers: (token) =>
    fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateUserRole: (id, role, token) =>
    fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ role })
    }),

  toggleBanUser: (id, ban, token) =>
    fetch(`${API_BASE_URL}/admin/users/${id}/ban`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ ban })
    }),

  getAllHistoires: (token) =>
    fetch(`${API_BASE_URL}/admin/histoires`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  toggleSuspendHistoire: (id, suspend, token) =>
    fetch(`${API_BASE_URL}/admin/histoires/${id}/suspend`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ suspend })
    }),

  getStatistiquesGlobales: (token) =>
    fetch(`${API_BASE_URL}/admin/statistiques`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
};

export default api;
