import React from 'react';

function UserList({ users }) {
  if (!users || users.length === 0) {
    return (
      <div className="users-container">
        <h2>Users in Room</h2>
        <p>No users online</p>
      </div>
    );
  }

  return (
    <div className="users-container">
      <h2>Users in Room</h2>
      <ul className="users-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;