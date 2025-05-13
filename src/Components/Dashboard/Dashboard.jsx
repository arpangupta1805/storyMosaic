import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StoryCarddash from './storycarddash';
import './dashboard.css'; // We'll create this file for dashboard styling

const Dashboard = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    storyCount: 0,
    likedStories: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch user data from the backend
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${username}`);
        if (!isMounted) return; // Guard against updates after unmount

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name || 'Author',
            username: data.username,
            storyCount: 0, // We'll update this after fetching stories
            likedStories: data.liked_stories || []
          });
          
          // Fetch stories to get the accurate count
          const storiesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${username}/stories`);
          if (!isMounted) return; // Guard against updates after unmount

          if (storiesResponse.ok) {
            const storiesData = await storiesResponse.json();
            setStories(storiesData);
            // Update the story count
            setUserData(prevData => ({
              ...prevData,
              storyCount: storiesData.length
            }));
          } else {
            setFetchError("Failed to fetch stories");
          }
        } else {
          setFetchError("Failed to fetch user data");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user data:", error);
          setFetchError(error.message || "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Check if the current user is viewing their own dashboard
  const isOwnProfile = localStorage.getItem('username') === username;

  return (
    <div className='dashboard-container'>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      ) : fetchError ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Data</h2>
          <p>{fetchError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-username">@{username}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{stories.length}</span>
                  <span className="stat-label">Stories</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userData.likedStories.length}</span>
                  <span className="stat-label">Liked</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <Link to="/create" className="create-story-btn">
                Create New Story
              </Link>
            )}
          </div>

          {/* Dashboard Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
            >
              My Stories
            </button>
            {isOwnProfile && (
              <button 
                className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
                onClick={() => setActiveTab('liked')}
              >
                Liked Stories
              </button>
            )}
          </div>

          {/* Stories Section */}
          <div className="dashboard-content">
            <StoryCarddash 
              activeTab={activeTab} 
              username={username} 
              likedStories={userData.likedStories}
              isOwnProfile={isOwnProfile}
              stories={stories}
              setStories={setStories}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;