import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Send, Users, Activity, MessageCircle, FileText, Search } from 'lucide-react';

const CHANNELS = [
  "Flu",
  "Common Cold",
  "COVID-19",
  "Migraine",
  "Asthma",
  "Diabetes",
  "Hypertension",
  "Food Poisoning",
  "Kidney Infection",
  "Arthritis"
];

export default function Community() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialChannel = searchParams.get('channel') || 'Flu';
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  
  // Tabs: 'feed' or 'chat'
  const [activeTab, setActiveTab] = useState('feed');
  
  // Feed States
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Group Chat States
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Sync state with URL search param
  const handleChannelChange = (channel) => {
    setActiveChannel(channel);
    setSearchParams({ channel });
    setSearchQuery('');
  };

  // Fetch posts when channel changes or activeTab is feed
  useEffect(() => {
    if (activeTab === 'feed') {
      fetchPosts();
    }
  }, [activeChannel, activeTab]);

  // Group Chat message retrieval and 3s polling
  useEffect(() => {
    if (activeTab === 'chat') {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChannel, activeTab]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/channels/${activeChannel}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/channels/${activeChannel}/chat`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || isSubmittingPost) return;
    setIsSubmittingPost(true);

    try {
      const res = await fetch(`http://localhost:8000/channels/${activeChannel}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.name,
          content: postContent.trim()
        })
      });
      if (res.ok) {
        setPostContent('');
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8000/channels/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        // Update likes count on screen
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, likes_count: data.likes_count } : post
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/channels/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.name,
          content: commentText.trim()
        })
      });
      if (res.ok) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentInputChange = (postId, val) => {
    setCommentInputs(prev => ({ ...prev, [postId]: val }));
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;
    setIsSendingChat(true);

    try {
      const res = await fetch(`http://localhost:8000/channels/${activeChannel}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.name,
          message: chatInput.trim()
        })
      });
      if (res.ok) {
        setChatInput('');
        fetchChatMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="app-container">
      <header className="header animate-slide-up" style={{ padding: '1rem 0 2rem 0', textAlign: 'left' }}>
        <h1 className="header-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('comm_title')}</h1>
        <p className="header-subtitle" style={{ fontSize: '1rem', maxWidth: '800px' }}>{t('comm_subtitle')}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }} className="grid-2">
        
        {/* Left Sidebar: Channels list */}
        <div className="glass-card animate-slide-up" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', margin: 0, paddingBottom: '0.75rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--accent-primary)" /> Disease Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.5rem' }}>
            {CHANNELS.map(ch => (
              <button
                key={ch}
                onClick={() => handleChannelChange(ch)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeChannel === ch ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  color: activeChannel === ch ? 'white' : 'var(--text-secondary)',
                  borderLeft: activeChannel === ch ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  fontWeight: activeChannel === ch ? '700' : '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                # {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Right Main area: Tabbed Feed & Group Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Channel Header and Tab Switcher */}
          <div className="glass-card animate-slide-up" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-secondary)" /> {t('comm_active_channel')}: <strong style={{ color: 'var(--accent-secondary)' }}>#{activeChannel}</strong>
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setActiveTab('feed')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'feed' ? 'var(--accent-primary)' : 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={16} /> {t('comm_tab_feed')}
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'chat' ? 'var(--accent-secondary)' : 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <MessageCircle size={16} /> {t('comm_tab_chat')}
              </button>
            </div>
          </div>

          {/* Tab 1: Forum Feed */}
          {activeTab === 'feed' && (
            <>
              {/* Post Creation Card */}
              <div className="glass-card animate-slide-up" style={{ padding: '1.5rem' }}>
                <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <textarea
                    className="input-field"
                    placeholder={t('comm_write_post')}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{ minHeight: '80px', fontSize: '0.95rem' }}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ alignSelf: 'flex-end', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                    disabled={!postContent.trim() || isSubmittingPost}
                  >
                    {t('comm_btn_post')}
                  </button>
                </form>
              </div>

              {/* Feed Search Bar */}
              <div className="glass-card animate-slide-up" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={18} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder={t('comm_search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Posts Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <div key={post.id} className="glass-card animate-slide-up" style={{ 
                      padding: '1.5rem', 
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {/* Post Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {post.user_name[0].toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{post.user_name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{post.created_at}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p style={{ fontSize: '1rem', lineHeight: '1.5', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: '0 0 1.25rem 0' }}>
                        {post.content}
                      </p>

                      {/* Like/Comment Summary Buttons */}
                      <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0', marginBottom: '1.25rem' }}>
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            transition: 'color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#10b981'}
                          onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                          <ThumbsUp size={16} /> {t('comm_like')} ({post.likes_count})
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <MessageSquare size={16} /> {t('comm_comments')} ({post.comments.length})
                        </span>
                      </div>

                      {/* Comments list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {post.comments.map(comment => (
                          <div key={comment.id} style={{ 
                            background: 'rgba(0, 0, 0, 0.2)', 
                            padding: '0.75rem 1rem', 
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.02)',
                            alignSelf: 'flex-start',
                            minWidth: '250px',
                            maxWidth: '90%'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>{comment.user_name}</strong>
                              <span style={{ fontSize: '0.7rem', color: '#475569' }}>{comment.created_at.split(' ')[1]}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <form onSubmit={(e) => handleAddComment(e, post.id)} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="input-field"
                          placeholder={t('comm_add_comment')}
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', margin: 0 }}
                          required
                        />
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          style={{ width: '42px', height: '38px', padding: 0, borderRadius: '10px' }}
                          disabled={!(commentInputs[post.id] || '').trim()}
                        >
                          <Send size={15} />
                        </button>
                      </form>

                    </div>
                  ))
                ) : (
                  <div className="glass-card text-center" style={{ padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.3, margin: '0 auto 1.5rem auto', display: 'block' }} />
                    No posts found matching your search.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab 2: Group Chat */}
          {activeTab === 'chat' && (
            <div className="glass-card animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '550px' }}>
              
              {/* Chat Messages Log */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.25rem' }}>
                {chatMessages.length > 0 ? (
                  chatMessages.map(msg => {
                    const isSelf = msg.user_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isSelf ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isSelf ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {!isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: '600', marginBottom: '3px', marginLeft: '6px' }}>{msg.user_name}</span>}
                        <div style={{
                          background: isSelf ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: isSelf ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '0.75rem 1rem',
                          borderRadius: isSelf ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          color: 'white',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>
                          {msg.message}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#475569', marginTop: '3px', marginRight: isSelf ? '6px' : '0', marginLeft: !isSelf ? '6px' : '0' }}>{msg.created_at}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <MessageCircle size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>Welcome to the #{activeChannel} chat room! Say hello to other patients.</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Send Input Form */}
              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('comm_chat_placeholder')}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{ margin: 0 }}
                  required
                />
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '48px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={!chatInput.trim() || isSendingChat}
                >
                  <Send size={18} />
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
