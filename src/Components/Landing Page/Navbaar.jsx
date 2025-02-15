// import React from 'react'
// import { Link } from 'react-router-dom'

// const Navbaar = () => {

//   return (
//     <nav className="w-full flex justify-between items-center py-4 px-4">
//         <h1 className="text-2xl font-semibold cursor-pointer text-blue-700"><Link to='/'>StoryMosaic</Link></h1>
        
//         <div className="flex items-center space-x-4 pr-4">
//         <ul className='flex space-x-4'>
//           <li className="pr-4 cursor-pointer hover:underline"><Link to='/'>Home</Link></li>
//           <li className="pr-4 cursor-pointer hover:underline"><Link to='/popular'>Popular Stories</Link></li>
//         </ul>
//           <button className="text-gray-600 pr-4 cursor-pointer hover:underline"><Link to='/authentication'>Sign In</Link></button>
//           <button className="bg-blue-700 text-white px-4 py-2 rounded-lg"><Link to='/authentication'>Sign Up</Link></button>
//         </div>
//       </nav>
//   )
// }

// export default Navbaar

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbaar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state while we check authentication

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Send request to the API to validate the token
          const response = await fetch('http://localhost:3000/api/authenticate', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });

          if (response.ok) {
            // Token is valid, decode the response (user data)
            const decoded = await response.json();
            localStorage.setItem('username', decoded.username); // Save decoded data to localStorage
            localStorage.setItem('token', token); // Save token to localStorage
            setIsAuthenticated(true); // Set the user as authenticated
          } else {
            // If the token is invalid or expired, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('decoded');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false); // No token in localStorage, user is not authenticated
      }

      setLoading(false); // Done with loading state
    };

    checkAuthentication();
  });

  const handleSignOut = () => {
    // Clear token and decoded data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('decoded');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }
  const username = localStorage.getItem('username');
  return (
    <nav className="w-full flex justify-between items-center py-4 px-4">
      <h1 className="text-2xl font-semibold cursor-pointer text-blue-700">
        <Link to="/">StoryMosaic</Link>
      </h1>

      <div className="flex items-center space-x-4 pr-4">
        <ul className="flex space-x-4">
          <li className="pr-4 cursor-pointer hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="pr-4 cursor-pointer hover:underline">
            <Link to="/popular">Popular Stories</Link>
          </li>
          {isAuthenticated ? (
            <li className="pr-4 cursor-pointer hover:underline">
              <Link to={`/user/${username}`}>Dashboard</Link>
            </li>
          ) : null}
        </ul>
        {!isAuthenticated ? (
          <>
            <button className="text-gray-600 pr-4 cursor-pointer hover:underline">
              <Link to="/authentication">Sign In</Link>
            </button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">
              <Link to="/authentication">Sign Up</Link>
            </button>
          </>
        ) : ""}
      </div>
    </nav>
  );
};

export default Navbaar;