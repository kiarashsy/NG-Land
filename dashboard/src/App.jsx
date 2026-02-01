import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Modal login
function LoginModal({ onLogin, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      onLogin({ username: "admin", role: "admin" });
    } else if (username === "user" && password === "1234") {
      onLogin({ username: "user", role: "user" });
    } else {
      alert("Username or Password is incorrect ❌");
    }
  };

  return (
    <div className="login-modal active">
      <div className="login-box">
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// داشبورد Admin
function AdminDashboard({ user }) {
  return <div className="dashboard admin-dashboard"><h1>Welcome Admin {user.username}</h1></div>;
}

// داشبورد User
function UserDashboard({ user }) {
  return <div className="dashboard user-dashboard"><h1>Welcome {user.username}</h1></div>;
}

// App اصلی
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setModalOpen(false);
  };

  return (
    <>
      {!currentUser && (
        <div id="auth-buttons-react">
          <button className="login-btn" onClick={() => setModalOpen(true)}>Login</button>
        </div>
      )}

      {modalOpen && <LoginModal onLogin={handleLogin} onClose={() => setModalOpen(false)} />}

      {currentUser && currentUser.role === "admin" && <AdminDashboard user={currentUser} />}
      {currentUser && currentUser.role === "user" && <UserDashboard user={currentUser} />}
    </>
  );
}

// mount React روی همان صفحه
const root = ReactDOM.createRoot(document.getElementById("dashboard-root"));
root.render(<App />);
