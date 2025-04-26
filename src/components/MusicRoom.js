import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import SongQueue from './SongQueue';
import UserList from './UserList';
import AddSongForm from './AddSongForm';

function MusicRoom({ user }) {
  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to WebSocket
    const socket = new WebSocket(`ws://localhost:8080/ws/room?token=${user.token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'QUEUE_UPDATE':
          setQueue(data.queue);
          break;
        case 'CURRENT_SONG':
          setCurrentSong(data.song);
          break;
        case 'USERS_UPDATE':
          setUsers(data.users);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    // Fetch initial room data
    fetchRoomData();

    return () => {
      socket.close();
    };
  }, [user]);

  const fetchRoomData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/room', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQueue(data.queue);
        setCurrentSong(data.currentSong);
        setUsers(data.users);
      } else {
        console.error('Failed to fetch room data');
      }
    } catch (err) {
      console.error('Error fetching room data:', err);
    }
  };

  const addSong = async (youtubeUrl) => {
    try {
      const response = await fetch('http://localhost:8080/api/room/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ url: youtubeUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add song:', errorData.message);
      }
    } catch (err) {
      console.error('Error adding song:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handleSongEnd = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'SONG_ENDED' }));
    }
  };

  return (
    <div className="music-room">
      <header className="room-header">
        <h1>Music Room</h1>
        <div className="user-info">
          <span>Logged in as: {user.username}</span>
          <button onClick={handleLogout} className="logout-button">Leave Room</button>
        </div>
      </header>

      <div className="room-content">
        <main className="player-section">
          {currentSong ? (
            <VideoPlayer videoId={currentSong.videoId} onEnded={handleSongEnd} />
          ) : (
            <div className="empty-player">
              <p>No song is currently playing</p>
            </div>
          )}

          <AddSongForm onAddSong={addSong} />

          <div className="queue-section">
            <h2>Song Queue</h2>
            <SongQueue queue={queue} currentSong={currentSong} user={user} />
          </div>
        </main>

        <aside className="users-section">
          <UserList users={users} />
        </aside>
      </div>

      {!connected && (
        <div className="connection-error">
          <p>Disconnected from server. Trying to reconnect...</p>
        </div>
      )}
    </div>
  );
}

export default MusicRoom;