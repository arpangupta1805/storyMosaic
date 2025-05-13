import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './fanfiction.css';

const FictionCardFiction = ({ storyTitle }) => {
  const { storyid } = useParams();
  const [fictions, setFictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFictions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fan-fiction/${storyid}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setFictions(data);
        } else {
          setFictions([]);
        }
      } catch (error) {
        console.error("Error fetching fanfictions:", error);
        setFictions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFictions();
  }, [storyid]);
  
  const handleCardClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const createFanFiction = () => {
    navigate(`/create-fanfiction/${storyid}`);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading fan fictions...</p>
      </div>
    );
  }

  return (
    <div className="fanfiction-container">
      <button 
        className="create-fanfiction-btn"
        onClick={createFanFiction}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Create Fan Fiction
      </button>
      
      {fictions.length === 0 ? (
        <div className="empty-fanfictions">
          <div className="empty-icon">📚</div>
          <h3>No Fan Fictions Yet</h3>
          <p>
            Be the first to create a fan fiction inspired by{" "}
            <span className="story-title-highlight">{storyTitle}</span>
          </p>
          <button 
            className="create-fanfiction-btn"
            onClick={createFanFiction}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Fan Fiction
          </button>
        </div>
      ) : (
        <div className="fanfiction-grid">
          {fictions.map((fiction) => (
            <div 
              key={fiction._id} 
              className="fanfiction-card"
              onClick={() => handleCardClick(fiction.storyId)}
            >
              <div className="fanfiction-card-content">
                <h3 className="fanfiction-card-title">
                  {fiction.title}
                </h3>
                <p className="fanfiction-card-author">
                  by <Link 
                    to={`/user/${fiction.author}`}
                    onClick={(e) => e.stopPropagation()}
                    className="author-link"
                  >
                    {fiction.author}
                  </Link>
                </p>
                <p className="fanfiction-card-description">
                  {fiction.description.length > 150
                    ? `${fiction.description.substring(0, 150)}...`
                    : fiction.description}
                </p>
                <div className="fanfiction-card-footer">
                  <div className="fanfiction-card-likes">
                    <span>❤️</span>
                    <span>{fiction.likes}</span>
                  </div>
                  <span className="fanfiction-card-date">{fiction.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FictionCardFiction;
