// import React from 'react'
// import NavbarStory from './navbar_story'
// import { useParams } from 'react-router-dom'

// const handleSave = () => {
//     alert('Saved')
// }

// const Edit = (story) => {

//   const {storyid} = useParams()
// //   Here we have to fetch the story with the id from the database
//   return (
//     <>
//     <NavbarStory />
//         <div className='flex justify-center'>
//             <div className='w-full m-[10%]'>
//             <div className='flex justify-between'>
//                 <h1 className='text-2xl font-bold'>Edit</h1>
//                 <button onClick={handleSave} className='bg-blue-500 cursor-pointer hover:bg-red-400 text-white px-3 py-1 rounded'>Save</button>
//             </div>
//             <div className='border border-gray-300 p-2 mt-2'>
//                 <input type='text' className='w-full hover:border hover:border-gray-500 cursor-text p-1 ' placeholder='Title' value={story.title}/>
//                 <textarea className='w-full hover:border hover:border-gray-500 cursor-text  p-1 mt-2' placeholder='Description' value={story.description}></textarea>
//                 <textarea className='w-full hover:border hover:border-gray-500 cursor-text   p-1 mt-2' placeholder='Content' value={story.content}></textarea>
//             </div>
//             </div>
//         </div>
//     </>
//   )
// }

// export default Edit
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavbarStory from './navbar_story';

const Edit = () => {
  const { storyid } = useParams();
  const [story, setStory] = useState({
    title: '',
    description: '',
    content: ''
  });

  // Fetch the story from the backend based on storyid
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stories/${storyid}`);
        if (response.ok) {
          const data = await response.json();
          setStory({
            title: data.title,
            description: data.description,
            content: data.content
          });
        } else {
          console.error('Story not found');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyid]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/edit-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: story.title,
          description: story.description,
          content: story.content,
          username: localStorage.getItem('username'),
          storyId: storyid,
        }),
      });

      const data = await response.json();
      if (data.message === 'Story edited successfully') {
        alert('Story updated successfully');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving the story:', error);
    }
  };

  return (
    <>
      <NavbarStory />
      <div className="flex justify-center">
        <div className="w-full m-[10%]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Edit</h1>
            <button
              onClick={handleSave}
              className="bg-blue-500 cursor-pointer hover:bg-red-400 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
          <div className="border border-gray-300 p-2 mt-2">
            <input
              type="text"
              className="w-full hover:border hover:border-gray-500 cursor-text p-1"
              placeholder="Title"
              value={story.title}
              onChange={(e) => setStory({ ...story, title: e.target.value })}
            />
            <textarea
              className="w-full hover:border hover:border-gray-500 cursor-text p-1 mt-2"
              placeholder="Description"
              value={story.description}
              onChange={(e) => setStory({ ...story, description: e.target.value })}
            ></textarea>
            <textarea
              className="w-full hover:border hover:border-gray-500 cursor-text p-1 mt-2"
              placeholder="Content"
              value={story.content}
              onChange={(e) => setStory({ ...story, content: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;