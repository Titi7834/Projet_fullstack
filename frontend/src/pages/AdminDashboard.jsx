import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('statistiques');
  const [statistiques, setStatistiques] = useState(null);
  const [users, setUsers] = useState([]);
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistiques();
    loadUsers();
    loadHistoires();
  }, []);

  const loadStatistiques = async () => {
    try {
      const response = await api.getStatistiquesGlobales(token);
      const data = await response.json();
      if (data.success) {
        setStatistiques(data.data);
      }
    } catch (err) {
      setError('Erreur de chargement des statistiques');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers(token);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setError('Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoires = async () => {
    try {
      const response = await api.getAllHistoires(token);
      const data = await response.json();
      if (data.success) {
        setHistoires(data.data);
      }
    } catch (err) {
      setError('Erreur de chargement des histoires');
    }
  };

  const handleToggleBan = async (userId, currentStatus) => {
    try {
      const response = await api.toggleBanUser(userId, !currentStatus, token);
      const data = await response.json();
      if (data.success) {
        loadUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Erreur lors du bannissement');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await api.updateUserRole(userId, newRole, token);
      const data = await response.json();
      if (data.success) {
        loadUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Erreur lors du changement de rôle');
    }
  };

  const handleToggleSuspend = async (histoireId, currentStatus) => {
    const shouldSuspend = currentStatus !== 'suspendue';
    try {
      const response = await api.toggleSuspendHistoire(histoireId, shouldSuspend, token);
      const data = await response.json();
      if (data.success) {
        loadHistoires();
        loadStatistiques();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Erreur lors de la suspension');
    }
  };

  return (
    <div className="admin-container">
      <h1>Tableau de Bord Admin</h1>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'statistiques' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('statistiques')}
        >
          Statistiques
        </button>
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button 
          className={activeTab === 'histoires' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('histoires')}
        >
          Histoires
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'statistiques' && statistiques && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Utilisateurs</h3>
              <div className="stat-value">{statistiques.utilisateurs.total}</div>
              <div className="stat-details">
                <div>Auteurs: {statistiques.utilisateurs.auteurs}</div>
                <div>Lecteurs: {statistiques.utilisateurs.lecteurs}</div>
                <div>Bannis: {statistiques.utilisateurs.bannis}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Histoires</h3>
              <div className="stat-value">{statistiques.histoires.total}</div>
              <div className="stat-details">
                <div>Publiées: {statistiques.histoires.publiees}</div>
                <div>Brouillons: {statistiques.histoires.brouillon}</div>
                <div>Suspendues: {statistiques.histoires.suspendues}</div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Parties</h3>
              <div className="stat-value">{statistiques.parties.total}</div>
              <div className="stat-details">
                <div>Total de parties jouées</div>
              </div>
            </div>
          </div>

          <div className="top-histoires">
            <h2>Top 10 Histoires</h2>
            <div className="top-list">
              {statistiques.topHistoires.map((histoire, index) => (
                <div key={histoire._id} className="top-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="titre">{histoire.titre}</span>
                  <span className="auteur">Par {histoire.auteur?.username}</span>
                  <span className="lectures">📖 {histoire.nbFoisCommencee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Gestion des Utilisateurs</h2>
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom d'utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <select 
                          value={user.role}
                          onChange={(e) => handleChangeRole(user._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="LECTEUR">Lecteur</option>
                          <option value="AUTEUR">Auteur</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td>
                        {user.statutBanni ? (
                          <span className="badge-banned">Banni</span>
                        ) : (
                          <span className="badge-active">Actif</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className={user.statutBanni ? 'btn-unban' : 'btn-ban'}
                          onClick={() => handleToggleBan(user._id, user.statutBanni)}
                        >
                          {user.statutBanni ? 'Débannir' : 'Bannir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'histoires' && (
        <div className="histoires-section">
          <h2>Gestion des Histoires</h2>
          <div className="histoires-admin-list">
            {histoires.map((histoire) => (
              <div key={histoire._id} className="histoire-admin-item">
                <div className="histoire-admin-info">
                  <h3>{histoire.titre}</h3>
                  <p>{histoire.descriptionCourte}</p>
                  <div className="histoire-admin-meta">
                    <span>Par {histoire.auteur?.username}</span>
                    <span>📖 {histoire.nbFoisCommencee} lectures</span>
                    <span className={`badge ${
                      histoire.statut === 'publiée' ? 'badge-published' : 
                      histoire.statut === 'suspendue' ? 'badge-suspended' : 'badge-draft'
                    }`}>
                      {histoire.statut}
                    </span>
                    {histoire.auteur?.statutBanni && (
                      <span className="badge-banned">Auteur banni</span>
                    )}
                  </div>
                </div>
                <div className="histoire-admin-actions">
                  <button 
                    className={histoire.statut === 'suspendue' ? 'btn-unsuspend' : 'btn-suspend'}
                    onClick={() => handleToggleSuspend(histoire._id, histoire.statut)}
                  >
                    {histoire.statut === 'suspendue' ? 'Réactiver' : 'Suspendre'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
