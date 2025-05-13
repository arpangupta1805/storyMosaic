// export default Edit
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarStory from './navbar_story';
import './edit.css'; // We'll create this file for the sepia notepad styling

const Edit = () => {
  const { storyid } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState({
    title: '',
    description: '',
    content: '',
    author: ''
  });
  const [isAuthor, setIsAuthor] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState('sepia'); // Default theme
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Fetch the story from the backend based on storyid
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStory({
            title: data.title,
            description: data.description,
            content: data.content,
            author: data.author
          });
          
          // Check if current user is the author
          const currentUser = localStorage.getItem('username');
          setIsAuthor(data.author === currentUser);
        } else {
          console.error('Story not found');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };
    fetchStory();
  }, [storyid]);

  const handleSave = async () => {
    if (isAuthor) {
      // If user is the author, directly edit the story
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/edit-story`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            title: story.title,
            description: story.description,
            content: story.content,
            username: localStorage.getItem('username'),
            storyId: storyid,
          }),
        });

        const data = await response.json();
        if (data.message === 'Story edited successfully') {
          alert('Story updated successfully');
          navigate(`/read/${storyid}`);
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error saving the story:', error);
      }
    } else {
      // If user is not the author, show comment box for pull request
      setShowCommentBox(true);
      // Scroll to the comment box
      setTimeout(() => {
        const commentBox = document.querySelector('.notepad-container.mt-6');
        if (commentBox) {
          commentBox.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubmitPullRequest = async () => {
    // Validate inputs
    if (!comment.trim()) {
      alert('Please provide a comment explaining your changes');
      return;
    }

    // Show loading state
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to submit a pull request');
        navigate('/authentication');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-pull-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          storyId: storyid,
          username: localStorage.getItem('username'),
          title: story.title,
          description: story.description,
          content: story.content,
          comment: comment
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Pull request submitted successfully');
        // Navigate to the story page instead of popular
        navigate(`/story/${storyid}`);
      } else {
        alert(`Error: ${data.message || 'Failed to submit pull request'}`);
        console.error('Pull request submission error:', data);
      }
    } catch (error) {
      console.error('Error submitting pull request:', error);
      alert(`An error occurred: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleThemeOptions = () => {
    setShowThemeOptions(!showThemeOptions);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'light':
        return 'theme-light';
      case 'dark':
        return 'theme-dark';
      default:
        return 'theme-sepia';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()}`}>
      <NavbarStory />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold theme-text">
              {isAuthor ? 'Edit Your Story' : 'Suggest Changes'}
            </h1>
            <div className="flex items-center space-x-3">
              {/* Theme Selector */}
              <div className="relative">
                <button 
                  onClick={toggleThemeOptions}
                  className="theme-button-secondary flex items-center space-x-2 px-3 py-2 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Theme</span>
                </button>
                
                {showThemeOptions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                    <button 
                      onClick={() => { setTheme('sepia'); setShowThemeOptions(false); }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Sepia
                    </button>
                    <button 
                      onClick={() => { setTheme('light'); setShowThemeOptions(false); }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Light
                    </button>
                    <button 
                      onClick={() => { setTheme('dark'); setShowThemeOptions(false); }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Dark
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSave}
                className="theme-button"
              >
                {isAuthor ? 'Save Changes' : 'Submit for Review'}
              </button>
            </div>
          </div>
          
          <div className="notepad-container">
            <div className="notepad-header">
              <input
                type="text"
                className="notepad-title"
                placeholder="Title"
                value={story.title}
                onChange={(e) => setStory({ ...story, title: e.target.value })}
              />
            </div>
            
            <div className="notepad-section">
              <h3 className="notepad-section-title">Description</h3>
              <textarea
                className="notepad-textarea"
                placeholder="Write a brief description of your story..."
                value={story.description}
                onChange={(e) => setStory({ ...story, description: e.target.value })}
              ></textarea>
            </div>
            
            <div className="notepad-section">
              <h3 className="notepad-section-title">Content</h3>
              <textarea
                className="notepad-textarea notepad-content"
                placeholder="Write your story here..."
                value={story.content}
                onChange={(e) => setStory({ ...story, content: e.target.value })}
              ></textarea>
            </div>
          </div>
          
          {showCommentBox && !isAuthor && (
            <div className="notepad-container mt-6">
              <div className="notepad-section">
                <h3 className="notepad-section-title">Comment on Your Proposed Changes</h3>
                <p className="theme-text-secondary mb-2 text-sm">Please explain why you're suggesting these changes and how they improve the story.</p>
                <textarea
                  className="notepad-textarea"
                  placeholder="Describe your changes and why they should be accepted..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowCommentBox(false)}
                    className="theme-button-secondary mr-3"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPullRequest}
                    className="theme-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Pull Request"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Edit;