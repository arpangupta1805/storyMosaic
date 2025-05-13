import React, { useState, useEffect } from 'react'
import { Link, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom'
import './navbar_story.css'

const NavbarStory = () => {
  // Get storyId from multiple possible param names
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Extract storyId from URL if not in params
  const getStoryId = () => {
    // Try to get from params first
    const storyId = params.storyid || params.storyId;
    
    if (storyId) return storyId;
    
    // If not in params, try to extract from URL path
    const pathParts = location.pathname.split('/');
    const storyIdIndex = pathParts.findIndex(part => 
      part === 'story' || part === 'edit' || part === 'request'
    );
    
    if (storyIdIndex !== -1 && pathParts[storyIdIndex + 1]) {
      return pathParts[storyIdIndex + 1];
    }
    
    return null;
  };
  
  const storyId = getStoryId();
  const [isAuthor, setIsAuthor] = useState(false);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) {
        console.error("No story ID found");
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching story with ID: ${storyId}`);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
          
          // Check if current user is the author
          const currentUser = localStorage.getItem('username');
          setIsAuthor(data.author === currentUser);
        } else {
          console.error(`Failed to fetch story: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const deleteStory = () => {
    if (!storyId) {
      alert('Story ID not found');
      return;
    }
    
    let ask = confirm('Are you sure you want to delete this story?')
    if (ask){
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delete-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ storyId: storyId }),
      })
        .then((response) => {
          if (response.ok) {
            alert('Story deleted successfully');
            navigate('/popular');
          } else {
            alert('Failed to delete story');
          }
        })
        .catch((error) => {
          console.error('Error deleting story:', error);
        });
    }
  }

  const handleEditClick = () => {
    if (!storyId) {
      alert('Story ID not found');
      return;
    }
    
    if (!localStorage.getItem('token')) {
      alert("You need to log in to edit a story.");
      navigate("/authentication");
      return;
    }
    
    navigate(`/edit/${storyId}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // If no storyId is found, don't render the navbar
  if (!storyId) {
    return null;
  }

  return (
    <nav className="story-navbar">
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        ☰ Menu
      </button>
      
      <ul className={`story-navbar-list ${mobileMenuOpen ? 'active' : ''}`}>
        <li className="story-navbar-item">
          <NavLink 
            className={({isActive}) => isActive ? "story-navbar-link active" : "story-navbar-link"} 
            to={`/story/${storyId}/read`}
            onClick={closeMobileMenu}
          >
            Read
          </NavLink>
        </li>
        <li className="story-navbar-item">
          <div 
            className="story-navbar-link"
            onClick={() => {
              handleEditClick();
              closeMobileMenu();
            }}
          >
            {isAuthor ? "Edit Story" : "Suggest Edits"}
          </div>
        </li>
        <li className="story-navbar-item">
          <NavLink 
            className={({isActive}) => isActive ? "story-navbar-link active" : "story-navbar-link"} 
            to={`/request/${storyId}`}
            onClick={closeMobileMenu}
          >
            Pull Requests
          </NavLink>
        </li>
        <li className="story-navbar-item">
          <NavLink 
            className={({isActive}) => isActive ? "story-navbar-link active" : "story-navbar-link"} 
            to={`/story/${storyId}/fanfictions`}
            onClick={closeMobileMenu}
          >
            Fanfictions
          </NavLink>
        </li>
        <li className="story-navbar-item">
          <NavLink 
            className={({isActive}) => isActive ? "story-navbar-link active" : "story-navbar-link"} 
            to={`/story/${storyId}/info`}
            onClick={closeMobileMenu}
          >
            Info
          </NavLink>
        </li>
        {isAuthor && (
          <li className="story-navbar-item">
            <button 
              className="delete-button"
              onClick={() => {
                deleteStory();
                closeMobileMenu();
              }}
            >
              Delete
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default NavbarStory
