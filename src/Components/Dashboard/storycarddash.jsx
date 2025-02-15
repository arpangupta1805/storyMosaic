// export default StoryCarddash;
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const StoryCarddash = () => {
  const { username } = useParams(); // Get the username from the URL
  const navigate = useNavigate();
  const [stories, setStories] = useState([]); // State to store fetched stories

  // Fetch stories associated with the username
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${username}/stories`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setStories(data); // Set fetched stories in state
        } else {
          console.error("Failed to fetch stories");
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories(); // Fetch stories when the component mounts or username changes
  }, [username]);

  // Handle click on a story card to navigate to the individual story page
  const handlecard = (key) => {
    navigate(`/story/${key}`);
  };

  return (
    <>
    <Link to='/create'><button className="px-4 mx-10 bg-blue-600 text-white py-2 rounded-md mt-6">create</button></Link>
      <div className="bg-gray-100 min-h-screen p-10">
        <h2 className="text-3xl font-bold">Stories</h2>
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
                  onClick={() => handlecard(story.storyId)}
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
                  <span className="mr-2">❤️</span> {story.likes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StoryCarddash;