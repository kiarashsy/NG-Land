import React, { useState, useEffect } from "react";

/* ===== المان‌های استایل‌دهی شده ===== */
const Card = ({ children, style }) => (
  <div style={{ background: '#2f3136', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginBottom: '20px', ...style }}>{children}</div>
);

const Input = (props) => (
  <input {...props} style={{ background: '#202225', color: '#dcddde', border: '1px solid #18191c', padding: '10px', borderRadius: '6px', width: '100%', boxSizing: 'border-box', marginBottom: '10px', outline: 'none' }} />
);

const Button = ({ children, primary, danger, ...props }) => (
  <button {...props} style={{ 
    background: primary ? '#5865f2' : (danger ? '#ed4245' : '#4f545c'), 
    color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', ...props.style 
  }}>{children}</button>
);

/* ===== کامپوننت اصلی داشبورد ===== */
export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('team'); 
  const [team, setTeam] = useState([]);
  const [mName, setMName] = useState("");
  const [mRole, setMRole] = useState("");
  const [mImg, setMImg] = useState("");

  // لود کردن دیتای تیم به محض باز شدن پنل
  useEffect(() => {
    const savedTeam = localStorage.getItem("teamData");
    // اگر قبلاً دیتایی ذخیره شده بود و خالی نبود
    if (savedTeam && JSON.parse(savedTeam).length > 0) {
      setTeam(JSON.parse(savedTeam));
    } else {
      // لیست پیش‌فرض ۹ نفره اگر بار اول است که وارد می‌شویم
      const defaultTeam = [
        { id: 1, name: "Mersad", role: "Developer", img: "assets/member1.jpg" },
        { id: 2, name: "Hs", role: "Designer", img: "assets/member2.jpg" },
        { id: 3, name: "Javad", role: "Manager", img: "assets/member3.jpg" },
        { id: 4, name: "biozed", role: "Backend", img: "assets/member4.jpg" },
        { id: 5, name: "yazdan", role: "Marketing", img: "assets/member5.jpg" },
        { id: 6, name: "sasan", role: "UI/UX", img: "assets/member6.jpg" },
        { id: 7, name: "kiarash", role: "GOD", img: "assets/member7.jpg" },
        { id: 8, name: "erfan", role: "33", img: "assets/member8.jpg" },
        { id: 9, name: "Ehsan", role: "siah mehraboon", img: "assets/member9.jpg" }
      ];
      setTeam(defaultTeam);
      localStorage.setItem("teamData", JSON.stringify(defaultTeam));
    }
  }, []);

  // تابع اضافه کردن عضو جدید
  const handleAddMember = () => {
    if(!mName || !mRole) return alert("لطفاً نام و نقش را وارد کنید");
    const newMember = { 
      id: Date.now(), 
      name: mName, 
      role: mRole, 
      img: mImg || 'assets/member1.jpg' 
    };
    const updated = [...team, newMember];
    setTeam(updated);
    localStorage.setItem("teamData", JSON.stringify(updated));
    setMName(""); setMRole(""); setMImg("");
  };

  // تابع حذف عضو
  const deleteMember = (id) => {
    const updated = team.filter(t => t.id !== id);
    setTeam(updated);
    localStorage.setItem("teamData", JSON.stringify(updated));
  };

  return (
    <div className="dashboard" style={{ background: '#36393f', minHeight: '100vh', color: '#dcddde', padding: '40px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #4f545c', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '24px' }}>Welcome, {user.username} (Admin)</h1>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => setActiveTab('team')} primary={activeTab === 'team'}>Team Settings</Button>
          <Button onClick={() => setActiveTab('users')} primary={activeTab === 'users'}>Users</Button>
        </nav>
      </header>

      {/* بخش مدیریت تیم */}
      {activeTab === 'team' && (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
          
          {/* ستون سمت چپ: فرم افزودن */}
          <div>
            <Card>
              <h3 style={{ marginBottom: '15px', color: '#fff' }}>Add New Member</h3>
              <Input placeholder="Member Name" value={mName} onChange={e => setMName(e.target.value)} />
              <Input placeholder="Role (e.g. Developer)" value={mRole} onChange={e => setMRole(e.target.value)} />
              <Input placeholder="Image Path (assets/member1.jpg)" value={mImg} onChange={e => setMImg(e.target.value)} />
              <Button primary style={{ width: '100%' }} onClick={handleAddMember}>Add to Slider</Button>
            </Card>
          </div>

          {/* ستون سمت راست: لیست اعضا */}
          <Card style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '20px', color: '#fff' }}>Current Team Slider</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {team.map((member) => (
                <div key={member.id} style={{ 
                  background: '#202225', padding: '15px', borderRadius: '10px', 
                  border: '1px solid #444', textAlign: 'center', position: 'relative' 
                }}>
                  <img src={member.img} style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }} 
                       onerror="this.src='https://via.placeholder.com/60'" />
                  <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: '#b9bbbe' }}>{member.role}</div>
                  
                  {/* دکمه حذف */}
                  <button 
                    onClick={() => deleteMember(member.id)}
                    style={{ 
                      position: 'absolute', top: '8px', right: '8px', background: 'none', 
                      border: 'none', color: '#ed4245', cursor: 'pointer', fontSize: '20px' 
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* بخش مدیریت یوزرها */}
      {activeTab === 'users' && (
        <Card>
          <h2>User Management</h2>
          <p style={{ color: '#b9bbbe' }}>This section is currently under construction.</p>
        </Card>
      )}
    </div>
  );
}