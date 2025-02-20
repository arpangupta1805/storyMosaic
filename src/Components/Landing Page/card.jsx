import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';

export default function StoryReader() {
  const { storyid } = useParams(); // Get storyId from URL
  const [story, setStory] = useState(null); // State to store fetched story data
  const [liked, setLiked] = useState(false); // State to track if user liked the story
  const [theme, setTheme] = useState("light");
  const username = localStorage.getItem("username");
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
          
          // Check if the user has liked the story
          const username = localStorage.getItem("username");
          if (username && data.liked_users.includes(username)) {
            setLiked(true);
          }
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
      
      if (!username) {
        alert("You need to log in to like a story.");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/story/click-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ storyId: storyid, username }),
      });

      const result = await response.json();
      console.log("Like Response:", result.message);

      if (response.ok) {
        setLiked(result.liked);
        setStory((prev) => ({ ...prev, likes: result.likes })); // Update likes count
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error liking story:", error);
      alert("Failed to like story. Try again.");
    }
  };

  if (!story) {
    return <div>Loading...</div>;
  }

  const { title, description, likes, author, content, date } = story;

  return (
    <>
      <div className={`min-h-screen px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : theme === "warm" ? "bg-[#fed7729e] text-gray-900" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="mx-[10%]">
          {/* Theme Toggle */}
          <div className="flex justify-end">
            <div className="relative">
              <div className="absolute flex right-0 my-2 shadow-md rounded-md z-10">
                <button onClick={() => setTheme("light")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Light</button>
                <button onClick={() => setTheme("dark")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Dark</button>
                <button onClick={() => setTheme("warm")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Warm</button>
              </div>
            </div>
          </div>
          
          {/* Story Header */}
          <h1 className="text-3xl font-bold my-4 py-4">{title}</h1>
          <div className="flex justify-between items-center gap-2 mt-2">
            <div>
              <p className="font-semibold my-2"><span className='font-light'>by @</span><Link to={`/user/${username}`} className='hover:underline cursor-pointer'>{author}</Link></p>
              <p className="text-gray-500 text-sm">{date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className={`text-lg cursor-pointer ${liked ? "text-red-500" : "text-gray-500"}`}
                onClick={handleLikeClick}
              >
                ❤️
              </span>
              <span>{likes}</span>
            </div>
          </div>

          {/* Story Content */}
          <p className="mt-4 text-lg">{description}</p>
          <div className={`mt-6 p-4 rounded-md ${theme === "dark" ? "bg-gray-800 text-gray-100" : theme === "warm" ? "bg-[#fed7729e] text-gray-900" : "bg-white text-gray-900"}`}>
            <p className='mb-3'>{content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
