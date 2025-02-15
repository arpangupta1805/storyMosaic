import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const FictionCardFiction = () => {
  const { storyid } = useParams();  // This will get the storyId from the URL
  const [fictions, setFictions] = useState([]);
  const navigate = useNavigate();

  // Fetch fanfictions based on the storyId
  useEffect(() => {
    const fetchFictions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/fan-fiction/${storyid}`);
        const data = await response.json();
        
        console.log("Fetched fan fictions:", data); // Debugging step
  
        if (Array.isArray(data)) {
          setFictions(data);
        } else {
          setFictions([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching fanfictions:", error);
        setFictions([]); // Ensure it's always an array
      }
    };
  
    fetchFictions();
  }, [storyid]);
  
  const handleCardClick = (storyId) => {
    navigate(`/story/${storyId}`); // Navigate to the fanfiction details page
  };

  const createFanFiction = () => {
    navigate(`/create-fanfiction/${storyid}`); // Navigate to the create fanfiction page
  };

  return (
    <>
      <button className='bg-blue-600 rounded-l p-4 mx-10' onClick={createFanFiction}>Create Fan Fiction</button>
      <div className="bg-gray-100 min-h-screen p-10">
        <h2 className="text-3xl font-bold">Fanfictions</h2>
        {fictions.length === 0 ? (
          <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-xl font-semibold">No Fan Fictions to Display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fictions.map((fiction) => (
              <div key={fiction._id} className="bg-white p-5 rounded-lg shadow-md">
                <h3
                  onClick={() => handleCardClick(fiction.storyId)}
                  className="text-xl font-semibold hover:underline cursor-pointer"
                >
                  {fiction.title}
                </h3>
                <p className="text-gray-500 text-sm">by <span className="hover:underline cursor-pointer"> <Link to={`/user/${fiction.author}`}>{fiction.author}</Link></span></p>
                <p className="text-gray-600 mt-2">
                  {fiction.description.length > 200
                    ? `${fiction.description.substring(0, 200)}...`
                    : fiction.description}
                </p>
                <div className="mt-4 flex items-center text-gray-500">
                  <span className="mr-2">❤️</span> {fiction.likes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FictionCardFiction;
