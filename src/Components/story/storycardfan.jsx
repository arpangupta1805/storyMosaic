import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const handleAccept = (pullRequestId) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token) {return}
  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-pull-request-status`, {
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
      alert(data.message);
      // Reload the page to reflect changes
      window.location.reload();
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
  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-pull-request-status`, {
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
      alert(data.message);
      // Reload the page to reflect changes
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error rejecting pull request:", error);
    });
};

const RequestCardFan = () => {
  const { storyId } = useParams();  // Get storyId from URL params
  const [requests, setRequests] = useState([]);
  const [story, setStory] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the original story first
    const fetchStory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setStory(data);
          
          // Check if current user is the author
          const currentUser = localStorage.getItem('username');
          setIsAuthor(data.author === currentUser);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    // Then fetch pull requests
    const fetchPullRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pull-requests/${storyId}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Error fetching pull requests:", error);
      }
    };

    fetchStory();
    fetchPullRequests();
  }, [storyId]);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h2 className="text-3xl font-bold my-2">Pull Requests</h2>
      {requests.length === 0 ? (
        <div className="flex items-center justify-center h-64 w-full bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-xl font-semibold">No pull requests to display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request.pullRequestId} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Proposed changes by <span className="text-blue-600">{request.from}</span>
                </h3>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {request.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Comment:</h4>
                <p className="text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                  {request.comment || "No comment provided"}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Proposed Changes:</h4>
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Title:</span>
                    <p className="text-gray-800">{request.proposedChanges?.title}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="text-gray-800">{request.proposedChanges?.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Content Preview:</span>
                    <p className="text-gray-800 mt-1">
                      {request.proposedChanges?.content?.substring(0, 200)}
                      {request.proposedChanges?.content?.length > 200 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <Link to={`/compare/${storyId}/${request.pullRequestId}`}>
                  <button className="border px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-100">
                    Compare Changes
                  </button>
                </Link>
                {isAuthor && (
                  <>
                    <button
                      onClick={() => handleAccept(request.pullRequestId)}
                      className="border px-4 py-2 rounded-md transition-all duration-300 hover:text-white hover:bg-green-500 bg-green-100 text-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.pullRequestId)}
                      className="border px-4 py-2 rounded-md transition-all duration-300 hover:text-white hover:bg-red-500 bg-red-100 text-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestCardFan;