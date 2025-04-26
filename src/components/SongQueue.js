import React from 'react';

function SongQueue({ queue, currentSong, user }) {
  if (!queue || queue.length === 0) {
    return (
      <div className="empty-queue">
        <p>No songs in queue. Add a YouTube link to get started!</p>
      </div>
    );
  }

  return (
    <div className="song-queue">
      <ul>
        {queue.map((song, index) => (
          <li key={index} className={currentSong && currentSong.id === song.id ? 'current-song' : ''}>
            <div className="song-info">
              <span className="song-title">{song.title || song.url}</span>
              <span className="song-added-by">Added by: {song.addedBy}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongQueue;