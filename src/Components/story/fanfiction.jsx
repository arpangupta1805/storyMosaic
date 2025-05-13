import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NavbarStory from './navbar_story'
import StoryCardfiction from './storycardfiction'
import './fanfiction.css' // We'll create this file for styling

const Fanfiction = () => {
  const { storyid } = useParams();
  const [storyTitle, setStoryTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch story title
    const fetchStoryTitle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStoryTitle(data.title);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryTitle();
  }, [storyid]);

  return (
    <div className="fanfiction-page">
      <NavbarStory />
      
      <div className="container mx-auto px-4 py-8">
        <div className="fanfiction-header-wrapper">
          <div className="fanfiction-header">
            <h1 className="fanfiction-title">Fan Fictions</h1>
            {storyTitle && (
              <p className="fanfiction-subtitle">
                inspired by <span className="story-title-highlight">{storyTitle}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="fanfiction-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading fan fictions...</p>
            </div>
          ) : (
            <StoryCardfiction storyTitle={storyTitle} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Fanfiction
