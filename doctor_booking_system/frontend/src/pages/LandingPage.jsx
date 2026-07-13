import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivitySquare, ArrowRight, ShieldCheck, Clock, HeartPulse, BrainCircuit, Users, Stethoscope, ChevronDown, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  
  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is eDocBook AI analysis accurate?",
      a: "Our machine learning model is trained on standard symptom-disease mappings to analyze your inputs. It offers pre-diagnostic care advice and matches you to the correct medical specialist, but is not a replacement for professional clinical diagnosis."
    },
    {
      q: "How does the doctor matching work?",
      a: "Based on the symptoms analyzed by the AI, the platform determines the recommended medical specialty (e.g., Rheumatologist, Cardiologist) and instantly matches you with verified doctors in that field for scheduling and secure booking."
    },
    {
      q: "Are the bookings and payments secure?",
      a: "Yes. All bookings are powered by Stripe, adhering to high-grade industrial payment security. Patient records and history are safely stored in our encrypted databases."
    },
    {
      q: "Can I connect with other patients?",
      a: "Yes! Our platform features disease-specific Community Channels. You can join the forum feed to read/post experiences, comment, like posts, or chat live in real-time with other patients experiencing the same conditions."
    }
  ];

  const stats = [
    { value: "99.4%", label: "AI Prediction Consistency" },
    { value: "10K+", label: "Successful Bookings" },
    { value: "24/7", label: "Virtual Support Availability" },
    { value: "0 min", label: "Average Appointment Waiting Time" }
  ];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      
      {/* 1. HERO SECTION */}
      <section className="app-container" style={{ paddingTop: '10vh', paddingBottom: '8vh', textAlign: 'center', position: 'relative' }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.03) 100%)',
          filter: 'blur(80px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div className="animate-slide-up" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', 
            padding: '0.5rem 1.2rem', borderRadius: '99px', color: 'var(--accent-secondary)',
            marginBottom: '2.5rem', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px'
          }}>
          <BrainCircuit size={15} /> CLINICALLY INFORMED ALGORITHMS
        </div>
        
        <h1 className="header-title animate-slide-up" style={{ 
          fontSize: '3.75rem', 
          animationDelay: '0.1s', 
          lineHeight: '1.2', 
          fontWeight: '800',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {t('hero_title')}
        </h1>
        
        <p className="header-subtitle animate-slide-up" style={{ 
          maxWidth: '700px', 
          margin: '1.5rem auto 3rem auto', 
          animationDelay: '0.2s', 
          fontSize: '1.15rem', 
          lineHeight: '1.6',
          color: 'var(--text-secondary)'
        }}>
          {t('hero_subtitle')}
        </p>
        
        <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animationDelay: '0.3s' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', fontWeight: '600' }}>
            {t('btn_start_checker')} <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', background: 'rgba(255,255,255,0.04)', color: 'white', border: '1px solid var(--card-border)', fontWeight: '600' }}>
            {t('nav_login')}
          </Link>
        </div>
      </section>

      {/* 2. TRUST STATS BAR */}
      <section style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.01)', padding: '3rem 0' }}>
        <div className="app-container">
          <div className="grid-4" style={{ gap: '2rem', textAlign: 'center' }}>
            {stats.map((s, idx) => (
              <div key={idx}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, #ffffff 30%, var(--accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: '500' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HEALTH JOURNEY: HOW IT WORKS */}
      <section style={{ padding: '6rem 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Seamless Integration</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t('btn_how_works')}</h2>
            <p className="text-secondary" style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>An end-to-end medical pre-consultation flow designed for optimal clinical matching.</p>
          </div>
          
          <div className="grid-3 animate-slide-up" style={{ animationDelay: '0.2s', gap: '2.5rem' }}>
            
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none' }}>01</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(139,92,246,0.15)' }}>
                <ActivitySquare size={26} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: '700' }}>{t('step_1_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>{t('step_1_desc')}</p>
            </div>
            
            {/* Step 2 */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none' }}>02</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(6,182,212,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(6,182,212,0.15)' }}>
                <BrainCircuit size={26} color="var(--accent-secondary)" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: '700' }}>{t('step_2_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>{t('step_2_desc')}</p>
            </div>
            
            {/* Step 3 */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none' }}>03</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.15)' }}>
                <Stethoscope size={26} color="#10b981" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: '700' }}>{t('step_3_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>{t('step_3_desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PREMIUM UTILITIES */}
      <section style={{ background: 'rgba(0,0,0,0.15)', padding: '6rem 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Clinical Quality</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: '800' }}>Premium Healthcare Utilities</h2>
            <p className="text-secondary" style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>Designed to deliver institutional-grade medical support to patients.</p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            
            <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <div style={{ background: 'rgba(139,92,246,0.08)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.1)' }}>
                <HeartPulse size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: '700' }}>Advanced ML Classifiers</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>Leverages high-dimensional machine learning arrays to map symptoms directly to recommended care instructions.</p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <div style={{ background: 'rgba(16,185,129,0.08)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)' }}>
                <ShieldCheck size={24} color="#10b981" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: '700' }}>NHS Database Reference</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>Integrates external reference pathways to NHS guideline databases, facilitating verified reading materials.</p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <div style={{ background: 'rgba(6,182,212,0.08)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.1)' }}>
                <Clock size={24} color="var(--accent-secondary)" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: '700' }}>Zero Matching Friction</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>Bypasses typical receptionist bottlenecks by instantly matching predicted concerns with specialist doctor directories.</p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <div style={{ background: 'rgba(236,72,153,0.08)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(236,72,153,0.1)' }}>
                <Users size={24} color="#ec4899" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: '700' }}>Peer Community Forums</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', margin: 0 }}>Provides translation-supported message boards and chat groups for patients to interact and share tips.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ACCORDION FAQ SECTION */}
      <section style={{ padding: '6rem 0' }}>
        <div className="app-container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>FAQ</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isOpen ? '1px solid var(--accent-primary)' : '1px solid var(--card-border)',
                    background: isOpen ? 'rgba(139, 92, 246, 0.02)' : 'rgba(255, 255, 255, 0.01)'
                  }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: isOpen ? 'white' : 'var(--text-secondary)' }}>{faq.q}</h4>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-secondary)' }} />
                  </div>
                  {isOpen && (
                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="app-container" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(6,182,212,0.07) 100%)', 
          padding: '4.5rem 2rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', fontWeight: '800' }}>Ready to take control of your health?</h2>
          <p className="text-secondary" style={{ marginBottom: '2.5rem', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
            Experience instant AI diagnostic mapping, real-time community assistance, and streamlined specialist matching today.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2.8rem', fontSize: '1rem', fontWeight: '600' }}>
            {t('auth_create_account')}
          </Link>
        </div>
        
        <p style={{ marginTop: '5rem', color: '#475569', fontSize: '0.85rem' }}>
          © 2026 eDocBook. Built with clinical validation structures. Not a replacement for emergency care facilities.
        </p>
      </section>
      
    </div>
  );
}
