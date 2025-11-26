import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [histoires, setHistoires] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const themes = ['Fantastique', 'Science-Fiction', 'Horreur', 'Aventure', 'Mystère', 'Romance', 'Historique', 'Thriller'];

  useEffect(() => {
    loadHistoires();
  }, [selectedTheme]);

  const loadHistoires = async (searchQuery = '') => {
    try {
      setLoading(true);
      const response = await api.getHistoiresPubliees(searchQuery, selectedTheme);
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

  const handleSearch = (e) => {
    e.preventDefault();
    loadHistoires(search);
  };

  const handleThemeFilter = (theme) => {
    setSelectedTheme(theme === selectedTheme ? '' : theme);
  };

  const handleStartHistoire = (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/lire/${id}`);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Not another hero's book</h1>
          <button className="btn-connect" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
        <div className="hero-image">
          <div className="globe-illustration">📖</div>
        </div>
      </section>

      {/* Histoires Section */}
      <section className="histoires-section">
        <h2>Les Meilleures Histoires</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une histoire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">Rechercher</button>
        </form>

        <div className="theme-filters">
          <button 
            className={`theme-btn ${selectedTheme === '' ? 'active' : ''}`}
            onClick={() => handleThemeFilter('')}
          >
            Tous
          </button>
          {themes.map((theme) => (
            <button
              key={theme}
              className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => handleThemeFilter(theme)}
            >
              {theme}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : histoires.length === 0 ? (
          <div className="no-results">Aucune histoire disponible</div>
        ) : (
          <div className="histoires-grid">
            {histoires.map((histoire) => (
              <div key={histoire._id} className="histoire-card">
                <div className="histoire-image">
                  <div className="placeholder-image"></div>
                </div>
                <div className="histoire-content">
                  <h3>{histoire.titre}</h3>
                  <p>{histoire.descriptionCourte}</p>
                  <div className="histoire-meta">
                    <span>👤 {histoire.auteur?.username || 'Anonyme'}</span>
                    <span>📖 {histoire.nbFoisCommencee} lectures</span>
                    {histoire.noteMoyenne > 0 && (
                      <span>⭐ {histoire.noteMoyenne}/5</span>
                    )}
                  </div>
                  <div className="histoire-tags">
                    {histoire.tags?.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="btn-read" 
                    onClick={() => handleStartHistoire(histoire._id)}
                  >
                    Commencer l'histoire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
