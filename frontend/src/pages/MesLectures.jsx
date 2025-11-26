import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './MesLectures.css';

const MesLectures = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'finished', 'ongoing'

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    chargerMesParties();
  }, [token]);

  const chargerMesParties = async () => {
    try {
      setLoading(true);
      const response = await api.getMesParties(token);
      const data = await response.json();

      if (data.success) {
        setParties(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement de vos lectures');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatistiques = () => {
    const total = parties.length;
    const nbPages = parties.reduce((sum, partie) => sum + partie.parcours.length, 0);
    const moyennePages = total > 0 ? Math.round(nbPages / total) : 0;

    return {
      total,
      moyennePages
    };
  };

  const stats = getStatistiques();

  if (loading) {
    return <div className="loading-container">Chargement de vos lectures...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="mes-lectures-container">
      <div className="lectures-header">
        <h1>📚 Mes Lectures</h1>
        <button className="btn-retour" onClick={() => navigate('/')}>
          ← Retour à l'accueil
        </button>
      </div>

      {parties.length === 0 ? (
        <div className="no-lectures">
          <p>Vous n'avez pas encore terminé d'histoires.</p>
          <button className="btn-explorer" onClick={() => navigate('/')}>
            Explorer les histoires
          </button>
        </div>
      ) : (
        <>
          <div className="stats-overview">
            <div className="stat-card">
              <h3>📖 Histoires terminées</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>📄 Moyenne de pages</h3>
              <p className="stat-value">{stats.moyennePages}</p>
            </div>
          </div>

          <div className="parties-list">
            {parties.map((partie) => (
              <div key={partie._id} className="partie-card">
                <div className="partie-header">
                  <h3>{partie.histoire?.titre || 'Histoire supprimée'}</h3>
                  <span className="partie-date">{formatDate(partie.createdAt)}</span>
                </div>
                
                {partie.histoire?.descriptionCourte && (
                  <p className="partie-description">{partie.histoire.descriptionCourte}</p>
                )}
                
                <div className="partie-stats">
                  <div className="stat-item">
                    <span className="stat-label">📄 Pages visitées :</span>
                    <span className="stat-value">{partie.parcours.length}</span>
                  </div>
                  {partie.pageFin && (
                    <div className="stat-item">
                      <span className="stat-label">🎭 Fin atteinte :</span>
                      <span className="stat-value">{partie.pageFin.titre || 'Fin sans titre'}</span>
                    </div>
                  )}
                </div>

                {partie.histoire && (
                  <button 
                    className="btn-rejouer"
                    onClick={() => navigate(`/histoires/${partie.histoire._id}`)}
                  >
                    Rejouer cette histoire
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MesLectures;
