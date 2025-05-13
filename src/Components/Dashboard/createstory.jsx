import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import '../story/edit.css'; // Reusing the sepia styling

export default function CreateStory() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState('sepia'); // Default theme
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Check for system preference on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('storyMosaicTheme');
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('storyMosaicTheme', theme);
  }, [theme]);

  const onSubmit = async (data) => {
    let confirm = window.confirm("Are you sure you want to publish this story?");
    if (confirm === false) {return};
    setLoading(true);
    setMessage("");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username || !token) {
      setMessage("Authentication error. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.content,
          author: username,
          sourceStory: ""
        }),
      });

      const result = await response.json();
      setMessage(result.message);
      if (response.ok) {
        navigate(`/user/${username}`);
      }
    } catch (error) {
      setMessage("Failed to publish the story.");
    } finally {
      setLoading(false);
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
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold theme-text">Create Your Story</h1>
          <div className="relative">
            <button 
              onClick={toggleThemeOptions}
              className="theme-button-secondary flex items-center space-x-2 px-3 py-2 rounded"
              aria-label="Change theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              )}
              <span>Theme</span>
            </button>
            
            {showThemeOptions && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => { setTheme('sepia'); setShowThemeOptions(false); }}
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'sepia' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  Sepia
                  {theme === 'sepia' && (
                    <svg className="h-5 w-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => { setTheme('light'); setShowThemeOptions(false); }}
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  Light
                  {theme === 'light' && (
                    <svg className="h-5 w-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => { setTheme('dark'); setShowThemeOptions(false); }}
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  Dark
                  {theme === 'dark' && (
                    <svg className="h-5 w-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="notepad-container">
          {/* Title Input */}
          <div className="notepad-header">
            <label className="notepad-section-title">Story Title</label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "Title must be at least 5 characters" },
                maxLength: { value: 100, message: "Title must be less than 100 characters" },
              })}
              className="notepad-title"
              placeholder="Enter your story title..."
            />
            {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description Input */}
          <div className="notepad-section">
            <label className="notepad-section-title">Description</label>
            <p className="theme-text-secondary text-sm mb-2">Write a brief description that captures the essence of your story</p>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" },
              })}
              className="notepad-textarea"
              placeholder="Write a soothing description that captures the essence of your story..."
            />
            {errors.description && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Story Content */}
          <div className="notepad-section">
            <label className="notepad-section-title">Story Content</label>
            <p className="theme-text-secondary text-sm mb-2">Let your creativity flow and write your story</p>
            <textarea
              {...register("content", {
                required: "Story content is required",
                minLength: { value: 100, message: "Story must be at least 100 characters" },
              })}
              className="notepad-textarea notepad-content"
              placeholder="Write your story here..."
            />
            {errors.content && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.content.message}</p>}
          </div>

          {/* Publish Button */}
          <div className="notepad-section">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="theme-text-secondary text-sm italic">
                Once published, your story will be visible to all users
              </p>
              <button
                type="submit"
                className="theme-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">Publishing...</span>
                  </div>
                ) : (
                  "Publish Story"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Response Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            message.includes("successfully") 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
