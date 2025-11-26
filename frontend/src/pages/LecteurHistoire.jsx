import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RatingModal from '../components/RatingModal';
import ReportModal from '../components/ReportModal';
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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [statistiquesParcours, setStatistiquesParcours] = useState(null);
  const [finsDebloquees, setFinsDebloquees] = useState([]);
  const [resuming, setResuming] = useState(false);
  const autoSaveIntervalRef = useRef(null);
  const hasCheckedSavedGame = useRef(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!hasCheckedSavedGame.current) {
      hasCheckedSavedGame.current = true;
      checkForSavedGame();
    }
  }, [id, token]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (pageActuelle && !gameOver && parcours.length > 0) {
      autoSaveIntervalRef.current = setInterval(() => {
        sauvegarderProgression();
      }, 30000); // 30 seconds
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [pageActuelle, parcours, gameOver]);

  const checkForSavedGame = async () => {
    try {
      const response = await api.reprendrePartie(id, token);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const shouldResume = confirm('Vous avez une partie sauvegardée. Voulez-vous la reprendre ?');
        if (shouldResume) {
          setResuming(true);
          setHistoire(data.data.histoire);
          setPageActuelle(data.data.pageActuelle);
          setParcours(data.data.parcours);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log('Pas de partie sauvegardée:', err);
    }
    commencerHistoire();
  };

  const sauvegarderProgression = async () => {
    if (!pageActuelle || gameOver) return;
    try {
      await api.sauvegarderProgression({
        histoireId: id,
        pageActuelle: pageActuelle._id,
        parcours
      }, token);
      console.log('Progression sauvegardée');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde');
    }
  };
  
  const handleRating = async ({ note, commentaire }) => {
    try {
      const response = await api.noterHistoire(id, { note, commentaire }, token);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setShowRatingModal(false);
        alert('Merci pour votre évaluation !');
      } else {
        alert(data.message || 'Erreur lors de la notation');
      }
    } catch (err) {
      console.error('Erreur notation:', err);
      alert('Erreur lors de la notation');
    }
  };

  const handleReport = async ({ raison }) => {
    try {
      const response = await api.signalerHistoire(id, { raison }, token);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setShowReportModal(false);
        alert('Signalement envoyé. Merci.');
      } else {
        alert(data.message || 'Erreur lors du signalement');
      }
    } catch (err) {
      console.error('Erreur signalement:', err);
      alert('Erreur lors du signalement');
    }
  };

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
      // Arrêter l'auto-save
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      await api.terminerPartie({
        histoireId: id,
        pageFinId,
        parcours
      }, token);
      
      // Charger statistiques et fins débloquées
      const [statsRes, finsRes] = await Promise.all([
        api.getStatistiquesParcours({ histoireId: id, parcours }, token),
        api.getFinsDebloquees(id, token)
      ]);
    
    const statsData = await statsRes.json();
    const finsData = await finsRes.json();
    
    if (statsData.success) {
      setStatistiquesParcours(statsData.data);
    }
    if (finsData.success) {
      setFinsDebloquees(finsData.data.finsDebloquees);
    }
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la partie');
  }
};

const recommencer = () => {
  setParcours([]);
  setGameOver(false);
  setStatistiquesParcours(null);
  setFinsDebloquees([]);
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
        <div className="header-actions">
          <button className="btn-rating" onClick={() => setShowRatingModal(true)}>
            ⭐ Noter
          </button>
          <button className="btn-report" onClick={() => setShowReportModal(true)}>
            🚩 Signaler
          </button>
        </div>
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
            {pageActuelle.labelFin && <h3>{pageActuelle.labelFin}</h3>}
            <p>Vous avez atteint une fin !</p>
            
            {statistiquesParcours && (
              <div className="statistiques-parcours">
                <h4>Statistiques de votre parcours :</h4>
                <p>Similarité avec les autres lecteurs : {statistiquesParcours.pourcentageSimilarite}%</p>
              </div>
            )}
            
            {finsDebloquees.length > 0 && (
              <div className="fins-debloquees">
                <h4>Fins débloquées ({finsDebloquees.length}) :</h4>
                <ul>
                  {finsDebloquees.map((fin, index) => (
                    <li key={index}>{fin.labelFin || 'Fin sans nom'}</li>
                  ))}
                </ul>
              </div>
            )}
            
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
      
      {/* Section des commentaires */}
      <div className="commentaire-showing">
        <h3>💬 Commentaires et avis</h3>
        {histoire?.commentaires && histoire.commentaires.length > 0 ? (
          <div className="commentaires-list">
            {histoire.commentaires.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    {comment.userId?.username || 'Utilisateur'}
                  </div>
                  <div className="comment-rating">
                    {'⭐'.repeat(comment.note)}
                    <span className="note-number">({comment.note}/5)</span>
                  </div>
                </div>
                {comment.commentaire && (
                  <div className="comment-text">
                    {comment.commentaire}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
        )}
      </div>
      
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)} 
        onSubmit={handleRating}
        histoireTitle={histoire?.titre}
      />
      
      <ReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)} 
        onSubmit={handleReport}
        histoireTitle={histoire?.titre}
      />
    </div>
  );
};

export default LecteurHistoire;
