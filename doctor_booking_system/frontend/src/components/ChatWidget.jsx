import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { hasSensitiveData, getSensitiveDataWarning } from '../utils/security';

export default function ChatWidget() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Reset/Translate welcome message when language changes
  useEffect(() => {
    setMessages([
      { text: t('chat_widget_welcome'), isUser: false }
    ]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, lang })
      });
      if (!res.ok) throw new Error('Failed to chat');
      const data = await res.json();

      // If the intent is live_chat, show a "Talk to Human" button message
      if (data.intent === 'live_chat') {
        setMessages((prev) => [
          ...prev,
          {
            text: data.response,
            isUser: false,
            showLiveChatBtn: true
          }
        ]);
      } else {
        setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveChatRedirect = () => {
    setIsOpen(false);
    navigate('/live-chat');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(139,92,246,0.5)', position: 'relative' }}
        >
          <MessageSquare size={26} />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: '#10b981', borderRadius: '50%', border: '2px solid #0f0f1a', animation: 'pulse 2s infinite' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card animate-slide-up" style={{ width: '370px', height: '520px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 12px 60px rgba(0,0,0,0.7)' }}>
          {/* Header */}
          <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot size={22} />
              <div>
                <span style={{ fontWeight: '700', fontSize: '1rem', display: 'block' }}>{t('chat_widget_title')}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Powered by ML · 17 intents trained</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, padding: '4px' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  background: msg.isUser ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                  border: msg.isUser ? 'none' : '1px solid var(--card-border)',
                  color: 'white',
                  padding: '0.8rem 1.1rem',
                  borderRadius: msg.isUser ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.9rem',
                  lineHeight: '1.45',
                  marginLeft: msg.isUser ? 'auto' : 0,
                }}>
                  {msg.text}
                </div>
                {msg.showLiveChatBtn && (
                  <button
                    onClick={handleLiveChatRedirect}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', borderRadius: '10px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', fontFamily: 'inherit' }}
                  >
                    <Users size={16} /> {t('dash_btn_live_chat')} →
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)', padding: '0.8rem 1.1rem', borderRadius: '16px 16px 16px 0', fontSize: '0.9rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.4)' }}>
            {hasSensitiveData(input) && (
              <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.25rem', padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {getSensitiveDataWarning(input)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder={t('chat_widget_placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ 
                  padding: '0.75rem 1rem', 
                  fontSize: '0.875rem', 
                  margin: 0,
                  borderColor: hasSensitiveData(input) ? '#ef4444' : 'var(--card-border)',
                  boxShadow: hasSensitiveData(input) ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '45px', height: '42px', padding: 0, borderRadius: '10px', flexShrink: 0 }} 
                disabled={!input.trim() || isLoading || hasSensitiveData(input)}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', opacity: 0.8, textAlign: 'center', marginTop: '2px' }}>
              🔒 Chats are encrypted. Do not share contact details or card info.
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

