import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'


const NavbarStory = () => {
  const {storyid} = useParams()
  return (
    <nav className='bg-gray-100 m-2'>
      <ul className='flex text-lg font-light'>
        <li className='hover:underline cursor-pointer bordr-r w-[16.6%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/read`}><div className='w-full'>Read</div></NavLink></li>
        <li className='hover:underline cursor-pointer bordr-r w-[16.6%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/edit`}><div className='w-full'>Edit</div></NavLink></li>
        <li className='hover:underline cursor-pointer bordr-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/request`}><div className='w-full'>Request</div></NavLink></li>
        <li className='hover:underline cursor-pointer borer-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/fanfictions`}><div className='w-full'>Fanfictions</div></NavLink></li>
        <li className='hover:underline cursor-pointer boder-r w-[16.7%] hover:bg-gray-200 text-center py-2'><NavLink className={(e)=>{return e.isActive?"font-bold underline font-mono font-stretch-150%":""}} to={`/story/${storyid}/info`}><div className='w-full'>Info</div></NavLink></li>
        <li className='cursor-pointer w-[16.7%] hover:bg-red-400 hover:text-white text-center py-2'>Delete</li>
      </ul>
    </nav>
  )
}

export default NavbarStory
