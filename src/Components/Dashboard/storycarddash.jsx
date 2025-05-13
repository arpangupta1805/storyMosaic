// export default StoryCarddash;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './dashboard.css';

const StoryCarddash = ({ activeTab, username, likedStories, isOwnProfile, stories, setStories }) => {
  const navigate = useNavigate();
  const [likedStoryDetails, setLikedStoryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetchedStories, setHasFetchedStories] = useState(false);

  // Fetch stories associated with the username if not provided
  useEffect(() => {
    const fetchUserStories = async () => {
      // Check if we've already fetched stories to prevent infinite calls
      if (hasFetchedStories && activeTab === 'stories') {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${username}/stories`);
        if (response.ok) {
          const data = await response.json();
          setStories(data); // Set fetched stories in state
          setHasFetchedStories(true); // Mark that we've fetched stories
        } else {
          console.error("Failed to fetch stories");
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch details of liked stories
    const fetchLikedStories = async () => {
      if (!likedStories || likedStories.length === 0) {
        setLikedStoryDetails([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const likedStoriesDetails = await Promise.all(
          likedStories.map(async (storyId) => {
            try {
              const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyId}`);
              if (response.ok) {
                return await response.json();
              }
              return null;
            } catch (error) {
              console.error(`Error fetching story ${storyId}:`, error);
              return null;
            }
          })
        );

        // Filter out any null values (failed fetches)
        setLikedStoryDetails(likedStoriesDetails.filter(story => story !== null));
      } catch (error) {
        console.error("Error fetching liked stories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'stories') {
      fetchUserStories();
    } else if (activeTab === 'liked') {
      fetchLikedStories();
    }
  }, [username, activeTab, likedStories, setStories, hasFetchedStories]);

  // Reset the fetch flag when username or activeTab changes
  useEffect(() => {
    setHasFetchedStories(false);
  }, [username, activeTab]);

  // Handle click on a story card to navigate to the individual story page
  const handleCardClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  // Determine which stories to display based on active tab
  const displayStories = activeTab === 'stories' ? stories : likedStoryDetails;

  // Render loading state
  if (loading) {
    return (
      <div className="stories-loading">
        <div className="loading-spinner"></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  // Render empty state
  if (!displayStories || displayStories.length === 0) {
    return (
      <div className="empty-stories">
        <div className="empty-icon">📚</div>
        <h3>{activeTab === 'stories' ? 'No Stories Yet' : 'No Liked Stories'}</h3>
        <p>
          {activeTab === 'stories' 
            ? (isOwnProfile ? 'Start writing your first story!' : `${username} hasn't written any stories yet.`)
            : 'You haven\'t liked any stories yet. Explore and find stories you love!'}
        </p>
        {isOwnProfile && activeTab === 'stories' && (
          <Link to="/create" className="create-story-link">
            Create Your First Story
          </Link>
        )}
      </div>
    );
  }

  // Render stories
  return (
    <div className="stories-grid">
      {displayStories.map((story) => (
        <div key={story.storyId} className="story-card" onClick={() => handleCardClick(story.storyId)}>
          <div className="story-card-content">
            <h3 className="story-title">{story.title}</h3>
            <p className="story-author">by {story.author}</p>
            <p className="story-description">
              {story.description.length > 150
                ? `${story.description.substring(0, 150)}...`
                : story.description}
            </p>
            <div className="story-footer">
              <div className="story-likes">
                <span className="heart-icon">❤️</span>
                <span>{story.likes}</span>
              </div>
              <span className="story-date">{story.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryCarddash;