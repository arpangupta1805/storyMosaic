// import React from 'react'
// import { useState } from "react";
// import { useParams } from 'react-router-dom'
// import Navbaar from './Navbaar';

// export default function StoryReader({title, description, likes, author, content, date}) {
//   const [theme, setTheme] = useState("light");
//   const {storyid} = useParams()
//   return (
//     <>
    
//     {/* we have to fetch these thing from this storyid title, description, likes, author, content, date */}
//     <div className={`min-h-screen px-8 transition-colors duration-300 ${
//       theme === "dark" ? "bg-gray-900 text-gray-300" : theme === "warm" ? "bg-[#fed7729e] text-gray-900" : "bg-gray-100 text-gray-900"
//     }`}>
//       <div className="mx-[10%]">
//         {/* Theme Toggle */}
//         <div className="flex justify-end">
//           <div className="relative ">
//             <div className="absolute flex right-0 my-2 shadow-md rounded-md z-10">
//               <button onClick={() => setTheme("light")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Light</button>
//               <button onClick={() => setTheme("dark")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Dark</button>
//               <button onClick={() => setTheme("warm")} className="block px-4 py-2 hover:underline cursor-pointer w-full">Warm</button>
//             </div>
//           </div>
//         </div>
        
//         {/* Story Header */}
//         <h1 className="text-3xl font-bold my-4 py-4">{title}</h1>
//         <div className="flex justify-between items-center gap-2 mt-2">
//           <div>
//             <p className="font-semibold my-2"><span className='font-light'>by </span><span className='hover:underline cursor-pointer '>{author}</span></p>
//             <p className="text-gray-500 text-sm">{date} Feb 14, 2025</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-lg">❤️</span>
//             <span>{likes}</span>
//           </div>
//         </div>

//         {/* Story Content */}
//         <p className="mt-4 text-lg">{description}</p>
//         <div className={`mt-6 p-4 rounded-md ${theme === "dark" ? "bg-gray-800 text-gray-100" : theme === "warm" ? "bg-[#fed7729e] text-gray-900" : "bg-white text-gray-900"}`}>
        
//           <p className='mb-3'>{content}</p>
//         </div>
        
//       </div>
//     </div>
//     </>
//   );
// }
// import React from "react";
// import { useNavigate } from "react-router-dom";


// const StoryCarddash = (storie) => {

//     const navigate = useNavigate();
//   // data = await fetch('http://localhost:5000/api/v1/stories')
//   // topstories = data.slice(0, 12)
  
//   // const [stories, setstories] = useState(topstories)
//   const stories = []
//     const handlecard = (key) => {
//         navigate(`/story/${key}`);
//     }
//   return (
//     <>
//     <div className="bg-gray-100 min-h-screen p-10">
//       <h2 className="text-3xl font-bold">Stories</h2>
//       <p className="text-gray-600 mt-2 mb-6">
//         Explore a world of unique stories from talented writers around the globe. Find your next favorite story here.
//       </p>

//       {stories.length === 0 ? (
//         <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
//           <p className="text-gray-500 text-xl font-semibold">No Story to Display</p>
//         </div>
//       ) : (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stories.map((story) => (
//           <div key={story.key} className="bg-white p-5 rounded-lg shadow-md">
//             <h3 onClick={() => handlecard(story.key)} className="text-xl font-semibold hover:underline cursor-pointer">{story.title}</h3>
//             <p className="text-gray-500 text-sm">by {story.author}</p>
//             <p className="text-gray-600 mt-2">
//                 {story.description.length > 200
//                   ? `${story.description.substring(0, 200)}...`
//                   : story.description}
//               </p>
//             <div className="mt-4 flex items-center text-gray-500">
//               <span className="mr-2">❤️</span> {story.likes}
//             </div>
//           </div>
//         ))}
//       </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default StoryCarddash;
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export default function StoryReader() {
  const { storyid } = useParams();  // Get storyId from URL
  const [story, setStory] = useState(null);  // State to store fetched story data
  const [theme, setTheme] = useState("light");

  // Fetch story data based on the storyId
  useEffect(() => {
    const fetchStory = async () => {
      try {
        console.log(storyid)
        const response = await fetch(`http://localhost:3000/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);  // Store the story data
        } else {
          console.error("Story not found");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchStory();  // Call fetchStory when the component mounts or the storyId changes
  }, [storyid]);

  // If no story is found, return a loading message or error
  if (!story) {
    return <div>Loading...</div>;
  }

  // Destructure story details for easier access
  const { title, description, likes, author, content, date } = story;

  return (
    <>
      <div className={`min-h-screen px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : theme === "warm" ? "bg-[#fed7729e] text-gray-900" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="mx-[10%]">
          {/* Theme Toggle */}
          <div className="flex justify-end">
            <div className="relative ">
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
              <p className="font-semibold my-2"><span className='font-light'>by </span><span className='hover:underline cursor-pointer'>{author}</span></p>
              <p className="text-gray-500 text-sm">{date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">❤️</span>
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