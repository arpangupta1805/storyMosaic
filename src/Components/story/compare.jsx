import React from 'react'
import { useParams } from 'react-router-dom'
import './compare.css'

const handleAccept = (pullRequestId) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
    if (!token) {
      console.log("User is not authenticated");
      return;
    }
  
    // Send a request to accept the pull request
    fetch("http://localhost:3000/api/change-pull-request-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Include token in headers for authentication
      },
      body: JSON.stringify({
        pullRequestId,
        status: "accepted",
        username: username,  // Replace with dynamic username if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);  // Handle response message (success or failure)
        // Update the UI or state as needed after success
      })
      .catch((error) => {
        console.error("Error accepting pull request:", error);
      });
  };
  
  const handleReject = (pullRequestId) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
    if (!token) {
      console.log("User is not authenticated");
      return;
    }
  
    // Send a request to reject the pull request
    fetch("http://localhost:3000/api/change-pull-request-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Include token in headers for authentication
      },
      body: JSON.stringify({
        pullRequestId,
        status: "rejected",
        username: username,  // Replace with dynamic username if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);  // Handle response message (success or failure)
        // Update the UI or state as needed after success
      })
      .catch((error) => {
        console.error("Error rejecting pull request:", error);
      });
  };

const Compare = () => {
    const pullRequestId = useParams().pullRequestId;
  return (
    <>
    <div className='flex justify-end gap-12 mx-8'>
      <button
                  onClick={() => handleAccept(pullRequestId)}  // Pass pullRequestId to the handler
                  className="border px-2 rounded-md py-1 transition-all duration-500 hover:text-white hover:bg-blue-400 cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(pullRequestId)}  // Pass pullRequestId to the handler
                  className="border px-2 rounded-md py-1 transition-all duration-500 hover:text-white hover:bg-red-600 cursor-pointer"
                >
                  Reject
                </button>
    </div>
    <h1>Compare</h1>
    <div>
        <h2 className='font-bold text-2xl my-2'>data.titleDiff</h2>
        <h5 className='text-xl my-1'>data.descriptionDiff</h5>
        <p className='font-light my-2'>data.contentDiff</p>
    </div>
    </>
  )
}

export default Compare
