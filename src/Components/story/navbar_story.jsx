import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'


const NavbarStory = () => {
  const {storyid} = useParams()
  const deleteStory = () => {
    let ask = confirm('Are you sure you want to delete this story?')
    if (ask){
    fetch(`http://localhost:3000/api/delete-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ storyId: storyid }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Story deleted successfully');
          window.location.href = '/';
          // <Link to='/'/>
        } else {
          alert('Failed to delete story');
        }
      })
      .catch((error) => {
        console.error('Error deleting story:', error);
      });
    }
  }
  return (
    <nav className='bg-gray-100 m-2'>
      <ul className='flex text-lg font-light'>
        <li className='hover:underline cursor-pointer bordr-r w-[16.6%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/read`}><div className='w-full'>Read</div></NavLink></li>
        <li className='hover:underline cursor-pointer bordr-r w-[16.6%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/edit`}><div className='w-full'>Edit</div></NavLink></li>
        <li className='hover:underline cursor-pointer bordr-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/request`}><div className='w-full'>Request</div></NavLink></li>
        <li className='hover:underline cursor-pointer borer-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/fanfictions`}><div className='w-full'>Fanfictions</div></NavLink></li>
        <li className='hover:underline cursor-pointer boder-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/info`}><div className='w-full'>Info</div></NavLink></li>
        <li className='cursor-pointer w-[16.7%] hover:bg-red-400 hover:text-white text-center py-2' onClick={() => deleteStory()}>Delete</li>
      </ul>
    </nav>
  )
}

export default NavbarStory
