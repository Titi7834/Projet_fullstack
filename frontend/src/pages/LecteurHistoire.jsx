import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LecteurHistoire.css';

const LecteurHistoire = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [histoire, setHistoire] = useState(null);
  const [pageActuelle, setPageActuelle] = useState(null);
  const [parcours, setParcours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    commencerHistoire();
  }, [id, token]);

  const commencerHistoire = async () => {
    try {
      setLoading(true);
      const response = await api.commencerHistoire(id, token);
      const data = await response.json();

      if (data.success) {
        setHistoire(data.data.histoire);
        setPageActuelle(data.data.pageActuelle);
        setParcours([data.data.pageActuelle._id]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur de chargement de l\'histoire');
    } finally {
      setLoading(false);
    }
  };

  const handleChoix = async (choix) => {
    try {
      const response = await api.getPage(id, choix.idPageChoix, token);
      const data = await response.json();

      if (data.success) {
        const nouvellePage = data.data;
        setPageActuelle(nouvellePage);
        setParcours([...parcours, nouvellePage._id]);

        // Vérifier si c'est une fin
        if (nouvellePage.statutFin) {
          setGameOver(true);
          await terminerPartie(nouvellePage._id);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement de la page');
    }
  };

  const terminerPartie = async (pageFinId) => {
    try {
      await api.terminerPartie({
        histoireId: id,
        pageFinId,
        parcours
      }, token);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la partie');
    }
  };

  const recommencer = () => {
    setParcours([]);
    setGameOver(false);
    commencerHistoire();
  };

  if (loading) {
    return <div className="loading-container">Chargement de l'histoire...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!histoire || !pageActuelle) {
    return <div className="error-container">Histoire non trouvée</div>;
  }

  return (
    <div className="lecteur-container">
      <div className="lecteur-header">
        <h1>{histoire.titre}</h1>
        <p className="auteur">Par {histoire.auteur?.username}</p>
      </div>

      <div className="lecteur-content">
        <div className="page-content">
          {pageActuelle.titre && (
            <h2 className="page-titre">{pageActuelle.titre}</h2>
          )}
          <div className="page-texte">
            {pageActuelle.texte}
          </div>
        </div>

        {gameOver ? (
          <div className="game-over">
            <h2>🎭 Fin de l'histoire</h2>
            <p>Vous avez atteint une fin !</p>
            <div className="game-over-actions">
              <button onClick={recommencer} className="btn-recommencer">
                Recommencer
              </button>
              <button onClick={() => navigate('/')} className="btn-home">
                Retour à l'accueil
              </button>
            </div>
          </div>
        ) : pageActuelle.choix && pageActuelle.choix.length > 0 ? (
          <div className="choix-container">
            <h3>Que voulez-vous faire ?</h3>
            <div className="choix-list">
              {pageActuelle.choix.map((choix, index) => (
                <button
                  key={index}
                  className="btn-choix"
                  onClick={() => handleChoix(choix)}
                >
                  {choix.texte}
                </button>
              ))}
            </div>
          </div>
        ) : !pageActuelle.statutFin ? (
          <div className="no-choices">
            <p>Cette page n'a pas de suite configurée.</p>
            <button onClick={() => navigate('/')} className="btn-home">
              Retour à l'accueil
            </button>
          </div>
        ) : null}
      </div>

      <div className="parcours-info">
        Pages visitées : {parcours.length}
      </div>
    </div>
  );
};

export default LecteurHistoire;
