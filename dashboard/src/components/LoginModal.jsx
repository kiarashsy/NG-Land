import React, { useState } from "react";

export default function LoginModal({ setCurrentUser, closeModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      setCurrentUser({ username: "admin", role: "admin" });
    } else if (username === "user" && password === "1234") {
      setCurrentUser({ username: "user", role: "user" });
    } else {
      alert("Username or Password is incorrect ❌");
    }
  };

  return (
    <div className="login-modal active">
      <div className="login-box">
        <h2>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}
