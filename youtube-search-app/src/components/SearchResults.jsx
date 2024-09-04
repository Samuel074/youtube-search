import React from 'react';

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <div className="text-gray-500">No results found.</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Search Results</h2>
      <ul className="divide-y divide-gray-200">
        {results.map((result, index) => (
          <li key={index} className="py-2">
            <div className="flex justify-between">
              <span className="font-medium">{result.timeframe}</span>
              <a
                href={result.ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch
              </a>
            </div>
            <p className="text-gray-600">{result.sentence}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;