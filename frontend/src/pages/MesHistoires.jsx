import { useState, useEffect, reload } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './MesHistoires.css';

const MesHistoires = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newHistoire, setNewHistoire] = useState({
    titre: '',
    descriptionCourte: '',
    tags: '',
    theme: ''
  });

  useEffect(() => {
    loadHistoires();
  }, []);

  const loadHistoires = async () => {
    try {
      setLoading(true);
      const response = await api.getMesHistoires(token);
      const data = await response.json();

      if (data.success) {
        setHistoires(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur de chargement des histoires');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHistoire = async (e) => {
    e.preventDefault();
    try {
      const histoireData = {
        ...newHistoire,
        tags: newHistoire.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.createHistoire(histoireData, token);
      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setNewHistoire({ titre: '', descriptionCourte: '', tags: '', theme: '' });
        navigate(`/editeur/${data.data._id}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'histoire');
    }
  };

  const handleDeleteHistoire = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) return;

    try {
      const response = await api.deleteHistoire(id, token);
      const data = await response.json();
      window.location.reload();

      if (!data.success) {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handlePublish = async (id) => {
    try {
      const response = await api.publishHistoire(id, token);
      const data = await response.json();

      if (data.success) {
        loadHistoires();
        alert('Histoire publiée avec succès !');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Erreur lors de la publication');
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      brouillon: { text: 'Brouillon', class: 'badge-draft' },
      publiée: { text: 'Publiée', class: 'badge-published' },
      suspendue: { text: 'Suspendue', class: 'badge-suspended' }
    };
    return badges[statut] || badges.brouillon;
  };

  return (
    <div className="mes-histoires-container">
      <div className="page-header">
        <h1>Mes Histoires</h1>
        <button className="btn-new" onClick={() => setShowModal(true)}>
          + Nouvelle Histoire
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement...</div>
      ) : histoires.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore créé d'histoires</p>
          <button className="btn-create-first" onClick={() => setShowModal(true)}>
            Créer ma première histoire
          </button>
        </div>
      ) : (
        <div className="histoires-list">
          {histoires.map((histoire) => {
            const badge = getStatutBadge(histoire.statut);
            return (
              <div key={histoire._id} className="histoire-item">
                <div className="histoire-info">
                  <h3>{histoire.titre}</h3>
                  <p>{histoire.descriptionCourte}</p>
                  <div className="histoire-stats">
                    <span className={`badge ${badge.class}`}>{badge.text}</span>
                    <span>📖 {histoire.nbFoisCommencee} lectures</span>
                    <span>✅ {histoire.nbFoisFinie} terminées</span>
                  </div>
                </div>
                <div className="histoire-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/editeur/${histoire._id}`)}
                  >
                    Éditer
                  </button>
                  {histoire.statut === 'brouillon' && (
                    <button 
                      className="btn-publish"
                      onClick={() => handlePublish(histoire._id)}
                    >
                      Publier
                    </button>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteHistoire(histoire._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nouvelle Histoire</h2>
            <form onSubmit={handleCreateHistoire}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  value={newHistoire.titre}
                  onChange={(e) => setNewHistoire({...newHistoire, titre: e.target.value})}
                  required
                  maxLength={200}
                />
              </div>
              <div className="form-group">
                <label>Description courte *</label>
                <textarea
                  value={newHistoire.descriptionCourte}
                  onChange={(e) => setNewHistoire({...newHistoire, descriptionCourte: e.target.value})}
                  required
                  maxLength={500}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={newHistoire.tags}
                  onChange={(e) => setNewHistoire({...newHistoire, tags: e.target.value})}
                  placeholder="aventure, fantastique, mystère"
                />
              </div>
              <div className="form-group">
                <label>Thème</label>
                <input
                  type="text"
                  value={newHistoire.theme}
                  onChange={(e) => setNewHistoire({...newHistoire, theme: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesHistoires;
