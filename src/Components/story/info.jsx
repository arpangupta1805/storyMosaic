// import React from "react";
// import NavbarStory from "./navbar_story";

// const InfoSection = (author, member) => {
//   const members = [
//     { name: "Alex Kumar", username: "alex.kumar", role: "Author", stories: 12 },
//     { name: "Sarah Chen", username: "sarah.chen", role: "Editor", stories: 8 },
//     { name: "James Mitchell", username: "james.mitchell", role: "Author", stories: 15 },
//     { name: "Maria Garcia", username: "maria.garcia", role: "Author", stories: 6 },
//     { name: "Alex Kumar", username: "alex.kumar", role: "Author", stories: 12 },
//     { name: "Sarah Chen", username: "sarah.chen", role: "Editor", stories: 8 },
//     { name: "James Mitchell", username: "james.mitchell", role: "Author", stories: 15 },
//     { name: "Maria Garcia", username: "maria.garcia", role: "Author", stories: 6 },
//   ];

//   return (
//     <>
//     <NavbarStory />
//     <div className="mx-[10%] my-[5%] p-6 bg-white rounded-lg shadow-lg">
      
//       {/* Profile Section */}
//       <div className="items-center space-x-4">
//       <h3 className="my-2 text-xl font-semibold">Author</h3>
//         <div className="">
//           <h2 className="text-xl font-bold">{author.name}Arpan Gupta</h2>
//           <p className="text-gray-500 hover:underline cursor-pointer">@{author.username}arpan5218</p>
//         </div>
//       </div>

//       {/* Community Members */}
//       <h3 className="mt-6 text-xl font-semibold">Editors</h3>
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//         {members.map((member, index) => (
//           <div
//             key={index}
//             className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4 hover:drop-shadow-lg"
//           >
//             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
//               {member.name.charAt(0)}
//             </div>
//             <div>
//               <h4 className="font-semibold ">{member.name}</h4>
//               <p className="text-gray-500 hover:underline cursor-pointer">@{member.username}</p>
//               <p className="text-gray-400 text-sm">
//                 {member.role} &bull; {member.stories} stories
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// };

// export default InfoSection;

import React, { useState, useEffect } from "react";
import NavbarStory from "./navbar_story";
import { useNavigate, useParams } from "react-router-dom";



const InfoSection = () => {
  const { storyid } = useParams();  // Get the storyId from the URL params
  const [story, setStory] = useState(null);  // State to store story details
  const [members, setMembers] = useState([]);  // State to store editors
  const navigate = useNavigate();  // Initialize navigate hook

  // Fetch the story data based on storyId
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stories/${storyid}`);
        const data = await response.json();
        members = data.editors;

        if (data) {
          setStory(data);  // Store the story data
          setMembers(data.editors);  // Store the editors
        } else {
          console.error("Story data not found.");
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
      }
    };

    fetchStory();
  }, [storyid]);  // Re-run the effect when the storyId changes

  const handleUsernameClick = (username) => {
    navigate(`/user/${username}`);  // Navigate to the user's dashboard
  };

  if (!story) return <div>Loading...</div>;  // Show loading until the story data is fetched

  const addEditor = () => {
    // Add a new editor to the story
    const newEditor = prompt("Enter the username of the editor to add:");
    if (newEditor) {
      setMembers([...members, newEditor]);
      const response = fetch(`http://localhost:3000/api/add-editor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          storyId: storyid,
          username: newEditor,
          author: story.author,
        }),
      });
    }
  }

  return (
    <>
      <NavbarStory />
      <div className="mx-[10%] my-[5%] p-6 bg-white rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="items-center space-x-4">
          <h3 className="my-2 text-xl font-semibold">Author</h3>
          <div className="">
            <h2 className="text-xl font-bold">{story.title}</h2>
            <p
              className="text-gray-500 hover:underline cursor-pointer"
              onClick={() => handleUsernameClick(story.author)}  // Redirect to author's dashboard
            >
              @{story.author}
            </p>
          </div>
        </div>
        <br></br>
        <br></br>
        <button onClick={()=>addEditor()} className="p-4 bg-blue-600 text-white py-2 rounded-md mt-6 cursor-pointer hover:bg-blue-500 transition-all duration-300">Add Editor</button>
        {/* Community Members (Editors) */}
        <h3 className="mt-6 text-xl font-semibold">Editors</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4 hover:drop-shadow-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
                {member.charAt(0)}  {/* First letter of member's name */}
              </div>
              <div>
                <h4 className="font-semibold ">{member}</h4>
                <p
                  className="text-gray-500 hover:underline cursor-pointer"
                  onClick={() => handleUsernameClick(member)}  // Redirect to editor's dashboard
                >
                  @{member}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfoSection;