import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './card.css'; // We'll update this file for the notebook styling

export default function StoryReader() {
  const { storyid } = useParams(); // Get storyId from URL
  const navigate = useNavigate(); // For navigation
  const [story, setStory] = useState(null); // State to store fetched story data
  const [liked, setLiked] = useState(false); // State to track if user liked the story
  const [theme, setTheme] = useState("notebook"); // Default to notebook theme
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeMessage, setLikeMessage] = useState("");
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!token);

    const fetchStory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
          
          // Check if the user has liked the story
          if (username && data.liked_users && data.liked_users.includes(username)) {
            setLiked(true);
          }

          // Check if the user is the author
          setIsAuthor(username === data.author);
        } else {
          console.error("Story not found");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchStory();
  }, [storyid]);

  const handleLikeClick = async () => {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      
      if (!username || !token) {
        alert("You need to log in to like a story.");
        navigate("/authentication");
        return;
      }

      // Show loading state
      setIsLiking(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/story/click-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ storyId: storyid, username }),
      });

      const result = await response.json();
      console.log("Like Response:", result.message);

      if (response.ok) {
        setLiked(result.liked);
        setStory((prev) => ({ ...prev, likes: result.likes })); // Update likes count
        
        // Show a brief success message
        setLikeMessage(result.liked ? "Story liked!" : "Story unliked");
        setTimeout(() => setLikeMessage(""), 2000); // Clear message after 2 seconds
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error liking story:", error);
      alert("Failed to like story. Try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleEditClick = () => {
    if (!isLoggedIn) {
      alert("You need to log in to edit a story.");
      navigate("/authentication");
      return;
    }
    
    navigate(`/edit/${storyid}`);
  };

  const toggleThemeOptions = () => {
    setShowThemeOptions(!showThemeOptions);
  };

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  const { title, description, likes, author, content, date } = story;

  // Function to split content into lines for the notebook style
  const contentLines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <>
      <div className={`min-h-screen px-4 md:px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : 
        theme === "sepia" ? "bg-amber-50 text-gray-900" : 
        theme === "notebook" ? "bg-gray-100 text-gray-900" : 
        "bg-white text-gray-900"
      }`}>
        <div className="mx-auto max-w-4xl py-8">
          {/* Theme Toggle and Actions */}
          <div className="flex justify-between items-center mb-8">
            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={toggleThemeOptions}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Theme</span>
              </button>
              
              {showThemeOptions && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                  <button 
                    onClick={() => { setTheme("notebook"); setShowThemeOptions(false); }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Notebook
                  </button>
                  <button 
                    onClick={() => { setTheme("light"); setShowThemeOptions(false); }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => { setTheme("dark"); setShowThemeOptions(false); }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => { setTheme("sepia"); setShowThemeOptions(false); }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Sepia
                  </button>
                </div>
              )}
            </div>
            
            {/* Like Button */}
            <div className="flex items-center space-x-2">
              <button 
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  liked ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
                } hover:bg-opacity-80 transition-colors`}
                onClick={handleLikeClick}
                disabled={isLiking}
              >
                <span className={`text-lg ${liked ? "text-red-500" : "text-gray-500"}`}>
                  ❤️
                </span>
                <span>{likes}</span>
                {isLiking && (
                  <svg className="animate-spin ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
              {likeMessage && (
                <span className="text-sm text-green-500 animate-fade-in-out">{likeMessage}</span>
              )}
            </div>
          </div>
          
          {/* Story Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h1>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  <span className='font-light'>by </span>
                  <span className='hover:underline cursor-pointer'>{author}</span>
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{date}</p>
              </div>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {isAuthor ? "Edit Story" : "Suggest Edits"}
              </button>
            </div>
          </div>

          {/* Story Description */}
          <div className={`mb-8 p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : 
            theme === "sepia" ? "bg-amber-100" : 
            theme === "notebook" ? "bg-white" : 
            "bg-gray-50"
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Description</h2>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{description}</p>
          </div>

          {/* Story Content */}
          <div className={`p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : 
            theme === "sepia" ? "bg-amber-100" : 
            theme === "notebook" ? "notebook-paper" : 
            "bg-white"
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Story Content</h2>
            <div className={theme === "notebook" ? "notebook-content" : ""}>
              {theme === "notebook" ? (
                <div className="notebook-lines">
                  {contentLines.map((line, index) => (
                    <p key={index} className="notebook-line">{line || ' '}</p>
                  ))}
                </div>
              ) : (
                <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
