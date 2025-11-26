import { useState } from 'react';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, onSubmit, histoireTitle }) => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }
    onSubmit({ note, commentaire: commentaire.trim() || undefined });
    setNote(0);
    setCommentaire('');
  };

  const handleClose = () => {
    setNote(0);
    setCommentaire('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>&times;</button>
        
        <h2>Noter cette histoire</h2>
        <p className="histoire-title">{histoireTitle}</p>

        <form onSubmit={handleSubmit}>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoveredStar || note) ? 'filled' : ''}`}
                onClick={() => setNote(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Votre commentaire (optionnel)..."
            rows="5"
            maxLength="500"
          />

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
