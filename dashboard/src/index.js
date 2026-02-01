const { useState, useEffect } = React;

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
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div style={{background: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #00f2fe', textAlign: 'center', minWidth: '300px'}}>
        <h2 style={{color: '#fff', marginBottom: '20px'}}>Login</h2>
        <input style={{display: 'block', width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px'}} placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input style={{display: 'block', width: '90%', padding: '10px', marginBottom: '20px', borderRadius: '5px'}} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} style={{padding: '10px 20px', backgroundColor: '#00f2fe', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Login</button>
        <button onClick={onClose} style={{padding: '10px 20px', marginLeft: '10px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px'}}>Close</button>
      </div>
    </div>
  ); // این سمی‌کالن بعد از پرانتز ریترن مشکلی ندارد
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  if (currentUser) {
    return (
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', color: '#fff', zIndex: 2000, padding: '50px'}}>
        <h1>Welcome to Panel, {currentUser.username}</h1>
        <button onClick={() => { localStorage.removeItem("currentUser"); setCurrentUser(null); }} style={{padding: '10px', cursor: 'pointer'}}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{position: 'absolute', top: '20px', right: '20px', zIndex: 100}}>
      <button onClick={() => setModalOpen(true)} style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '5px'}}>Login</button>
      {modalOpen && <LoginModal onLogin={(u) => { setCurrentUser(u); localStorage.setItem("currentUser", JSON.stringify(u)); setModalOpen(false); }} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// فقط و فقط یک بار این بخش را در کل فایل داشته باش
const root = ReactDOM.createRoot(document.getElementById("auth-buttons-react"));
root.render(<App />);