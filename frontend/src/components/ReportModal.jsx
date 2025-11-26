import { useState } from 'react';
import './ReportModal.css';

const ReportModal = ({ isOpen, onClose, onSubmit, histoireTitle }) => {
  const [raison, setRaison] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (raison.trim().length < 10) {
      setError('La raison doit contenir au moins 10 caractères');
      return;
    }

    if (raison.trim().length > 500) {
      setError('La raison ne peut pas dépasser 500 caractères');
      return;
    }

    onSubmit({ raison: raison.trim() });
    setRaison('');
    setError('');
  };

  const handleClose = () => {
    setRaison('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚩 Signaler cette histoire</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        {histoireTitle && <p className="histoire-title">{histoireTitle}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="raison">Raison du signalement *</label>
            <textarea
              id="raison"
              value={raison}
              onChange={(e) => {
                setRaison(e.target.value);
                setError('');
              }}
              placeholder="Décrivez pourquoi vous signalez cette histoire (min. 10 caractères)..."
              rows={6}
              required
            />
            <div className="character-count">
              {raison.length} / 500 caractères
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Envoyer le signalement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
