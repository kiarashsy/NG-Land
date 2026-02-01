import React, { useState } from "react";

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");

  const addUser = () => {
    if (newUser) {
      setUsers([...users, { username: newUser, role: "user" }]);
      setNewUser("");
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <h1>Welcome Admin {user.username}</h1>
      <input
        placeholder="New Username"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>

      <h2>Users:</h2>
      <ul>
        {users.map((u, idx) => (
          <li key={idx}>{u.username} ({u.role})</li>
        ))}
      </ul>
    </div>
  );
}
