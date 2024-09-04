import React, { useState } from 'react';
import YouTubePreview from './components/YouTubePreview';
import KeywordSearch from './components/KeywordSearch';
import SearchResults from './components/SearchResults';

const YouTubeInput = ({ onTranscribe }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setYoutubeUrl(e.target.value);
    setError('');
  };

  const handleTranscribe = () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }
    onTranscribe(youtubeUrl);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={youtubeUrl}
        onChange={handleInputChange}
        placeholder="Enter YouTube URL"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleTranscribe}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Transcribe
      </button>
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [videoId, setVideoId] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleTranscribe = async (url) => {
    setYoutubeUrl(url);
    setIsTranscribing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe video');
      }

      setVideoId(data.video_id);
      setTranscriptionComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSearch = async (keyword) => {
    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_id: videoId, keyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search transcription');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Search App</h1>
      <YouTubeInput onTranscribe={handleTranscribe} />
      {youtubeUrl && <YouTubePreview url={youtubeUrl} />}
      {isTranscribing && (
        <div className="mt-4 p-2 bg-blue-100 text-blue-700 rounded">
          Transcribing video...
        </div>
      )}
      {isSearching && (
        <div className="mt-4 p-2 bg-blue-100 text-blue-700 rounded">
          Searching...
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {transcriptionComplete && (
        <>
          <div className="mt-4 mb-4 p-2 bg-green-100 text-green-700 rounded">
            Transcription complete! You can now search for keywords.
          </div>
          <KeywordSearch onSearch={handleSearch} />
          <SearchResults results={searchResults} />
        </>
      )}
    </div>
  );
};

export default App;