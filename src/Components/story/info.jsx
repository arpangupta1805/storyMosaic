import React, { useState, useEffect } from "react";
import NavbarStory from "./navbar_story";
import { useNavigate, useParams } from "react-router-dom";
import './info.css'; // We'll create this file for styling

const InfoSection = () => {
  const { storyid } = useParams();  // Get the storyId from the URL params
  const [story, setStory] = useState(null);  // State to store story details
  const [members, setMembers] = useState([]);  // State to store editors
  const [loading, setLoading] = useState(true);  // Loading state
  const [isAuthor, setIsAuthor] = useState(false);  // Check if current user is the author
  const [showAddEditorForm, setShowAddEditorForm] = useState(false);  // State to control add editor form
  const [newEditorUsername, setNewEditorUsername] = useState('');  // State for new editor username
  const [addingEditor, setAddingEditor] = useState(false);  // Loading state for adding editor
  const navigate = useNavigate();  // Initialize navigate hook

  // Fetch the story data based on storyId
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyid}`);
        const data = await response.json();
        if (data) {
          setStory(data);  // Store the story data
          setMembers(data.editors || []);  // Store the editors
          
          // Check if current user is the author
          const currentUser = localStorage.getItem('username');
          setIsAuthor(data.author === currentUser);
        } else {
          console.error("Story data not found.");
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        // Add a small delay for the loading animation
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchStory();
  }, [storyid]);  // Re-run the effect when the storyId changes

  const handleUsernameClick = (username) => {
    navigate(`/user/${username}`);  // Navigate to the user's dashboard
  };

  const addEditor = async (e) => {
    e?.preventDefault();
    if (!newEditorUsername.trim()) return;
    
    setAddingEditor(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/add-editor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          storyId: storyid,
          username: newEditorUsername,
          author: story.author,
        }),
      });

      const result = await response.json();
      console.log("Server Response:", result.message);

      if (response.ok) {
        setMembers([...members, newEditorUsername]); // Update state only if successful
        setNewEditorUsername(''); // Clear input
        setShowAddEditorForm(false); // Hide form
        
        // Show success message with animation
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = result.message;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 2000);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error adding editor:", error);
      alert("Failed to add editor. Try again.");
    } finally {
      setAddingEditor(false);
    }
  };

  const handleDeleteEditor = async (username) => { 
    const confirmDelete = window.confirm(`Are you sure you want to remove @${username} as an editor?`);
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/remove-editor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          storyId: storyid,
          username: username,
          author: story.author,
        }),
      });
  
      const result = await response.json();
      console.log("Server Response:", result.message);
  
      if (response.ok) {
        // Animate the removal
        const editorElement = document.getElementById(`editor-${username}`);
        if (editorElement) {
          editorElement.classList.add('editor-removing');
          setTimeout(() => {
            setMembers(members.filter(member => member !== username)); // Update state
          }, 300);
        } else {
          setMembers(members.filter(member => member !== username)); // Update state immediately if no animation
        }
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = result.message;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 2000);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error removing editor:", error);
      alert("Failed to remove editor. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="info-page">
        <NavbarStory />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading story information...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="info-page">
        <NavbarStory />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Story Not Found</h2>
          <p>The story you're looking for could not be found.</p>
          <button 
            onClick={() => navigate('/')}
            className="back-home-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <NavbarStory />
      <div className="info-container">
        {/* Story Info Section */}
        <div className="story-info-section">
          <div className="story-header">
            <h1 className="story-title1">{story.title}</h1>
            <div className="story-meta">
              <div className="story-stats">
                <div className="stat">
                  <span className="stat-value">{story.likes || 0}</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{members.length}</span>
                  <span className="stat-label">Editors</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="author-section">
            <h2 className="section-title">Author</h2>
            <div className="author-card" onClick={() => handleUsernameClick(story.author)}>
              <div className="avatar">
                {story.author.charAt(0).toUpperCase()}
              </div>
              <div className="author-info">
                <h3 className="author-name">{story.author}</h3>
                <p className="author-username">@{story.author}</p>
              </div>
              <div className="view-profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Editors Section */}
        <div className="editors-section">
          <div className="editors-header">
            <h2 className="section-title">Editors</h2>
            {isAuthor && (
              <button 
                className="add-editor-button"
                onClick={() => setShowAddEditorForm(!showAddEditorForm)}
              >
                {showAddEditorForm ? 'Cancel' : 'Add Editor'}
              </button>
            )}
          </div>
          
          {/* Add Editor Form */}
          {showAddEditorForm && isAuthor && (
            <form className="add-editor-form" onSubmit={addEditor}>
              <input
                type="text"
                placeholder="Enter username"
                value={newEditorUsername}
                onChange={(e) => setNewEditorUsername(e.target.value)}
                className="editor-input"
                required
              />
              <button 
                type="submit" 
                className="submit-button"
                disabled={addingEditor}
              >
                {addingEditor ? (
                  <div className="flex items-center">
                    <div className="small-spinner"></div>
                    <span>Adding...</span>
                  </div>
                ) : 'Add'}
              </button>
            </form>
          )}
          
          {/* Editors List */}
          <div className="editors-list">
            {members.length === 0 ? (
              <div className="no-editors">
                <p>No editors have been added to this story yet.</p>
                {isAuthor && (
                  <p className="help-text">
                    As the author, you can add editors to collaborate on your story.
                  </p>
                )}
              </div>
            ) : (
              members.map((member, index) => (
                <div
                  key={index}
                  id={`editor-${member}`}
                  className="editor-card"
                >
                  <div className="editor-avatar">
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <div className="editor-info" onClick={() => handleUsernameClick(member)}>
                    <h3 className="editor-name">{member}</h3>
                    <p className="editor-username">@{member}</p>
                  </div>
                  {isAuthor && (
                    <button 
                      className="remove-editor-button"
                      onClick={() => handleDeleteEditor(member)}
                      aria-label="Remove editor"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;