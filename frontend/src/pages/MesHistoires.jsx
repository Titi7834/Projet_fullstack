import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import api from '../services/api';
import './MesHistoires.css';

const MesHistoires = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedHistoire, setSelectedHistoire] = useState(null);
  const [statsAvancees, setStatsAvancees] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, histoireId: null });
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
        showToast('Histoire créée avec succès !', 'success');
        navigate(`/editeur/${data.data._id}`);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Erreur lors de la création de l\'histoire', 'error');
    }
  };

  const handleDeleteHistoire = async (id) => {
    setConfirmModal({ isOpen: true, histoireId: id });
  };

  const confirmDelete = async () => {
    try {
      const response = await api.deleteHistoire(confirmModal.histoireId, token);
      const data = await response.json();
      
      setConfirmModal({ isOpen: false, histoireId: null });
      
      if (data.success) {
        showToast('Histoire supprimée avec succès', 'success');
        loadHistoires();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handlePublish = async (id) => {
    try {
      const response = await api.publishHistoire(id, token);
      const data = await response.json();

      if (data.success) {
        loadHistoires();
        showToast('Histoire publiée avec succès !', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Erreur lors de la publication', 'error');
    }
  };

  const handlePreview = async (id) => {
    try {
      const response = await api.previewHistoire(id, token);
      const data = await response.json();
      
      if (data.success) {
        navigate(`/lire/${id}?preview=true`);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Erreur lors de l\'ouverture de la prévisualisation', 'error');
    }
  };

  const handleViewStats = async (histoire) => {
    try {
      setSelectedHistoire(histoire);
      const response = await api.getStatsAvancees(histoire._id, token);
      const data = await response.json();
      
      if (data.success) {
        setStatsAvancees(data.data);
        setShowStatsModal(true);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Erreur lors du chargement des statistiques', 'error');
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
                  <button 
                    className="btn-preview"
                    onClick={() => handlePreview(histoire._id)}
                    title="Prévisualiser"
                  >
                    👁️ Prévisualiser
                  </button>
                  <button 
                    className="btn-stats"
                    onClick={() => handleViewStats(histoire)}
                    title="Statistiques avancées"
                  >
                    📊 Stats
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

      {showStatsModal && statsAvancees && selectedHistoire && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content modal-stats" onClick={(e) => e.stopPropagation()}>
            <h2>📊 Statistiques - {selectedHistoire.titre}</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>📖 Lectures</h3>
                <p className="stat-value">{statsAvancees.nbLectures}</p>
              </div>
              <div className="stat-card">
                <h3>✅ Terminées</h3>
                <p className="stat-value">{statsAvancees.nbFins}</p>
              </div>
              <div className="stat-card">
                <h3>❌ Abandonnées</h3>
                <p className="stat-value">{statsAvancees.nbPartiesAbandonees}</p>
              </div>
              <div className="stat-card">
                <h3>📈 Taux de complétion</h3>
                <p className="stat-value">{statsAvancees.tauxCompletion.toFixed(1)}%</p>
              </div>
            </div>

            {statsAvancees.distributionFins && statsAvancees.distributionFins.length > 0 && (
              <div className="distribution-section">
                <h3>Distribution des fins atteintes</h3>
                <div className="distribution-list">
                  {statsAvancees.distributionFins
                    .sort((a, b) => b.count - a.count)
                    .map((fin, idx) => {
                      const totalFins = statsAvancees.nbFins || 1;
                      const percentage = (fin.count / totalFins) * 100;
                      return (
                        <div key={idx} className="fin-item">
                          <span className="fin-label">{fin.label || `Fin ${idx + 1}`}</span>
                          <div className="fin-bar-container">
                            <div 
                              className="fin-bar" 
                              style={{width: `${percentage}%`}}
                            ></div>
                            <span className="fin-count">{fin.count} ({percentage.toFixed(0)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="stats-footer">
              <p>⭐ Note moyenne: {statsAvancees.noteMoyenne ? statsAvancees.noteMoyenne.toFixed(1) : 'N/A'} ({statsAvancees.nbCommentaires} avis)</p>
            </div>

            <button className="btn-close-modal" onClick={() => setShowStatsModal(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer cette histoire ?"
        message="Cette action est irréversible. Toutes les pages et données associées seront perdues."
        confirmText="Supprimer"
        cancelText="Annuler"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, histoireId: null })}
      />
    </div>
  );
};

export default MesHistoires;
