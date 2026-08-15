import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ActivitySquare } from 'lucide-react';

export default function Auth({ isLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setStep('form');
    setOtpCode('');
    setError('');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isLogin && step === 'form') {
      try {
        const res = await fetch(`http://localhost:8000/register/request-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to request OTP');
        
        setStep('otp');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!isLogin && step === 'otp') {
      try {
        const res = await fetch(`http://localhost:8000/register/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp: otpCode })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'OTP verification failed');
        
        login({ id: data.user_id, name: data.name, email: formData.email, is_admin: data.is_admin }, rememberMe);
        navigate('/app');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Login logic
    try {
      const res = await fetch(`http://localhost:8000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      
      login({ id: data.user_id, name: data.name, email: formData.email, is_admin: data.is_admin }, rememberMe);
      if (data.is_admin) {
        navigate('/admin');
      } else {
        navigate('/app');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
      
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
          <ActivitySquare size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Welcome Back' : (step === 'otp' ? 'Verify Email' : 'Create Account')}
        </h2>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 'otp' ? (
            <div className="input-group">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5', textAlign: 'center' }}>
                We've sent a 6-digit verification code to <strong style={{ color: 'var(--text-primary)' }}>{formData.email}</strong>.
              </p>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={16} /> Verification Code
              </label>
              <input 
                type="text" 
                className="input-field" 
                required 
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
              />
            </div>
          ) : (
            <>
              {!isLogin && (
                <div className="input-group">
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} /> Email Address
                </label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={16} /> Password
                </label>
                <input 
                  type="password" 
                  className="input-field" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ 
                  accentColor: 'var(--accent-primary)', 
                  width: '16px', 
                  height: '16px', 
                  cursor: 'pointer' 
                }}
              />
              <label htmlFor="rememberMe" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                Remember me for 30 days
              </label>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : (step === 'otp' ? 'Verify & Sign Up' : 'Sign Up'))}
          </button>
        </form>

        {step === 'otp' ? (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={() => { setStep('form'); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              {isLogin ? 'Sign up' : 'Login'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
