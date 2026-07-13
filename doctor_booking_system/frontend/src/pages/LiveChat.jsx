import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, set, off } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Bot, ArrowLeft, User } from 'lucide-react';

export default function LiveChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const chatRef = ref(db, `chats/${user.id}/messages`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      setIsConnected(true);
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data)
          .map(([key, val]) => ({ id: key, ...val }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    }, () => setIsConnected(false));
    return () => off(chatRef);
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const msgText = input.trim();
    setInput('');
    setIsSending(true);
    try {
      await push(ref(db, `chats/${user.id}/messages`), {
        text: msgText,
        sender: 'patient',
        senderName: user.name,
        userId: user.id,
        timestamp: Date.now(),
      });
      await set(ref(db, `chats/${user.id}/meta`), {
        patientName: user.name,
        patientId: user.id,
        lastMessage: msgText,
        lastMessageTime: Date.now(),
        hasUnread: true
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0f1a,#1a0a2e,#0a1628)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ width:'100%', maxWidth:'760px', height:'85vh', display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'24px', overflow:'hidden', boxShadow:'0 25px 80px rgba(0,0,0,0.6)' }}>
        {/* Header */}
        <div style={{ padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(6,182,212,0.2))', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', color:'white', width:'36px', height:'36px', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MessageSquare size={22} color="white" />
          </div>
          <div>
            <h2 style={{ margin:0, color:'white', fontSize:'1.1rem', fontWeight:'700' }}>Live Support Chat</h2>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'2px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: isConnected ? '#10b981' : '#f59e0b', boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }} />
              <span style={{ color: isConnected ? '#6ee7b7' : '#fbbf24', fontSize:'0.8rem' }}>
                {isConnected ? 'Connected — Support team is available' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, padding:'1.5rem', overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem' }}>
          {messages.length === 0 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem', opacity:0.5 }}>
              <MessageSquare size={48} color="#8b5cf6" />
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'white', margin:0, fontWeight:'600' }}>Start a conversation</p>
                <p style={{ color:'#64748b', fontSize:'0.875rem', margin:'4px 0 0' }}>Send a message and our support team will reply shortly</p>
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender === 'patient';
            return (
              <div key={msg.id} style={{ display:'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems:'flex-end', gap:'10px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', background: isMe ? 'linear-gradient(135deg,#8b5cf6,#7c3aed)' : 'linear-gradient(135deg,#06b6d4,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {isMe ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                </div>
                <div style={{ maxWidth:'70%' }}>
                  <div style={{ background: isMe ? 'linear-gradient(135deg,#8b5cf6,#7c3aed)' : 'rgba(255,255,255,0.06)', border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)', color:'white', padding:'0.875rem 1.1rem', borderRadius: isMe ? '18px 18px 0 18px' : '18px 18px 18px 0', fontSize:'0.9rem', lineHeight:'1.5', wordBreak:'break-word' }}>
                    {msg.text}
                  </div>
                  <div style={{ color:'#475569', fontSize:'0.72rem', marginTop:'4px', textAlign: isMe ? 'right' : 'left' }}>
                    {msg.senderName} · {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'0.75rem', background:'rgba(0,0,0,0.3)' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to support..."
            style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:'12px', padding:'0.875rem 1.25rem', color:'white', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}
          />
          <button type="submit" disabled={!input.trim() || isSending} style={{ background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', border:'none', borderRadius:'12px', width:'50px', height:'50px', display:'flex', alignItems:'center', justifyContent:'center', cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed', opacity: input.trim() && !isSending ? 1 : 0.5, color:'white' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
