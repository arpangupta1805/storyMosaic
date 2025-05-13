import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarStory from './navbar_story';
import './compare.css';

const Compare = () => {
  const { storyId, pullRequestId } = useParams();
  const navigate = useNavigate();
  const [originalStory, setOriginalStory] = useState(null);
  const [pullRequest, setPullRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user
        const username = localStorage.getItem('username');
        if (!username) {
          setError('You need to be logged in to view this page');
          return;
        }

        console.log(`Fetching data for storyId: ${storyId}, pullRequestId: ${pullRequestId}`);

        // Fetch the original story
        const storyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${storyId}`);
        if (!storyResponse.ok) {
          const errorData = await storyResponse.json();
          console.error(`Error fetching story: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.message || 'Failed to fetch original story');
        }
        const storyData = await storyResponse.json();
        console.log(`Successfully fetched story: ${storyData.title}`);
        setOriginalStory(storyData);
        
        // Check if user is the author
        const isUserAuthor = username === storyData.author;
        console.log(`User ${username} is ${isUserAuthor ? '' : 'not '}the author of the story`);
        setIsAuthor(isUserAuthor);

        // Fetch the pull request
        const prResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pull-request/${pullRequestId}`);
        if (!prResponse.ok) {
          const errorData = await prResponse.json();
          console.error(`Error fetching pull request: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.message || 'Failed to fetch pull request');
        }
        const prData = await prResponse.json();
        console.log(`Successfully fetched pull request: ${prData.pullRequestId}`);
        setPullRequest(prData);
        
        // Log success for debugging
        console.log('Successfully fetched story and pull request data');
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId, pullRequestId]);

  const handleAccept = async () => {
    if (!isAuthor) {
      alert('Only the author can accept pull requests');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token) {
        alert('You need to be logged in to accept pull requests');
        return;
      }

      console.log(`Accepting pull request: ${pullRequestId} for story: ${storyId} by user: ${username}`);

      // Show loading state
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-pull-request-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pullRequestId,
          status: 'accepted',
          username,
        }),
      });

      const data = await response.json();
      console.log(`Response from accepting pull request: ${JSON.stringify(data)}`);
      
      if (response.ok) {
        alert(data.message || 'Pull request accepted successfully');
        // Redirect to the author's dashboard instead of the story page
        navigate(`/user/${username}`);
      } else {
        alert(`Error: ${data.message || 'Failed to accept pull request'}`);
        console.error('Error accepting pull request:', data);
      }
    } catch (error) {
      console.error('Error accepting pull request:', error);
      alert(`Failed to accept pull request: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!isAuthor) {
      alert('Only the author can reject pull requests');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token) {
        alert('You need to be logged in to reject pull requests');
        return;
      }

      console.log(`Rejecting pull request: ${pullRequestId} for story: ${storyId} by user: ${username}`);

      // Show loading state
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-pull-request-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pullRequestId,
          status: 'rejected',
          username,
        }),
      });

      const data = await response.json();
      console.log(`Response from rejecting pull request: ${JSON.stringify(data)}`);
      
      if (response.ok) {
        alert(data.message || 'Pull request rejected successfully');
        // Navigate back to the pull requests page
        navigate(`/request/${storyId}`);
      } else {
        alert(`Error: ${data.message || 'Failed to reject pull request'}`);
        console.error('Error rejecting pull request:', data);
      }
    } catch (error) {
      console.error('Error rejecting pull request:', error);
      alert(`Failed to reject pull request: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center py-10">
        <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we process your request</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center py-10 text-red-500">
        <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate(`/request/${storyId}`)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Requests
        </button>
      </div>
    </div>
  );
  
  if (!originalStory || !pullRequest) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center py-10">
        <svg className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p>Could not find the requested story or pull request.</p>
        <button 
          onClick={() => navigate(`/request/${storyId}`)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Requests
        </button>
      </div>
    </div>
  );

  // Helper function to create a more precise diff that only highlights changes
  const createGithubStyleDiff = (original, proposed) => {
    if (!original || !proposed) return { html: '', hasChanges: false };
    
    // Split the content into lines for line-by-line comparison
    const originalLines = original.split('\n');
    const proposedLines = proposed.split('\n');
    
    let diffHtml = '';
    let hasChanges = false;
    
    // Process each line
    const maxLines = Math.max(originalLines.length, proposedLines.length);
    for (let i = 0; i < maxLines; i++) {
      const originalLine = i < originalLines.length ? originalLines[i] : '';
      const proposedLine = i < proposedLines.length ? proposedLines[i] : '';
      
      if (originalLine === proposedLine) {
        // Unchanged line - display as is
        diffHtml += `<div class="diff-line">${escapeHtml(originalLine) || '&nbsp;'}</div>`;
      } else {
        // Line was changed - we need to highlight the specific changes
        hasChanges = true;
        
        if (!originalLine && proposedLine) {
          // Entire line was added
          diffHtml += `<div class="diff-line diff-added-line"><span class="diff-added">${escapeHtml(proposedLine)}</span></div>`;
        } else if (originalLine && !proposedLine) {
          // Entire line was removed
          diffHtml += `<div class="diff-line diff-removed-line"><span class="diff-removed">${escapeHtml(originalLine)}</span></div>`;
        } else {
          // Line was modified - find word-level changes
          const wordDiff = highlightWordChanges(originalLine, proposedLine);
          diffHtml += `<div class="diff-line diff-modified-line">${wordDiff}</div>`;
        }
      }
    }
    
    return { html: diffHtml, hasChanges };
  };

  // Function to highlight word-level changes between two lines
  const highlightWordChanges = (originalLine, proposedLine) => {
    // Split the lines into words
    const originalWords = originalLine.split(/(\s+|\b)/);
    const proposedWords = proposedLine.split(/(\s+|\b)/);
    
    let result = '';
    let i = 0; // pointer for originalWords
    let j = 0; // pointer for proposedWords
    
    // Find common prefix length
    while (i < originalWords.length && j < proposedWords.length && originalWords[i] === proposedWords[j]) {
      result += escapeHtml(originalWords[i]);
      i++;
      j++;
    }
    
    // Handle the differing middle part
    let tailOriginalIndex = originalWords.length - 1;
    let tailProposedIndex = proposedWords.length - 1;
    
    // Find common suffix length by working backwards
    while (
      tailOriginalIndex >= i && 
      tailProposedIndex >= j && 
      originalWords[tailOriginalIndex] === proposedWords[tailProposedIndex]
    ) {
      tailOriginalIndex--;
      tailProposedIndex--;
    }
    
    // Mark the removed words from original
    let removedHtml = '';
    for (let k = i; k <= tailOriginalIndex; k++) {
      removedHtml += escapeHtml(originalWords[k]);
    }
    if (removedHtml) {
      result += `<span class="diff-removed">${removedHtml}</span>`;
    }
    
    // Mark the added words from proposed
    let addedHtml = '';
    for (let k = j; k <= tailProposedIndex; k++) {
      addedHtml += escapeHtml(proposedWords[k]);
    }
    if (addedHtml) {
      result += `<span class="diff-added">${addedHtml}</span>`;
    }
    
    // Add the common suffix
    for (let k = tailOriginalIndex + 1; k < originalWords.length; k++) {
      result += escapeHtml(originalWords[k]);
    }
    
    return result;
  };

  // Helper function to escape HTML special characters
  const escapeHtml = (text) => {
    if (typeof text !== 'string') return '';
    
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <>
      <NavbarStory />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Compare Changes</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/request/${storyId}`)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back to Requests
            </button>
            {isAuthor && (
              <>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Reject'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pull Request Details</h2>
          <p><span className="font-medium">From:</span> {pullRequest.from}</p>
          <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs ${
            pullRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            pullRequest.status === 'accepted' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>{pullRequest.status}</span></p>
          <p><span className="font-medium">Comment:</span> {pullRequest.comment}</p>
        </div>

        {/* Title Diff */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Title Changes</h2>
          {originalStory.title === pullRequest.proposedChanges?.title ? (
            <p className="text-gray-500 italic">No changes to the title</p>
          ) : (
            <div className="diff-container">
              {(() => {
                const { html, hasChanges } = createGithubStyleDiff(
                  originalStory.title,
                  pullRequest.proposedChanges?.title
                );
                return hasChanges ? (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <p className="text-gray-500 italic">No changes detected in title</p>
                );
              })()}
            </div>
          )}
        </div>

        {/* Description Diff */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Description Changes</h2>
          {originalStory.description === pullRequest.proposedChanges?.description ? (
            <p className="text-gray-500 italic">No changes to the description</p>
          ) : (
            <div className="diff-container">
              {(() => {
                const { html, hasChanges } = createGithubStyleDiff(
                  originalStory.description,
                  pullRequest.proposedChanges?.description
                );
                return hasChanges ? (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <p className="text-gray-500 italic">No changes detected in description</p>
                );
              })()}
            </div>
          )}
        </div>

        {/* Content Diff */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Content Changes</h2>
          {originalStory.content === pullRequest.proposedChanges?.content ? (
            <p className="text-gray-500 italic">No changes to the content</p>
          ) : (
            <div className="diff-container">
              {(() => {
                const { html, hasChanges } = createGithubStyleDiff(
                  originalStory.content,
                  pullRequest.proposedChanges?.content
                );
                return hasChanges ? (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <p className="text-gray-500 italic">No changes detected in content</p>
                );
              })()}
            </div>
          )}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">How to read the diff:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="diff-removed px-2 py-1">Red highlighted text</span> has been removed</li>
              <li><span className="diff-added px-2 py-1">Green highlighted text</span> has been added</li>
              <li>Unchanged text remains with no highlight</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compare;
