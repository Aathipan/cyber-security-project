import React, { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // --- Dashboard State ---
  const [phishingScore, setPhishingScore] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Login Logic
  const handleLogin = async () => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success) { setView('dashboard'); } 
        else { setMessage("ACCESS DENIED: Invalid Credentials"); }
    } catch (error) { setMessage("Error: Backend disconnected."); }
  };

  // Signup Logic
  const handleSignup = async () => {
     try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        setMessage(data.message || "User Registered.");
    } catch (error) { setMessage("Error: Backend disconnected."); }
  };

  // --- Simulation Functions ---
  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
        setScanProgress((prev) => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                return 100;
            }
            return prev + 10;
        });
    }, 200);
  };

  const checkPassword = (e) => {
    const val = e.target.value;
    if (val.length < 5) setPasswordStrength("WEAK 🔴");
    else if (val.length < 8) setPasswordStrength("MEDIUM 🟠");
    else setPasswordStrength("STRONG 🟢");
  };

  const handlePhishingClick = (choice) => {
    if (choice === 'safe') setPhishingScore(phishingScore + 10);
    else setPhishingScore(phishingScore - 5);
    setShowModal(false);
  };

  return (
    <div className="container">
      {view === 'login' ? (
        <div className="login-box">
          <h1>🔐 last check bro </h1>
          <p>Authorized Personnel Only</p>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <br/>
          <button onClick={handleLogin}>Authenticate</button>
          <button className="secondary" onClick={handleSignup}>Register</button>
          <p style={{color: 'red', marginTop: '10px'}}>{message}</p>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 20px', borderBottom:'1px solid #334155', marginBottom:'20px'}}>
            <h1>🛡️ Cyber Awareness Hub</h1>
            <div>
                <span>User: <strong>{username}</strong></span>
                <button className="secondary" onClick={() => setView('login')} style={{marginLeft:'15px'}}>Logout</button>
            </div>
          </div>

          {/* ========================================== */}
          {/* NEW CI/CD AUTOMATION BANNER (Add this here) */}
          {/* ========================================== */}
          <div style={{
            background: '#1e293b', 
            border: '2px solid #22c55e', 
            padding: '15px', 
            borderRadius: '10px', 
            textAlign: 'center', 
            marginBottom: '20px',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)'
          }}>
            <h2 style={{color: '#22c55e', margin: 0}}>🚀 Jenkins CI/CD Status: LIVE</h2>
            <p style={{color: '#94a3b8', margin: '5px 0 0 0'}}>Automatic Deployment Successful at {new Date().toLocaleTimeString()}</p>
          </div>

          {/* DASHBOARD GRID */}
          <div className="dashboard">

            {/* 1. Live Threat Map (Visual Only) */}
            <div className="card">
              <h3>🌍 Live Threat Intel</h3>
              <p>Monitoring global attack vectors...</p>
              <ul style={{fontSize:'0.9rem', color:'#94a3b8'}}>
                <li>🔴 SQL Injection attempt blocked from IP 103.21.x.x</li>
                <li>🟠 Brute Force detected on Admin Panel</li>
                <li>🟢 Firewall updated successfully at 09:00 AM</li>
              </ul>
            </div>

            {/* 2. Interactive Malware Scanner */}
            <div className="card">
              <h3>🦠 System Health Scan</h3>
              <p>Check your device for known vulnerabilities.</p>
              {isScanning ? (
                <div>
                    <p>Scanning files... {scanProgress}%</p>
                    <div style={{background:'#334155', height:'10px', borderRadius:'5px'}}>
                        <div style={{background:'#3b82f6', width:`${scanProgress}%`, height:'100%', borderRadius:'5px'}}></div>
                    </div>
                </div>
              ) : (
                <div>
                    <p>{scanProgress === 100 ? "✅ No Threats Found" : "System Status: Unknown"}</p>
                    <button onClick={startScan}>Start Full Scan</button>
                </div>
              )}
            </div>

            {/* 3. Phishing Simulator */}
            <div className="card">
              <h3>🎣 Phishing Training</h3>
              <p>Score: <strong>{phishingScore} XP</strong></p>
              <button onClick={() => setShowModal(true)}>Start Simulation</button>
              {showModal && (
                <div style={{background:'#334155', padding:'10px', marginTop:'10px', borderRadius:'5px'}}>
                    <p><strong>Scenario:</strong> You receive an email from "PayPa1-Support" asking to verify your account.</p>
                    <button onClick={() => handlePhishingClick('unsafe')} style={{background:'#ef4444'}}>Click Link</button>
                    <button onClick={() => handlePhishingClick('safe')} style={{background:'#22c55e'}}>Report Spam</button>
                </div>
              )}
            </div>

            {/* 4. Password Strength Lab */}
            <div className="card">
              <h3>🔑 Password Strength Lab</h3>
              <p>Test your password complexity (Simulated)</p>
              <input type="text" placeholder="Type a test password..." onChange={checkPassword} style={{width:'90%'}} />
              <p>Strength: <strong>{passwordStrength}</strong></p>
            </div>

            {/* 5. Encryption Demo */}
            <div className="card">
              <h3>🔒 Encryption 101</h3>
              <p><strong>Plaintext:</strong> "Hello World"</p>
              <p><strong>AES-256 (Encrypted):</strong></p>
              <code style={{background:'#000', color:'#22c55e', padding:'5px', display:'block', fontSize:'0.8rem'}}>
                U2FsdGVkX1+...x8s9s9d8f
              </code>
              <p style={{fontSize:'0.8rem', marginTop:'10px'}}>Data is unreadable without the key.</p>
            </div>

            {/* 6. Social Engineering Alert */}
            <div className="card" style={{borderLeft:'5px solid orange'}}>
              <h3>⚠️ Social Engineering</h3>
              <p><strong>Topic of the Week: "Vishing"</strong></p>
              <p>Attackers use voice calls to trick you into giving up OTPs.</p>
              <p><em>Rule: No bank will ever ask for your PIN over the phone.</em></p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
