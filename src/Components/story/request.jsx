import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavbarStory from './navbar_story'
import RequestCardFan from './storycardfan'
import './request.css'

const Request = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to view pull requests');
      navigate('/authentication');
      return;
    }

    // Fetch story title and check if user is author
    const fetchStoryTitle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setStoryTitle(data.title);
          
          // Check if current user is the author
          const currentUser = localStorage.getItem('username');
          setIsAuthor(data.author === currentUser);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryTitle();
  }, [storyId, navigate]);

  return (
    <div className="request-page">
      <NavbarStory />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading pull requests...</p>
          </div>
        ) : (
          <>
            <div className="request-header-wrapper">
              <div className="request-header">
                <h1 className="request-title">
                  Pull Requests
                  {isAuthor ? ' for Your Story' : ''}
                </h1>
                <p className="request-subtitle">
                  {isAuthor 
                    ? 'Review and manage suggested changes to your story'
                    : `View suggested changes for "${storyTitle}"`}
                </p>
              </div>
              
              <button 
                className="back-button"
                onClick={() => navigate(`/story/${storyId}`)}
              >
                ← Back to Story
              </button>
            </div>
            
            <div className="request-content">
              <RequestCardFan />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Request
