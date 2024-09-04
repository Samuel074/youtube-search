import React, { useState, useEffect } from 'react';

const YouTubePreview = ({ url }) => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Extract video ID from YouTube URL
    const extractVideoId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const id = extractVideoId(url);
    setVideoId(id);
  }, [url]);

  if (!videoId) {
    return <div className="text-red-500">Invalid YouTube URL</div>;
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default YouTubePreview;