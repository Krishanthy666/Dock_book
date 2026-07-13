import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, off } from 'firebase/database';
import { db } from '../firebase';
import { Users, MessageSquare, Send, Bot, ChevronRight, Activity, Clock } from 'lucide-react';

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);
  const messagesEndRef = useRef(null);

  // Load all conversations from Firebase
  useEffect(() => {
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
  }, []);

  // Load all appointments
  useEffect(() => {
    fetch('http://localhost:8000/admin/appointments')
      .then(r => r.json())
      .then(setAllAppointments)
      .catch(console.error);
  }, []);

  // Load messages for selected user
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    const msgText = input.trim();
    setInput('');
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
      console.error('Failed to send:', err);
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

  const statusColor = (s) => s === 'paid' ? '#10b981' : s === 'pending' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0f1a,#1a0a2e)', fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column' }}>
      {/* Admin Header */}
      <div style={{ padding:'1rem 2rem', background:'rgba(0,0,0,0.4)', borderBottom:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Activity size={20} color="white" />
        </div>
        <div>
          <h1 style={{ margin:0, color:'white', fontSize:'1.3rem', fontWeight:'700' }}>eDocBook Admin Panel</h1>
          <p style={{ margin:0, color:'#64748b', fontSize:'0.8rem' }}>Live Chat & Appointment Management</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:'1rem' }}>
          <div style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:'10px', padding:'0.5rem 1rem', textAlign:'center' }}>
            <div style={{ color:'#a78bfa', fontSize:'1.4rem', fontWeight:'700' }}>{conversations.length}</div>
            <div style={{ color:'#64748b', fontSize:'0.75rem' }}>Conversations</div>
          </div>
          <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'10px', padding:'0.5rem 1rem', textAlign:'center' }}>
            <div style={{ color:'#10b981', fontSize:'1.4rem', fontWeight:'700' }}>{allAppointments.filter(a=>a.payment_status==='paid').length}</div>
            <div style={{ color:'#64748b', fontSize:'0.75rem' }}>Paid Bookings</div>
          </div>
          <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'10px', padding:'0.5rem 1rem', textAlign:'center' }}>
            <div style={{ color:'#f59e0b', fontSize:'1.4rem', fontWeight:'700' }}>{allAppointments.length}</div>
            <div style={{ color:'#64748b', fontSize:'0.75rem' }}>Total Bookings</div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Sidebar: conversations + appointments */}
        <div style={{ width:'340px', borderRight:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Live Chats */}
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <MessageSquare size={16} color="#8b5cf6" />
              <span style={{ color:'#a78bfa', fontSize:'0.85rem', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em' }}>Live Chats</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', maxHeight:'200px', overflowY:'auto' }}>
              {conversations.length === 0 ? (
                <p style={{ color:'#475569', fontSize:'0.8rem', margin:0 }}>No conversations yet</p>
              ) : conversations.map(conv => (
                <div key={conv.userId}
                  onClick={() => { setSelectedUser(conv); setMessages([]); }}
                  style={{ padding:'0.75rem 1rem', borderRadius:'10px', cursor:'pointer', background: selectedUser?.userId === conv.userId ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)', border: selectedUser?.userId === conv.userId ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.06)', transition:'all 0.2s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ color:'white', fontWeight:'600', fontSize:'0.9rem' }}>{conv.meta.patientName || `Patient #${conv.userId}`}</span>
                    <span style={{ color:'#475569', fontSize:'0.72rem' }}>{formatTime(conv.meta.lastMessageTime)}</span>
                  </div>
                  <p style={{ color:'#64748b', fontSize:'0.8rem', margin:'4px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {conv.meta.lastMessage || 'No messages'}
                  </p>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
                    <span style={{ color:'#475569', fontSize:'0.72rem' }}>{conv.messageCount} messages</span>
                    {conv.meta.hasUnread && <span style={{ background:'#8b5cf6', borderRadius:'10px', padding:'1px 8px', color:'white', fontSize:'0.7rem' }}>New</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div style={{ flex:1, padding:'1rem 1.25rem', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <Clock size={16} color="#06b6d4" />
              <span style={{ color:'#67e8f9', fontSize:'0.85rem', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em' }}>All Appointments</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {allAppointments.map(a => (
                <div key={a.id} style={{ padding:'0.75rem', borderRadius:'10px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
                    <span style={{ color:'white', fontWeight:'600', fontSize:'0.85rem' }}>{a.patient_name}</span>
                    <span style={{ background: statusColor(a.payment_status)+'20', color: statusColor(a.payment_status), border:`1px solid ${statusColor(a.payment_status)}40`, borderRadius:'20px', padding:'2px 10px', fontSize:'0.7rem', fontWeight:'600' }}>
                      {a.payment_status}
                    </span>
                  </div>
                  <p style={{ color:'#64748b', fontSize:'0.78rem', margin:0 }}>{a.doctor_name} · {a.specialty}</p>
                  <p style={{ color:'#475569', fontSize:'0.75rem', margin:'2px 0 0' }}>{a.disease} · {a.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
          {!selectedUser ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', opacity:0.4 }}>
              <Users size={64} color="#8b5cf6" />
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'white', fontWeight:'600', fontSize:'1.1rem', margin:0 }}>Select a conversation</p>
                <p style={{ color:'#64748b', fontSize:'0.875rem', margin:'6px 0 0' }}>Choose a patient from the left panel to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding:'1rem 1.5rem', background:'rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontWeight:'700' }}>{(selectedUser.meta.patientName || 'P')[0]}</span>
                </div>
                <div>
                  <h3 style={{ margin:0, color:'white', fontSize:'1rem', fontWeight:'700' }}>{selectedUser.meta.patientName || `Patient #${selectedUser.userId}`}</h3>
                  <p style={{ margin:0, color:'#64748b', fontSize:'0.8rem' }}>ID: {selectedUser.userId}</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, padding:'1.5rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem' }}>
                {messages.length === 0 && <p style={{ color:'#475569', textAlign:'center', fontSize:'0.875rem' }}>No messages yet</p>}
                {messages.map(msg => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id} style={{ display:'flex', flexDirection: isAdmin ? 'row-reverse' : 'row', alignItems:'flex-end', gap:'8px' }}>
                      <div style={{ width:'30px', height:'30px', borderRadius:'50%', background: isAdmin ? 'linear-gradient(135deg,#06b6d4,#0891b2)' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {isAdmin ? <Bot size={14} color="white" /> : <span style={{ color:'white', fontSize:'0.7rem', fontWeight:'700' }}>{(msg.senderName||'P')[0]}</span>}
                      </div>
                      <div style={{ maxWidth:'65%' }}>
                        <div style={{ background: isAdmin ? 'linear-gradient(135deg,#06b6d4,#0891b2)' : 'rgba(255,255,255,0.06)', border: isAdmin ? 'none' : '1px solid rgba(255,255,255,0.08)', color:'white', padding:'0.8rem 1rem', borderRadius: isAdmin ? '16px 16px 0 16px' : '16px 16px 16px 0', fontSize:'0.875rem', lineHeight:'1.5', wordBreak:'break-word' }}>
                          {msg.text}
                        </div>
                        <div style={{ color:'#475569', fontSize:'0.7rem', marginTop:'3px', textAlign: isAdmin ? 'right' : 'left' }}>
                          {msg.senderName} · {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} style={{ padding:'1rem 1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'0.75rem', background:'rgba(0,0,0,0.3)' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Reply to ${selectedUser.meta.patientName || 'patient'}...`}
                  style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(6,182,212,0.3)', borderRadius:'12px', padding:'0.8rem 1.2rem', color:'white', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}
                />
                <button type="submit" disabled={!input.trim() || isSending} style={{ background:'linear-gradient(135deg,#06b6d4,#0891b2)', border:'none', borderRadius:'12px', width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed', opacity: input.trim() && !isSending ? 1 : 0.5, color:'white' }}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
