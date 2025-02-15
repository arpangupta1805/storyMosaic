// import React from "react";


// const handlecard = (key) => {

// }

// const fictionCardfiction = () => {
//   // here we have to fetch top 12 fictions from the database
//   // data = await fetch('http://localhost:5000/api/v1/fictions')
//   // topfictions = data.slice(0, 12)
  
//   // const [fictions, setfictions] = useState(topfictions)
//   const fictions = []

//   return (
//     <>
//     <div className="bg-gray-100 min-h-screen p-10">
//       <h2 className="text-3xl font-bold">Fanfictions</h2>
//       {fictions.length === 0 ? (
//         <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
//           <p className="text-gray-500 text-xl font-semibold">No Fan Fictions to Display</p>
//         </div>
//       ) : (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {fictions.map((fiction, index) => (
//           <div key={index} className="bg-white p-5 rounded-lg shadow-md">
//             <h3 onClick={handlecard(fiction.fictionId)} className="text-xl font-semibold hover:underline cursor-pointer">{fiction.title}</h3>
//             <p className="text-gray-500 text-sm">by {fiction.author}</p>
//             <p className="text-gray-600 mt-2">
//                 {fiction.description.length > 200
//                   ? `${fiction.description.substring(0, 200)}...`
//                   : fiction.description}
//               </p>
//             <div className="mt-4 flex items-center text-gray-500">
//               <span className="mr-2">❤️</span> {fiction.likes}
//             </div>
//           </div>
//         ))}
//       </div>
//       )}
//     </div>

//     </>
//   );
// };

// export default fictionCardfiction;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FictionCardFiction = () => {
  const { storyId } = useParams();  // This will get the storyId from the URL
  const [fictions, setFictions] = useState([]);
  const navigate = useNavigate();

  // Fetch fanfictions based on the storyId
  useEffect(() => {
    const fetchFictions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/fan-fiction/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setFictions(data);
        } else {
          console.error("No fanfictions found.");
        }
      } catch (error) {
        console.error("Error fetching fanfictions:", error);
      }
    };

    fetchFictions();
  }, [storyId]);  // Dependency on storyId, so it re-fetches when storyId changes

  const handleCardClick = (fictionId) => {
    navigate(`/fanfiction/${fictionId}`); // Navigate to the fanfiction details page
  };

  return (
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
                onClick={() => handleCardClick(fiction.fictionId)}
                className="text-xl font-semibold hover:underline cursor-pointer"
              >
                {fiction.title}
              </h3>
              <p className="text-gray-500 text-sm">by {fiction.author}</p>
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
  );
};

export default FictionCardFiction;