import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const StoryCard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedStories, setLikedStories] = useState([]); // Track liked stories
  const navigate = useNavigate();

  // Fetch stories when the component mounts
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/most-popular-stories/12');
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        setStories(data); // Set fetched data into state
      } catch (error) {
        setError(error.message); // Handle error if any
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchStories(); // Call the function to fetch stories
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Handle card click to navigate to story's read page
  const handleCardClick = (storyId) => {
    navigate(`/${storyId}/read`);
  };

  // Handle like functionality
  const handleLike = (storyId) => {
    if (likedStories.includes(storyId)) {
      return; // Prevent liking the same story multiple times
    }

    // Add the story to the liked stories list
    setLikedStories([...likedStories, storyId]);

    // Update the likes count for the story (locally)
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.storyId === storyId ? { ...story, likes: story.likes + 1 } : story
      )
    );

    // Optionally, send a request to the server to persist the like
    // fetch(`/api/like/${storyId}`, { method: 'POST' });
  };

  if (loading) {
    return <div className="text-center py-50  m-auto text-4xl font-bold text-gray-400">Loading...</div>; // Show loading message while data is being fetched
  }

  if (error) {
    return <div className="text-center py-50 text-4xl font-bold text-gray-400" >Error: {error}</div>; // Show error message if there was a problem fetching data
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h2 className="text-3xl font-bold">Discover Stories</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Explore a world of unique stories from talented writers around the globe. Find your next favorite story here.
      </p>

      {stories.length === 0 ? (
        <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-xl font-semibold">No Story to Display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.storyId} className="bg-white p-5 rounded-lg shadow-md">
              <h3
                onClick={() => handleCardClick(story.storyId)}
                className="text-xl font-semibold hover:underline cursor-pointer"
              >
                {story.title}
              </h3>
              <p className="text-gray-500 text-sm">by <span className="hover:underline cursor-pointer"> <Link to={`/user/${story.author}`}>{story.author}</Link></span></p>
              <p className="text-gray-600 mt-2">
                {story.description.length > 200
                  ? `${story.description.substring(0, 200)}...`
                  : story.description}
              </p>
              <div className="mt-4 flex items-center text-gray-500">
                <span className="mr-2">❤️</span>
                <span>{story.likes}</span>
                {/* Like Button */}
                <button
                  onClick={() => handleLike(story.storyId)}
                  className={`ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                    likedStories.includes(story.storyId) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={likedStories.includes(story.storyId)} // Disable the button if already liked
                >
                  {likedStories.includes(story.storyId) ? "Liked" : "Like"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default StoryCard;