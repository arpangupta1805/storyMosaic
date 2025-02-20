import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const handleAccept = (pullRequestId) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token) {return}
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
    })
    .catch((error) => {
      console.error("Error accepting pull request:", error);
    });
};

const handleReject = (pullRequestId) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token) {return}
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

const RequestCardFan = () => {
  const { storyId } = useParams();  // Get storyId from URL params
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pull-requests/${storyId}`);
        const data = await response.json();
        if (data) {setRequests(data);}}
      catch (error) {
        console.error("Error fetching pull requests:", error);
      }
    };
    fetchPullRequests();
  }, [storyId]);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h2 className="text-3xl font-bold my-2">Requests</h2>
      {requests.length === 0 ? (
        <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-xl font-semibold">No request to Display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request.pullRequestId} className="bg-white p-5 rounded-lg shadow-md hover:drop-shadow-xl cursor-pointer transition duration-300">
              <p className="text-gray-500 text-xl">by {request.from}</p>
              <p className="text-gray-600 mt-2">
                {request.comment.length > 200
                  ? `${request.comment.substring(0, 200)}...`
                  : request.comment}
              </p>
              <div className="flex justify-end gap-4 mt-4">
              <Link to ={`/compare/${request.pullRequestId}`}><button
                  className="border px-2 rounded-md py-1 transition-all duration-500 cursor-pointer"
                >
                  Compare
                </button></Link>
                <button
                  onClick={() => handleAccept(request.pullRequestId)}  // Pass pullRequestId to the handler
                  className="border px-2 rounded-md py-1 transition-all duration-500 hover:text-white hover:bg-blue-400 cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.pullRequestId)}  // Pass pullRequestId to the handler
                  className="border px-2 rounded-md py-1 transition-all duration-500 hover:text-white hover:bg-red-600 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestCardFan;