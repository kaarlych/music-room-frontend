import React, { useState } from 'react';

function AddSongForm({ onAddSong }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Basic YouTube URL validation
    if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    onAddSong(url);
    setUrl('');
    setError('');
  };

  return (
    <div className="add-song-form">
      <h2>Add a Song</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here"
          />
          <button type="submit">Add to Queue</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default AddSongForm;