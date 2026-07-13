import { Link } from 'react-router-dom';
import { ActivitySquare, ArrowRight, ShieldCheck, Clock, HeartPulse, BrainCircuit, Users, Stethoscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* HERO SECTION */}
      <div className="app-container" style={{ alignItems: 'center', textAlign: 'center', paddingTop: '12vh', paddingBottom: '8vh' }}>
        <div className="animate-slide-up" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
            background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', 
            padding: '0.5rem 1rem', borderRadius: '99px', color: 'var(--accent-primary)',
            marginBottom: '2rem', fontWeight: '600', fontSize: '0.9rem'
          }}>
          <BrainCircuit size={16} /> Powered by Advanced AI
        </div>
        
        <h1 className="header-title animate-slide-up" style={{ fontSize: '4.5rem', animationDelay: '0.1s', lineHeight: '1.1' }}>
          {t('hero_title')}
        </h1>
        
        <p className="header-subtitle animate-slide-up" style={{ maxWidth: '650px', margin: '1.5rem auto 3rem auto', animationDelay: '0.2s', fontSize: '1.25rem', lineHeight: '1.6' }}>
          {t('hero_subtitle')}
        </p>
        
        <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animationDelay: '0.3s' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            {t('btn_start_checker')} <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--card-border)' }}>
            {t('nav_login')}
          </Link>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '5rem 0', marginTop: '2rem' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('btn_how_works')}</h2>
            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Three simple steps to better health</p>
          </div>
          
          <div className="grid-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', border: '1px solid var(--card-border)' }}>
                <ActivitySquare size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{t('step_1_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('step_1_desc')}</p>
            </div>
            
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', border: '1px solid var(--card-border)' }}>
                <BrainCircuit size={36} color="var(--accent-secondary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{t('step_2_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('step_2_desc')}</p>
            </div>
            
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', border: '1px solid var(--card-border)' }}>
                <Stethoscope size={36} color="#10b981" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{t('step_3_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{t('step_3_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="app-container" style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Premium Healthcare Features</h2>
          <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Everything you need to manage your health intelligently.</p>
        </div>

        <div className="grid-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(139,92,246,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <HeartPulse size={28} color="var(--accent-primary)" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>State-of-the-Art ML Model</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Trained on extensive medical datasets to provide highly accurate preliminary symptom analysis.</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <ShieldCheck size={28} color="#10b981" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>NHS Verification</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Directly integrates with NHS databases to provide trusted, detailed information about conditions.</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(6,182,212,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <Clock size={28} color="var(--accent-secondary)" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Zero Wait Time</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Skip the general practitioner queue. Get instantly matched with the exact specialist you need.</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(236,72,153,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <Users size={28} color="#ec4899" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Patient Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Track all your past assessments, booked appointments, and health records in one secure place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="app-container" style={{ marginTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.1) 100%)', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to take control of your health?</h2>
          <p className="text-secondary" style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join eDocBook today and experience the future of healthcare.</p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            {t('auth_create_account')}
          </Link>
        </div>
        
        <p style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          © 2026 eDocBook. All rights reserved. Not a replacement for professional emergency medical care.
        </p>
      </div>
    </div>
  );
}

