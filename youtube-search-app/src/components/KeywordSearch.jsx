import React, { useState } from 'react';

const KeywordSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    setError('');
  };

  const handleSearch = () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }
    onSearch(keyword);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={keyword}
        onChange={handleInputChange}
        placeholder="Enter keyword"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSearch}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Search
      </button>
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default KeywordSearch;