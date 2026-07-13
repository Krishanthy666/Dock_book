import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Activity, LogOut, MessageSquare, CreditCard, CheckCircle, Clock, FileText, ChevronRight, Heart, Award, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments'); // appointments | history | tips
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchAppointments();
    
    // Load symptom checker history
    const history = JSON.parse(localStorage.getItem('symptom_history') || '[]');
    setSymptomHistory(history);
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/my-appointments/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  if (!user) return null;

  const paidCount = appointments.filter(a => a.payment_status === 'paid').length;

  const paymentBadge = (status) => {
    const map = {
      paid: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.35)', icon: <CheckCircle size={12} />, label: 'Paid' },
      pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)', icon: <Clock size={12} />, label: 'Pending' },
      failed: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.35)', icon: null, label: 'Failed' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {s.icon}{s.label}
      </span>
    );
  };

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="app-container animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            {getGreeting()}
          </span>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>
            {user.name} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {t('dash_title')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/live-chat')}
            className="btn"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'white', 
              border: '1px solid var(--card-border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem'
            }}
          >
            <MessageSquare size={16} /> {t('dash_btn_live_chat')}
          </button>
          <button 
            onClick={handleLogout} 
            className="btn" 
            style={{ 
              background: 'rgba(239,68,68,0.1)', 
              color: '#fca5a5', 
              border: '1px solid rgba(239,68,68,0.2)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={16} /> {t('nav_logout')}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', alignItems: 'start' }} className="grid-2">
        
        {/* Left Side: Navigation Tabs & Tab Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Dashboard Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            background: 'rgba(0,0,0,0.2)', 
            padding: '4px', 
            borderRadius: '14px',
            border: '1px solid var(--card-border)',
            alignSelf: 'flex-start'
          }}>
            {[
              { id: 'appointments', label: 'Appointments', icon: <Calendar size={16} /> },
              { id: 'history', label: 'Symptom Assessments', icon: <FileText size={16} /> },
              { id: 'tips', label: 'Health Center', icon: <Heart size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Appointments Panel */}
          {activeTab === 'appointments' && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="var(--accent-primary)" /> Scheduled Appointments
                </h2>
                <button onClick={() => navigate('/app')} className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                  {t('dash_new_booking')}
                </button>
              </div>

              {isLoading ? (
                <p className="text-secondary">Loading appointments...</p>
              ) : appointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {appointments.map((appt) => (
                    <div key={appt.id} className="glass-card" style={{ 
                      background: 'rgba(255, 255, 255, 0.01)', 
                      padding: '1.25rem', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          color: 'var(--accent-primary)',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {appt.doctor_name.replace('Dr. ', '')[0]}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem' }}>{appt.doctor_name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{appt.specialty}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '150px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <strong>{t('dash_table_condition')}:</strong> {appt.disease}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {appt.date}
                        </span>
                      </div>

                      <div>
                        {paymentBadge(appt.payment_status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px dashed var(--card-border)' }}>
                  <Calendar size={40} color="#475569" style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('dash_no_appointments')}</p>
                  <button onClick={() => navigate('/app')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>{t('dash_new_booking')}</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Symptom Assessment History */}
          {activeTab === 'history' && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--accent-secondary)" /> Assessment History
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Your recent AI symptom diagnostics</p>
              </div>

              {symptomHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {symptomHistory.map((item) => (
                    <div key={item.id} className="glass-card" style={{ 
                      background: 'rgba(255,255,255,0.01)', 
                      padding: '1.25rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          background: 'rgba(6, 182, 212, 0.1)', 
                          color: '#22d3ee', 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600'
                        }}>
                          {item.disease}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.date}</span>
                      </div>
                      
                      <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        "{item.symptoms}"
                      </p>

                      <div style={{ 
                        marginTop: '0.5rem', 
                        paddingTop: '0.75rem', 
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Recommended Specialist: <strong style={{ color: 'white' }}>{item.specialist}</strong>
                        </span>
                        <button onClick={() => navigate('/app')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontWeight: '600' }}>
                          Consult Doctor <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px dashed var(--card-border)' }}>
                  <FileText size={40} color="#475569" style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No symptom assessment history available yet.</p>
                  <button onClick={() => navigate('/app')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Assess Symptoms Now</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Health Center */}
          {activeTab === 'tips' && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={20} color="#ef4444" /> Smart Recommendations
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Personalized lifestyle tips based on your health checks</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
                <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '1rem' }}>
                  <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>Routine Activity</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Engaging in 30 minutes of low-impact walking daily maintains cardiovascular performance and mitigates muscle stiffness.</p>
                  </div>
                </div>

                <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '1rem' }}>
                  <div style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>Preventative Health</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Ensure adequate hydration (at least 2.5L daily) and consistent sleep hygiene (7-8 hours) to reinforce immune system metrics.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Stats Summary & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Stats Summaries */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>Summary Metrics</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Bookings</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{appointments.length}</strong>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Paid</span>
              <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>{paidCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pending Payment</span>
              <strong style={{ fontSize: '1.2rem', color: '#f59e0b' }}>{appointments.length - paidCount}</strong>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>Quick Links</h3>
            
            <button 
              onClick={() => navigate('/app')}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              Assess Symptoms Now
            </button>

            <button 
              onClick={() => navigate('/live-chat')}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                border: '1px solid var(--card-border)',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              Support Channel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
