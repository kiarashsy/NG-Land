const { useState, useEffect } = React;

// --- کامپوننت‌های پایه طراحی (Discord Style) ---
const Card = ({ children, style }) => (
  <div style={{ background: '#2f3136', padding: '25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', ...style }}>{children}</div>
);

const Input = (props) => (
  <input {...props} style={{ background: '#202225', color: '#dcddde', border: '1px solid #18191c', padding: '12px', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: '10px', ...props.style }} />
);

// کامپوننت انتخابگر رول جدید
const Select = (props) => (
  <select {...props} style={{ background: '#202225', color: '#dcddde', border: '1px solid #18191c', padding: '12px', borderRadius: '6px', outline: 'none', width: '100%', marginBottom: '10px', cursor: 'pointer' }}>{props.children}</select>
);

const Button = ({ children, primary, danger, ...props }) => (
  <button {...props} style={{
    background: primary ? '#5865f2' : (danger ? '#ed4245' : '#4f545c'),
    color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', ...props.style
  }}
  onMouseOver={(e) => e.target.style.filter = 'brightness(1.2)'}
  onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
  >{children}</button>
);

// --- کامپوننت آپلود حرفه‌ای ---
const ImageUpload = ({ image, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => onUpload(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => document.getElementById('fileInput').click()}
      style={{
        border: `2px dashed ${dragging ? '#5865f2' : '#444'}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer',
        background: dragging ? 'rgba(88, 101, 242, 0.1)' : '#202225', transition: '0.3s', marginBottom: '20px'
      }}
    >
      <input id="fileInput" type="file" hidden accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
      {image ? (
        <div style={{ position: 'relative' }}>
          <img src={image} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #5865f2' }} />
          <div style={{ fontSize: '12px', color: '#5865f2', marginTop: '8px' }}>Click to change photo</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>📸</div>
          <div style={{ fontSize: '14px', color: '#b9bbbe' }}><strong>Click to upload</strong> or drag & drop</div>
        </div>
      )}
    </div>
  );
};

// --- اپلیکیشن اصلی ---
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // فیلدهای فرم تیم
  const [mName, setMName] = useState("");
  const [mRole, setMRole] = useState("");
  const [mImg, setMImg] = useState("");
  const [mSocial, setMSocial] = useState("");
  const [mStatus, setMStatus] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // فیلدهای ادمین
  const [newU, setNewU] = useState("");
  const [newP, setNewP] = useState("");
  const [newR, setNewR] = useState("user");
  const [editingUserIndex, setEditingUserIndex] = useState(null); // برای ویرایش یوزر

  useEffect(() => {
    const mainSections = document.querySelectorAll('.hero, .team-section, .footer, .header:not(:has(#auth-buttons-react))');
    if (currentUser) {
      mainSections.forEach(el => el.style.display = 'none');
      document.body.style.backgroundColor = '#36393f';
    } else {
      mainSections.forEach(el => el.style.display = '');
      document.body.style.backgroundColor = '';
    }
  }, [currentUser]);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedUsers = localStorage.getItem("usersList");
    const savedTeam = localStorage.getItem("teamData");

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else setUsers([{ username: "admin", password: "1234", role: "admin" }]);

    if (savedTeam) setTeam(JSON.parse(savedTeam));
  }, []);

  // تابع ذخیره کاربر (جدید یا ویرایش شده)
  const handleSaveUser = () => {
    if(!newU || !newP) return alert("Fill all fields!");
    let updatedUsers;
    
    if (editingUserIndex !== null) {
      // حالت ویرایش یوزر
      updatedUsers = users.map((u, index) => 
        index === editingUserIndex ? { username: newU, password: newP, role: newR } : u
      );
      setEditingUserIndex(null);
    } else {
      // حالت یوزر جدید
      updatedUsers = [...users, { username: newU, password: newP, role: newR }];
    }
    
    setUsers(updatedUsers);
    localStorage.setItem("usersList", JSON.stringify(updatedUsers));
    setNewU(""); setNewP(""); setNewR("user");
  };

  // تابع شروع ویرایش کاربر
  const startEditUser = (index) => {
    const u = users[index];
    setNewU(u.username);
    setNewP(u.password);
    setNewR(u.role);
    setEditingUserIndex(index);
  };

  // تابع حذف کاربر
  const deleteUser = (index) => {
    if (users[index].username === 'admin') return alert("Cannot delete main admin!");
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
    localStorage.setItem("usersList", JSON.stringify(updated));
  };

  const handleSaveMember = () => {
    if(!mName || !mRole) return alert("Fill Name and Role!");
    let updatedTeam;
    if (editingId) {
      updatedTeam = team.map(m => m.id === editingId ? { ...m, name: mName, role: mRole, img: mImg, social: mSocial, available: mStatus } : m);
      setEditingId(null);
    } else {
      updatedTeam = [...team, { id: Date.now(), name: mName, role: mRole, img: mImg, social: mSocial, available: mStatus }];
    }
    setTeam(updatedTeam);
    localStorage.setItem("teamData", JSON.stringify(updatedTeam));
    setMName(""); setMRole(""); setMImg(""); setMSocial(""); setMStatus(true);
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setMName(m.name);
    setMRole(m.role);
    setMImg(m.img);
    setMSocial(m.social || "");
    setMStatus(m.available);
  };

  if (currentUser) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#36393f', color: '#dcddde', zIndex: 99999, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
        
        {/* Topbar */}
        <div style={{ height: '70px', background: '#202225', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #18191c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '45px', height: '45px', background: '#5865f2', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white' }}>NG</div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>NG-LAND <span style={{fontSize: '10px', color: '#5865f2', background: 'rgba(88,101,242,0.1)', padding:'2px 6px', borderRadius:'4px', marginLeft:'5px'}}>ADMIN</span></h2>
            <div style={{marginLeft: '30px', display: 'flex', gap: '20px'}}>
               <span onClick={() => setActiveTab('dashboard')} style={{cursor: 'pointer', color: activeTab === 'dashboard' ? 'white' : '#8e9297', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal'}}>Dashboard</span>
               <span onClick={() => setActiveTab('team')} style={{cursor: 'pointer', color: activeTab === 'team' ? 'white' : '#8e9297', fontWeight: activeTab === 'team' ? 'bold' : 'normal'}}>Team Settings</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{color: '#8e9297', fontSize:'14px'}}>Hi, <strong>{currentUser.username}</strong></span>
            <Button danger onClick={() => { localStorage.removeItem("currentUser"); window.location.reload(); }}>Logout</Button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {activeTab === 'dashboard' ? (
              <div>
                <h1>Dashboard</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                  <Card>
                    <h3 style={{color: 'white'}}>{editingUserIndex !== null ? "✏️ Edit User" : "➕ Create New User"}</h3>
                    <Input placeholder="Username" value={newU} onChange={e => setNewU(e.target.value)} />
                    <Input placeholder="Password" type="password" value={newP} onChange={e => setNewP(e.target.value)} />
                    
                    <label style={{color:'#8e9297', fontSize:'12px', display:'block', marginBottom:'5px'}}>Assign Role:</label>
                    <Select value={newR} onChange={e => setNewR(e.target.value)}>
                        <option value="user" style={{background:'#2f3136'}}>User (Standard)</option>
                        <option value="admin" style={{background:'#2f3136'}}>Admin (Full Access)</option>
                    </Select>

                    <Button primary style={{width: '100%', marginTop:'10px'}} onClick={handleSaveUser}>
                        {editingUserIndex !== null ? "Save Changes" : "Create User"}
                    </Button>
                    {editingUserIndex !== null && (
                        <Button style={{width:'100%', marginTop:'10px', background:'transparent'}} onClick={() => {setEditingUserIndex(null); setNewU(""); setNewP("");}}>Cancel</Button>
                    )}
                  </Card>
                  
                  <Card>
                    <h3 style={{color: 'white'}}>System Users</h3>
                    <div style={{maxHeight:'400px', overflowY:'auto'}}>
                        {users.map((u, index) => (
                        <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', padding: '12px 0', borderBottom: '1px solid #444'}}>
                            <span>{u.username} <small style={{color:'#5865f2', marginLeft:'5px'}}>({u.role})</small></span>
                            <div style={{display:'flex', gap:'5px'}}>
                                <Button style={{padding:'4px 8px', fontSize:'11px'}} onClick={() => startEditUser(index)}>Edit</Button>
                                <Button danger style={{padding:'4px 8px', fontSize:'11px'}} onClick={() => deleteUser(index)}>Delete</Button>
                            </div>
                        </div>
                        ))}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div>
                <h1>Team Management</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', marginTop: '20px' }}>
                  <Card>
                    <h3 style={{color: 'white', marginBottom:'20px'}}>{editingId ? "✨ Edit Member" : "➕ Add Member"}</h3>
                    
                    <ImageUpload image={mImg} onUpload={(data) => setMImg(data)} />

                    <Input placeholder="Full Name" value={mName} onChange={e => setMName(e.target.value)} />
                    <Input placeholder="Role (e.g. Lead Designer)" value={mRole} onChange={e => setMRole(e.target.value)} />
                    <Input placeholder="Social Link (Optional)" value={mSocial} onChange={e => setMSocial(e.target.value)} />
                    
                    <div style={{marginBottom: '20px', display:'flex', alignItems:'center', gap:'10px', color:'#b9bbbe'}}>
                        <input type="checkbox" id="avail" checked={mStatus} onChange={e => setMStatus(e.target.checked)} style={{width:'18px', height:'18px', accentColor:'#5865f2'}} />
                        <label htmlFor="avail">Available for Hire</label>
                    </div>

                    <Button primary style={{width: '100%', padding:'12px'}} onClick={handleSaveMember}>
                        {editingId ? "Save Changes" : "Add to Team Slider"}
                    </Button>
                    {editingId && <Button style={{width:'100%', marginTop:'10px', background:'transparent'}} onClick={() => {setEditingId(null); setMName(""); setMImg("");}}>Cancel</Button>}
                  </Card>
                  
                  <Card>
                    <h3 style={{marginBottom:'20px'}}>Current Team ({team.length})</h3>
                    <div style={{maxHeight:'500px', overflowY:'auto'}}>
                      {team.map(m => (
                        <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #444'}}>
                          <div style={{width: '45px', height: '45px', borderRadius: '50%', background: '#5865f2', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden', border: `2px solid ${m.available ? '#43b581' : '#f04747'}`}}>
                             {m.img ? <img src={m.img} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (m.name ? m.name[0] : '?')}
                          </div>
                          <div style={{flex: 1}}>
                            <strong style={{color:'white'}}>{m.name}</strong><br/>
                            <small style={{color:'#b9bbbe'}}>{m.role}</small>
                          </div>
                          <div style={{display:'flex', gap:'8px'}}>
                              <Button style={{padding: '6px 12px', fontSize:'12px'}} onClick={() => startEdit(m)}>Edit</Button>
                              <Button danger style={{padding: '6px 12px', fontSize:'12px'}} onClick={() => {
                                 const updated = team.filter(t => t.id !== m.id);
                                 setTeam(updated);
                                 localStorage.setItem("teamData", JSON.stringify(updated));
                              }}>Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
      <Button primary onClick={() => setModalOpen(true)}>Login</Button>
      {modalOpen && <LoginModal users={users} onLogin={(u) => { setCurrentUser(u); localStorage.setItem("currentUser", JSON.stringify(u)); setModalOpen(false); }} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function LoginModal({ onLogin, onClose, users }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999}}>
      <Card style={{minWidth: '350px', textAlign: 'center', background: '#36393f', border:'1px solid #444'}}>
        <div style={{width:'60px', height:'60px', background:'#5865f2', borderRadius:'15px', margin:'0 auto 20px', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'24px', fontWeight:'bold', color:'white'}}>NG</div>
        <h2 style={{color: 'white', marginBottom: '8px'}}>Welcome Back!</h2>
        <p style={{color:'#b9bbbe', marginBottom:'25px', fontSize:'14px'}}>We're so excited to see you again!</p>
        <Input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <Button primary style={{width: '100%', marginTop: '10px', padding:'12px'}} onClick={() => {
           const u = users.find(x => x.username === username && x.password === password);
           u ? onLogin(u) : alert("Invalid Credentials!");
        }}>Login</Button>
        <p onClick={onClose} style={{color: '#00aff4', cursor: 'pointer', marginTop: '20px', fontSize:'13px'}}>Back to Website</p>
      </Card>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("auth-buttons-react"));
root.render(<App />);