import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StoryCarddash from './storycarddash';

const Dashboard = () => {
  const { username } = useParams();
  const [name, setName] = useState('');
  const [stories, setStories] = useState([]);

  // Fetch name and stories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${username}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data.name);
          setName(data.name); // Set the author's name
          setStories(data.stories); // Set the stories
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className='bg-gray-100'>
      <div className="items-center space-x-4">
        <div className='p-4 px-10'>
          <h2 className="text-4xl font-bold">{name}</h2> {/* Display the author's name */}
          <p className="text-gray-500 mt-2 text-xl">@{username}</p>
        </div>
      </div>

      <StoryCarddash />
    </div>
  );
};

export default Dashboard;