import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './EditeurHistoire.css';

const EditeurHistoire = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [histoire, setHistoire] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showPageModal, setShowPageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pageForm, setPageForm] = useState({
    titre: '',
    texte: '',
    statutFin: false,
    labelFin: '',
    choix: []
  });

  useEffect(() => {
    if (id) {
      loadHistoire();
      loadPages();
    }
  }, [id]);

  const loadHistoire = async () => {
    try {
      const response = await api.getHistoire(id, token);
      const data = await response.json();
      if (data.success) {
        setHistoire(data.data);
      }
    } catch (err) {
      setError('Erreur de chargement de l\'histoire');
    }
  };

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await api.getPagesHistoire(id, token);
      const data = await response.json();
      if (data.success) {
        setPages(data.data);
      }
    } catch (err) {
      setError('Erreur de chargement des pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    setSelectedPage(null);
    setPageForm({ titre: '', texte: '', statutFin: false, choix: [] });
    setShowPageModal(true);
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    setPageForm({
      titre: page.titre || '',
      texte: page.texte,
      statutFin: page.statutFin || false,
      labelFin: page.labelFin || '',
      choix: page.choix || []
    });
    setShowPageModal(true);
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    try {
      if (selectedPage) {
        // Modification
        const response = await api.updatePage(id, selectedPage._id, pageForm, token);
        const data = await response.json();
        if (data.success) {
          loadPages();
          setShowPageModal(false);
        } else {
          alert(data.message);
        }
      } else {
        // Création
        const response = await api.createPage(id, pageForm, token);
        const data = await response.json();
        if (data.success) {
          loadPages();
          setShowPageModal(false);
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!confirm('Supprimer cette page ?')) return;
    try {
      const response = await api.deletePage(id, pageId, token);
      const data = await response.json();
      if (data.success) {
        loadPages();
      }
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSetPageDepart = async (pageId) => {
    try {
      const response = await api.updateHistoire(id, { pageDepart: pageId }, token);
      const data = await response.json();
      if (data.success) {
        loadHistoire();
        alert('Page de départ définie !');
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const addChoix = () => {
    setPageForm({
      ...pageForm,
      choix: [...pageForm.choix, { texte: '', idPageChoix: '' }]
    });
  };

  const updateChoix = (index, field, value) => {
    const newChoix = [...pageForm.choix];
    newChoix[index][field] = value;
    setPageForm({ ...pageForm, choix: newChoix });
  };

  const removeChoix = (index) => {
    const newChoix = pageForm.choix.filter((_, i) => i !== index);
    setPageForm({ ...pageForm, choix: newChoix });
  };

  if (!histoire) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="editeur-container">
      <div className="editeur-header">
        <div>
          <h1>{histoire.titre}</h1>
          <p className="histoire-description">{histoire.descriptionCourte}</p>
          <div className="histoire-meta">
            <span className={`badge ${histoire.statut === 'publiée' ? 'badge-published' : 'badge-draft'}`}>
              {histoire.statut}
            </span>
            {histoire.pageDepart && (
              <span className="page-depart-info">📍 Page de départ définie</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-new-page" onClick={handleCreatePage}>
            + Nouvelle Page
          </button>
          <button className="btn-back" onClick={() => navigate('/mes-histoires')}>
            Retour
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement des pages...</div>
      ) : pages.length === 0 ? (
        <div className="empty-pages">
          <p>Cette histoire n'a pas encore de pages</p>
          <button className="btn-create-first-page" onClick={handleCreatePage}>
            Créer la première page
          </button>
        </div>
      ) : (
        <div className="pages-grid">
          {pages.map((page) => (
            <div key={page._id} className="page-card">
              <div className="page-card-header">
                <h3>{page.titre || 'Page sans titre'}</h3>
                {page.statutFin && <span className="badge-fin">🎭 FIN</span>}
              </div>
              <div className="page-preview">
                {page.texte.substring(0, 150)}
                {page.texte.length > 150 ? '...' : ''}
              </div>
              <div className="page-choix-count">
                {page.choix?.length || 0} choix
              </div>
              <div className="page-actions">
                <button 
                  className="btn-edit-page"
                  onClick={() => handleEditPage(page)}
                >
                  Éditer
                </button>
                {!histoire.pageDepart || histoire.pageDepart._id !== page._id ? (
                  <button 
                    className="btn-set-start"
                    onClick={() => handleSetPageDepart(page._id)}
                  >
                    Départ
                  </button>
                ) : (
                  <span className="is-start">✓ Départ</span>
                )}
                <button 
                  className="btn-delete-page"
                  onClick={() => handleDeletePage(page._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création/édition de page */}
      {showPageModal && (
        <div className="modal-overlay" onClick={() => setShowPageModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPage ? 'Éditer la page' : 'Nouvelle page'}</h2>
            <form onSubmit={handleSavePage}>
              <div className="form-group">
                <label>Titre de la page (optionnel)</label>
                <input
                  type="text"
                  value={pageForm.titre}
                  onChange={(e) => setPageForm({...pageForm, titre: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Texte de la page *</label>
                <textarea
                  value={pageForm.texte}
                  onChange={(e) => setPageForm({...pageForm, texte: e.target.value})}
                  required
                  rows={8}
                  placeholder="Écrivez ici..."
                />
              </div>

              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="statutFin"
                  checked={pageForm.statutFin}
                  onChange={(e) => setPageForm({...pageForm, statutFin: e.target.checked})}
                />
                <label htmlFor="statutFin">Cette page est une fin de l'histoire</label>
              </div>

              {pageForm.statutFin && (
                <div className="form-group">
                  <label>Nom de la fin (optionnel)</label>
                  <input
                    type="text"
                    value={pageForm.labelFin}
                    onChange={(e) => setPageForm({...pageForm, labelFin: e.target.value})}
                    placeholder="Ex: La victoire héroïque"
                  />
                </div>
              )}
              {!pageForm.statutFin && (
                <div className="choix-section">
                  <div className="choix-header">
                    <h3>Choix</h3>
                    <button type="button" className="btn-add-choix" onClick={addChoix}>
                      + Ajouter un choix
                    </button>
                  </div>

                  {pageForm.choix.map((choix, index) => (
                    <div key={index} className="choix-item">
                      <div className="choix-fields">
                        <input
                          type="text"
                          placeholder="Texte du choix"
                          value={choix.texte}
                          onChange={(e) => updateChoix(index, 'texte', e.target.value)}
                          required
                        />
                        <select
                          value={choix.idPageChoix}
                          onChange={(e) => updateChoix(index, 'idPageChoix', e.target.value)}
                          required
                        >
                          <option value="">-- Destination --</option>
                          {pages.filter(p => p._id !== selectedPage?._id).map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.titre || p.texte.substring(0, 30) + '...'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove-choix"
                        onClick={() => removeChoix(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPageModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditeurHistoire;
