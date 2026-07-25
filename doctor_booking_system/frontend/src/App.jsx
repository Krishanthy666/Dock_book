import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import Community from './pages/Community';
import LiveChat from './pages/LiveChat';
import AdminChat from './pages/AdminChat';
import ChatWidget from './components/ChatWidget';
import { ActivitySquare, LayoutDashboard, MessageSquare, Users, Stethoscope } from 'lucide-react';

const Navigation = () => {
  const { user } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const location = useLocation();

  if (!user) return null;
  if (location.pathname === '/admin') return null;
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--card-border)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to={user.is_admin ? "/admin" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <ActivitySquare color="var(--accent-primary)" /> {t('logo')}
      </Link>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        {!user.is_admin ? (
          <>
            <Link to="/app" className="nav-link">
              <Stethoscope size={16} /> {t('nav_checker')}
            </Link>
            <Link to="/community" className="nav-link">
              <Users size={16} /> {t('nav_community')}
            </Link>
            <Link to="/live-chat" className="nav-link">
              <MessageSquare size={16} /> {t('nav_live_chat')}
            </Link>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={18} /> {t('nav_dashboard')}
            </Link>
          </>
        ) : (
          <Link to="/admin" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LayoutDashboard size={18} /> Admin Dashboard
          </Link>
        )}
        
        {/* Language Selector */}
        <select 
          value={lang} 
          onChange={(e) => changeLanguage(e.target.value)} 
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            color: 'white',
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            padding: '0.4rem 0.6rem',
            fontSize: '0.85rem',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        >
          <option value="en" style={{ background: '#12121a', color: 'white' }}>English</option>
          <option value="ta" style={{ background: '#12121a', color: 'white' }}>தமிழ் (Tamil)</option>
          <option value="si" style={{ background: '#12121a', color: 'white' }}>සිංහල (Sinhala)</option>
        </select>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Auth isLogin={true} />} />
            <Route path="/register" element={<Auth isLogin={false} />} />
            <Route path="/app" element={<SymptomChecker />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/live-chat" element={<LiveChat />} />
            <Route path="/admin" element={<AdminChat />} />
          </Routes>
          <ChatWidget />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

