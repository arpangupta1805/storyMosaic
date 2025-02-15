import React from 'react'
import Navbaar from './Navbaar'
import { Link } from "react-router-dom";


const LandingPage = () => {
  return (
    <>
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Main Content */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center mt-10">
        {/* Left Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold leading-tight">
            Where Stories Come <span className="text-blue-700">Alive</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Join a vibrant community of storytellers, editors, and readers. Create, collaborate, and discover stories that matter.
          </p>
          <div className="mt-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg" >
            <Link to="/popular">Explore Stories</Link>
            </button>
          </div>
        </div>

        {/* Right Section - Features */}
        <div className="w-full md:w-1/2 ml-8 mt-10 md:mt-0">
          <div className="bg-gray-100 p-6 rounded-lg space-y-4">
            {/* Writers */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <span className="text-blue-700 text-2xl">✍️</span>
              <div>
                <h3 className="font-semibold text-lg">For Writers</h3>
                <p className="text-gray-500">Craft your stories with powerful tools</p>
              </div>
            </div>

            {/* Editors */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <span className="text-blue-700 text-2xl">👥</span>
              <div>
                <h3 className="font-semibold text-lg">For Editors</h3>
                <p className="text-gray-500">Shape the next bestseller</p>
              </div>
            </div>

            {/* Readers */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <span className="text-blue-700 text-2xl">📖</span>
              <div>
                <h3 className="font-semibold text-lg">For Readers</h3>
                <p className="text-gray-500">Discover unique voices and stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default LandingPage
