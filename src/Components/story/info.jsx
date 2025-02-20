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

  const addEditor = async () => {
    const newEditor = prompt("Enter the username of the editor to add:");
    if (newEditor) {
      try {
        // Step 1: Check if the username exists
        const checkResponse = await fetch(`http://localhost:3000/api/check-username?username=${newEditor}`);
        const checkResult = await checkResponse.json();
  
        if (!checkResult.exists) {
          alert("Error: No such username exists!");
          return; // Stop execution if username does not exist
        }
  
        // Step 2: If user exists, proceed to add as editor
        const response = await fetch(`http://localhost:3000/api/add-editor`, {
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
  
        const result = await response.json();
        console.log("Server Response:", result.message);
  
        if (response.ok) {
          setMembers([...members, newEditor]); // Update state only if successful
          alert(result.message);
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        console.error("Error adding editor:", error);
        alert("Failed to add editor. Try again.");
      }
    }
  };
  

  const handleDeleteEditor = async (username) => { 
    const confirmDelete = window.confirm(`Are you sure you want to remove @${username} as an editor?`);
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/remove-editor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          storyId: storyid,
          username: username,
          author: story.name,
        }),
      });
  
      const result = await response.json();
      console.log("Server Response:", result.message);
  
      if (response.ok) {
        setMembers(members.filter(member => member !== username)); // Update state
        alert(result.message);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error removing editor:", error);
      alert("Failed to remove editor. Try again.");
    }
  };
  

  return (
    <>
      <NavbarStory />
      <div className="mx-[10%] my-[5%] p-6 bg-white rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="items-center space-x-4">
          <h3 className="my-2 text-xl font-semibold"><span className="">Author</span><span className="text-gray-500"> @</span><span
              className="text-gray-500 hover:underline cursor-pointer"
              onClick={() => handleUsernameClick(story.author)}  // Redirect to author's dashboard
            >
              {story.author}
            </span></h3>
          <div className="">
            <h2 className="text-xl font-bold"><span className="font-bold">Title</span><span className="text-gray-500 font-normal">&nbsp;&nbsp;{story.title}</span></h2>
            
          </div>
        </div>
        {/* Community Members (Editors) */}
        <div className="rounded-xl p-4 bg-gray-100 mt-6">
        <h3 className="text-xl font-semibold underline">Editors</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="p-4 bg-white border rounded-lg shadow-sm flex items-center space-x-4 hover:drop-shadow-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
                {member.charAt(0)}  {/* First letter of member's name */}
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                <h4 className="font-semibold ">{member}</h4>
                <p
                  className="text-gray-500 hover:underline cursor-pointer"
                  onClick={() => handleUsernameClick(member)}  // Redirect to editor's dashboard
                >
                  @{member}
                </p>
                </div>
                <div onClick={() => handleDeleteEditor(member)} className="text-red-500 text-4xl cursor-pointer">-</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        <button onClick={()=>addEditor()} className="p-4 bg-blue-600 text-white py-2 rounded-md mt-6 cursor-pointer hover:bg-blue-500 transition-all duration-300">Add Editor</button>
      </div>
    </>
  );
};

export default InfoSection;