import React from 'react'
import { Link } from 'react-router-dom'

const Errorpage = () => {
  return (
    <div className='flex flex-col items-center h-screen space-y-4'>
        <div className='text-center border-b-2 border-gray-200 pb-4'>
            <h1 className='text-gray-400 font-bold text-4xl'>404</h1>
            <h3>Page Not Found</h3>
        </div>
        <div className='w-[20%] text-center my-4'>
            But if you don't change your direction, and if you keep looking, you may end up where you are heading.
        </div>
        <Link to='/'><button className='border-1 rounded-4xl py-2 px-4 cursor-pointer hover:border-violet-800 hover:text-violet-800'><span className='text-md '>Take me to home</span></button></Link>
    </div>
  )
}

export default Errorpage
