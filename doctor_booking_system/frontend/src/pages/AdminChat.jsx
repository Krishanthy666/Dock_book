import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, off } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, MessageSquare, Send, Bot, ChevronRight, Activity, Clock, 
  ShieldAlert, Lock, Mail, DollarSign, ActivitySquare, BarChart3, 
  ListFilter, UserPlus, LogOut, ArrowUpRight, CheckCircle, RefreshCw, Search
} from 'lucide-react';

export default function AdminChat() {
  const { user, login, logout } = useAuth();
  
  // Tab states: 'overview' | 'appointments' | 'patients' | 'chat'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states for login guard
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard data states
  const [stats, setStats] = useState({
    total_appointments: 0,
    total_revenue: 0.0,
    total_analyses: 0,
    disease_distribution: {},
    specialty_distribution: {}
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase support chat states
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch admin dashboard stats, appointments and patients
  const fetchData = async () => {
    if (!user || !user.is_admin) return;
    setIsLoadingData(true);
    try {
      const statsRes = await fetch('http://localhost:8000/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      const apptsRes = await fetch('http://localhost:8000/admin/appointments');
      const apptsData = await apptsRes.json();
      setAppointments(apptsData);

      const patientsRes = await fetch('http://localhost:8000/admin/patients');
      const patientsData = await patientsRes.json();
      setPatients(patientsData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Load conversations from Firebase for Live Support
  useEffect(() => {
    if (!user || !user.is_admin) return;
    const chatsRef = ref(db, 'chats');
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const convList = Object.entries(data).map(([userId, val]) => ({
          userId,
          meta: val.meta || {},
          messageCount: val.messages ? Object.keys(val.messages).length : 0
        })).sort((a, b) => (b.meta.lastMessageTime || 0) - (a.meta.lastMessageTime || 0));
        setConversations(convList);
      }
    });
    return () => off(chatsRef);
  }, [user]);

  // Load messages for selected user in Support Chat
  useEffect(() => {
    if (!selectedUser) return;
    const chatRef = ref(db, `chats/${selectedUser.userId}/messages`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data)
          .map(([key, val]) => ({ id: key, ...val }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    });
    return () => off(chatRef);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      
      if (!data.is_admin) {
        throw new Error('Access denied. Administrator privileges required.');
      }
      
      login({ id: data.user_id, name: data.name, email: loginEmail, is_admin: true }, rememberMe);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser) return;
    const msgText = chatInput.trim();
    setChatInput('');
    setIsSending(true);
    try {
      await push(ref(db, `chats/${selectedUser.userId}/messages`), {
        text: msgText,
        sender: 'admin',
        senderName: 'eDocBook Support',
        timestamp: Date.now(),
      });
      await set(ref(db, `chats/${selectedUser.userId}/meta`), {
        ...selectedUser.meta,
        lastMessage: msgText,
        lastMessageTime: Date.now(),
        hasUnread: false
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString();
  };

  // Check authentication
  if (!user || !user.is_admin) {
    return (
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #050508 0%, #100b1e 100%)',
        padding: '2rem'
      }}>
        <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#a78bfa' }}>
            <ShieldAlert size={56} style={{ filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.4))' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>Admin Access Only</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Please authenticate using administrator credentials to view medical analytics, patient registries, and chat queues.
          </p>

          {loginError && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ textAlign: 'left' }}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> Admin Email
              </label>
              <input 
                type="email" 
                className="input-field" 
                required 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@edocbook.com"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} /> Password
              </label>
              <input 
                type="password" 
                className="input-field" 
                required 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              <input 
                type="checkbox" 
                id="rememberMeAdmin"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ 
                  accentColor: 'var(--accent-primary)', 
                  width: '16px', 
                  height: '16px', 
                  cursor: 'pointer' 
                }}
              />
              <label htmlFor="rememberMeAdmin" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                Remember me for 30 days
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Verifying...' : 'Authorize Session'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter logic for tables
  const filteredAppointments = appointments.filter(a => 
    a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.patient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.disease.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ 
      minHeight: '92vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #050508 0%, #0d091a 100%)',
      fontFamily: "'Inter', sans-serif" 
    }}>
      {/* Admin Control Sidebar */}
      <div style={{ 
        width: '260px', 
        borderRight: '1px solid rgba(255, 255, 255, 0.06)', 
        background: 'rgba(0, 0, 0, 0.3)', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <ActivitySquare color="var(--accent-secondary)" size={28} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>eDocBook</h2>
            <span style={{ color: '#06b6d4', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Dashboard</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === 'overview' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === 'overview' ? '#c084fc' : '#94a3b8',
              borderLeft: activeTab === 'overview' ? '3px solid #8b5cf6' : '3px solid transparent'
            }}
          >
            <BarChart3 size={18} /> Overview & Charts
          </button>
          
          <button 
            onClick={() => { setActiveTab('appointments'); setSearchQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === 'appointments' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === 'appointments' ? '#c084fc' : '#94a3b8',
              borderLeft: activeTab === 'appointments' ? '3px solid #8b5cf6' : '3px solid transparent'
            }}
          >
            <Clock size={18} /> Booked Appointments
          </button>
          
          <button 
            onClick={() => { setActiveTab('patients'); setSearchQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === 'patients' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === 'patients' ? '#c084fc' : '#94a3b8',
              borderLeft: activeTab === 'patients' ? '3px solid #8b5cf6' : '3px solid transparent'
            }}
          >
            <Users size={18} /> Patient Directory
          </button>
          
          <button 
            onClick={() => { setActiveTab('chat'); setSearchQuery(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === 'chat' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === 'chat' ? '#c084fc' : '#94a3b8',
              borderLeft: activeTab === 'chat' ? '3px solid #8b5cf6' : '3px solid transparent'
            }}
          >
            <MessageSquare size={18} /> Live Support
            {conversations.some(c => c.meta.hasUnread) && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', marginLeft: 'auto' }} />
            )}
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>SA</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'white', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'transparent', color: '#f87171', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '600'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={14} /> End Session
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
              {activeTab === 'overview' && 'System Analytics Overview'}
              {activeTab === 'appointments' && 'Medical Bookings Registry'}
              {activeTab === 'patients' && 'Registered Patients Directory'}
              {activeTab === 'chat' && 'Patient Live Support Queue'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              {activeTab === 'overview' && 'Real-time telemetry of clinical reservations, Stripe earnings, and AI symptom logging.'}
              {activeTab === 'appointments' && 'Query, inspect, and audit all clinical checkups booked via the platform.'}
              {activeTab === 'patients' && 'View customer directories, registered contact emails, and aggregate visits.'}
              {activeTab === 'chat' && 'Manage real-time inquiry channels and text patients in need of support.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={fetchData}
              disabled={isLoadingData}
              style={{
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.6rem 0.8rem', color: '#c084fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} /> {isLoadingData ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* --- OVERVIEW TAB CONTENT --- */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Reserved Slots</span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', margin: '4px 0 0' }}>{stats.total_appointments}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', marginTop: '6px' }}>
                    <CheckCircle size={12} /> Appointments in registry
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                  <Clock size={22} />
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stripe Revenue</span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', margin: '4px 0 0' }}>${stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06b6d4', fontSize: '0.75rem', marginTop: '6px' }}>
                    <ArrowUpRight size={12} /> Volume processed via Stripe
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                  <DollarSign size={22} />
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Diagnostic Checks</span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', margin: '4px 0 0' }}>{stats.total_analyses}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a78bfa', fontSize: '0.75rem', marginTop: '6px' }}>
                    <Bot size={12} /> Machine Learning model calls
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                  <Bot size={22} />
                </div>
              </div>

            </div>

            {/* Custom Visual Charts section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              
              {/* Chart 1: Disease checker distribution */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#8b5cf6" /> AI Symptom Checker Runs
                </h3>
                
                {Object.keys(stats.disease_distribution).length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', opacity: 0.4 }}>
                    <Bot size={40} />
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No AI logs recorded yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {Object.entries(stats.disease_distribution)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([disease, count], idx) => {
                        const total = Object.values(stats.disease_distribution).reduce((acc, curr) => acc + curr, 0);
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
                        const color = colors[idx % colors.length];
                        return (
                          <div key={disease}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '6px', fontWeight: '500' }}>
                              <span>{disease}</span>
                              <span style={{ color: color, fontWeight: '700' }}>{count} runs ({pct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                              <div style={{ 
                                height: '100%', 
                                background: `linear-gradient(90deg, ${color} 0%, #c084fc 100%)`, 
                                width: `${pct}%`,
                                borderRadius: '10px',
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                              }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Chart 2: Specialty Booking distribution */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="#06b6d4" /> Bookings by Medical Specialty
                </h3>

                {Object.keys(stats.specialty_distribution).length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', opacity: 0.4 }}>
                    <Users size={40} />
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No specialties booked yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
                    
                    {/* Visual segment breakdown pill */}
                    <div style={{ 
                      height: '24px', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {Object.entries(stats.specialty_distribution).map(([spec, count], idx) => {
                        const total = Object.values(stats.specialty_distribution).reduce((acc, curr) => acc + curr, 0);
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
                        return (
                          <div key={spec} style={{
                            width: `${pct}%`,
                            background: colors[idx % colors.length],
                            height: '100%',
                            transition: 'width 1s ease'
                          }} title={`${spec}: ${count} (${pct.toFixed(0)}%)`} />
                        );
                      })}
                    </div>

                    {/* Legend description grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                      {Object.entries(stats.specialty_distribution).map(([spec, count], idx) => {
                        const total = Object.values(stats.specialty_distribution).reduce((acc, curr) => acc + curr, 0);
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
                        const color = colors[idx % colors.length];
                        return (
                          <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                            <div style={{ overflow: 'hidden' }}>
                              <p style={{ margin: 0, fontSize: '0.8', color: '#e2e8f0', fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spec}</p>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{count} bookings ({pct.toFixed(0)}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* --- APPOINTMENTS TAB CONTENT --- */}
        {activeTab === 'appointments' && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
            {/* Search Input bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search appointments by Patient, Doctor, Specialty, or Disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', 
                  background: 'rgba(0,0,0,0.4)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '0.8rem 1rem 0.8rem 2.8rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Appointments list */}
            {filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                <Clock size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem' }}>No matching appointments found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '1rem 0.75rem' }}>ID</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Patient Details</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Doctor / Specialty</th>
                      <th style={{ padding: '1rem 0.75rem' }}>AI Diagnosis</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Status</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Reserved Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(appt => (
                      <tr key={appt.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.88rem', color: '#e2e8f0' }}>
                        <td style={{ padding: '1.2rem 0.75rem', color: '#a78bfa', fontWeight: '700' }}>#{appt.id}</td>
                        <td style={{ padding: '1.2rem 0.75rem' }}>
                          <p style={{ margin: 0, fontWeight: '700', color: 'white' }}>{appt.patient_name}</p>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.patient_email}</span>
                        </td>
                        <td style={{ padding: '1.2rem 0.75rem' }}>
                          <p style={{ margin: 0, fontWeight: '600' }}>{appt.doctor_name}</p>
                          <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>{appt.specialty}</span>
                        </td>
                        <td style={{ padding: '1.2rem 0.75rem', color: '#c084fc', fontWeight: '500' }}>{appt.disease}</td>
                        <td style={{ padding: '1.2rem 0.75rem' }}>
                          <span style={{ 
                            background: appt.payment_status === 'paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: appt.payment_status === 'paid' ? '#10b981' : '#f59e0b',
                            border: appt.payment_status === 'paid' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {appt.payment_status}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem 0.75rem', color: '#94a3b8', fontSize: '0.8rem' }}>{appt.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- PATIENTS TAB CONTENT --- */}
        {activeTab === 'patients' && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem' }}>
            {/* Search Input bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search patients by Name or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', 
                  background: 'rgba(0,0,0,0.4)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '0.8rem 1rem 0.8rem 2.8rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Patients list */}
            {filteredPatients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                <Users size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem' }}>No patients found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '1rem 0.75rem' }}>User ID</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Patient Name</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Email Address</th>
                      <th style={{ padding: '1rem 0.75rem' }}>Reserved Bookings Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(pat => (
                      <tr key={pat.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.88rem', color: '#e2e8f0' }}>
                        <td style={{ padding: '1.2rem 0.75rem', color: '#a78bfa', fontWeight: '700' }}>#{pat.id}</td>
                        <td style={{ padding: '1.2rem 0.75rem', fontWeight: '700', color: 'white' }}>{pat.name}</td>
                        <td style={{ padding: '1.2rem 0.75rem', color: '#94a3b8' }}>{pat.email}</td>
                        <td style={{ padding: '1.2rem 0.75rem' }}>
                          <span style={{ 
                            background: pat.appointments_count > 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                            color: pat.appointments_count > 0 ? '#22d3ee' : '#64748b',
                            border: pat.appointments_count > 0 ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            padding: '3px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}>
                            {pat.appointments_count} booked
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- CHAT SUPPORT TAB CONTENT --- */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: '520px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
            
            {/* Conversations list sidebar */}
            <div style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#8b5cf6" />
                <span style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Conversations</span>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', overflowY: 'auto' }}>
                {conversations.length === 0 ? (
                  <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0, textAlign: 'center', paddingTop: '2rem' }}>No conversations yet</p>
                ) : conversations.map(conv => (
                  <div key={conv.userId}
                    onClick={() => { setSelectedUser(conv); setMessages([]); }}
                    style={{ 
                      padding: '0.75rem 1rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedUser?.userId === conv.userId ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)', 
                      border: selectedUser?.userId === conv.userId ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>{conv.meta.patientName || `Patient #${conv.userId}`}</span>
                      <span style={{ color: '#475569', fontSize: '0.7rem' }}>{formatTime(conv.meta.lastMessageTime)}</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.meta.lastMessage || 'No messages'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', alignItems: 'center' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{conv.messageCount} messages</span>
                      {conv.meta.hasUnread && <span style={{ background: '#f43f5e', borderRadius: '10px', padding: '1px 8px', color: 'white', fontSize: '0.65rem', fontWeight: '700' }}>NEW</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages Frame */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {!selectedUser ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: 0.4 }}>
                  <MessageSquare size={56} color="#8b5cf6" />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'white', fontWeight: '700', fontSize: '1rem', margin: 0 }}>Select support channel</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0' }}>Select a patient from the queue to start support chat.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Active patient chat header */}
                  <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>{(selectedUser.meta.patientName || 'P')[0]}</span>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: '700' }}>{selectedUser.meta.patientName || `Patient #${selectedUser.userId}`}</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem' }}>Channel ID: {selectedUser.userId}</p>
                    </div>
                  </div>

                  {/* Messages flow container */}
                  <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.length === 0 && <p style={{ color: '#475569', textAlign: 'center', fontSize: '0.8rem' }}>No messages yet.</p>}
                    {messages.map(msg => {
                      const isAdmin = msg.sender === 'admin';
                      return (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: isAdmin ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isAdmin ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isAdmin ? <Bot size={13} color="white" /> : <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: '700' }}>{(msg.senderName || 'P')[0]}</span>}
                          </div>
                          <div style={{ maxWidth: '65%' }}>
                            <div style={{ 
                              background: isAdmin ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255,255,255,0.04)', 
                              border: isAdmin ? 'none' : '1px solid rgba(255,255,255,0.06)', 
                              color: 'white', 
                              padding: '0.7rem 0.9rem', 
                              borderRadius: isAdmin ? '14px 14px 0 14px' : '14px 14px 14px 0', 
                              fontSize: '0.82rem', 
                              lineHeight: '1.4', 
                              wordBreak: 'break-word' 
                            }}>
                              {msg.text}
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.65rem', marginTop: '3px', textAlign: isAdmin ? 'right' : 'left' }}>
                              {msg.senderName} · {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message submit form */}
                  <form onSubmit={handleSendChat} style={{ padding: '0.8rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.15)' }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Reply to ${selectedUser.meta.patientName || 'patient'}...`}
                      style={{ 
                        flex: 1, 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(6,182,212,0.2)', 
                        borderRadius: '10px', 
                        padding: '0.7rem 1rem', 
                        color: 'white', 
                        fontSize: '0.85rem', 
                        outline: 'none', 
                        fontFamily: 'inherit' 
                      }}
                    />
                    <button 
                      type="submit" 
                      disabled={!chatInput.trim() || isSending} 
                      style={{ 
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
                        border: 'none', 
                        borderRadius: '10px', 
                        width: '40px', 
                        height: '40px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: chatInput.trim() && !isSending ? 'pointer' : 'not-allowed', 
                        opacity: chatInput.trim() && !isSending ? 1 : 0.5, 
                        color: 'white' 
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </>
              )}
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
