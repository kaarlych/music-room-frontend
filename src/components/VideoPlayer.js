import React from 'react';

function VideoPlayer({ videoId, onEnded }) {
  if (!videoId) return null;

  // Extract video ID from YouTube URL if needed
  const getYouTubeId = (url) => {
    if (url.length === 11) return url; // Already an ID

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  };

  const id = getYouTubeId(videoId);

  return (
    <div className="video-player">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onEnded={onEnded}
      ></iframe>
    </div>
  );
}

export default VideoPlayer;