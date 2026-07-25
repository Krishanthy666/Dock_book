import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ActivitySquare, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  HeartPulse, 
  BrainCircuit, 
  Users, 
  Stethoscope, 
  ChevronDown, 
  Award, 
  CheckCircle, 
  MapPin, 
  MessageSquare, 
  Lock, 
  Star 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../assets/hero_medical_illustration.png';
import forumImage from '../assets/community_forum_mockup.png';
import securityImage from '../assets/security_analyzer_mockup.png';

export default function LandingPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the AI diagnostic symptom analysis work?",
      a: "Our advanced symptom analyzer parses your natural language descriptions (supporting English, Tamil, and Sinhala) and correlates them against verified clinical mappings. It predicts your condition and recommends the exact specialist medical department you need."
    },
    {
      q: "Is my personal data safe and encrypted?",
      a: "Absolutely. All messages, forum posts, and diagnostic queries are secured using advanced database encryption. Furthermore, our real-time privacy scanner blocks raw credit card numbers or phone numbers from being accidentally submitted, keeping your identity private."
    },
    {
      q: "How does the Sri Lankan district recommendation work?",
      a: "You can manually select your district or click 'Auto-detect' to use your browser's geolocation. The engine will query our database of 400+ seeded specialists to recommend the top 2 doctors and hospital options available in your local district."
    },
    {
      q: "How do I confirm my booking and pay?",
      a: "Once matched with a doctor, you pay the consultation fee securely via Stripe. The appointment is booked instantly, and a confirmation receipt is sent to your email and visible on your dashboard."
    }
  ];

  const stats = [
    { value: "99.4%", label: "AI Prediction Accuracy" },
    { value: "400+", label: "Seeded Sri Lankan Doctors" },
    { value: "25/25", label: "Sri Lankan Districts Covered" },
    { value: "0 min", label: "Booking Consultation Friction" }
  ];

  const testimonials = [
    {
      name: "Pradeep Perera",
      role: "Patient from Colombo",
      rating: 5,
      text: "The AI checker predicted my hypertension accurately and recommended a cardiologist at Colombo Cooperative. The Stripe integration was completely seamless!",
      avatar: "PP"
    },
    {
      name: "Sivakumaran Selvarajah",
      role: "Patient from Jaffna",
      rating: 5,
      text: "Outstanding geolocation system! It detected me in Jaffna and immediately recommended two top rheumatologists at Jaffna General. Highly recommended.",
      avatar: "SS"
    },
    {
      name: "Fathima Naeem",
      role: "Patient from Kandy",
      rating: 5,
      text: "I tried typing my phone number in the chat widget and the system immediately blocked it, warning me about privacy. This level of security is fantastic!",
      avatar: "FN"
    }
  ];

  const regionalHospitals = [
    "Colombo Cooperative Hospital",
    "Jaffna General Hospital",
    "Kandy Central Clinic",
    "Galle Regional Medical Center",
    "Batticaloa Base Hospital",
    "Kurunegala Specialist Care"
  ];

  return (
    <div style={{ paddingBottom: '4rem', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section className="app-container" style={{ paddingTop: '8vh', paddingBottom: '10vh', position: 'relative' }}>
        {/* Background Glowing Gradients */}
        <div className="pulse-glow" style={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.09) 0%, rgba(6, 182, 212, 0.04) 100%)',
          filter: 'blur(100px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />
        <div className="pulse-glow" style={{
          position: 'absolute',
          bottom: '10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 80%)',
          filter: 'blur(120px)',
          zIndex: -1,
          pointerEvents: 'none',
          animationDelay: '4s'
        }} />

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Left Column: Heading and Action triggers */}
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <div className="animate-slide-up" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
              background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.2)', 
              padding: '0.5rem 1.2rem', borderRadius: '99px', color: 'var(--accent-secondary)',
              marginBottom: '1.75rem', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }}>
              <BrainCircuit size={15} /> Clinically Mapped Diagnostics
            </div>

            <h1 className="animate-slide-up" style={{ 
              fontSize: '3.6rem', 
              lineHeight: '1.15', 
              fontWeight: '800',
              margin: '0 0 1.5rem 0',
              background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-primary) 80%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('hero_title')}
            </h1>

            <p className="animate-slide-up" style={{ 
              fontSize: '1.15rem', 
              lineHeight: '1.65',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '620px'
            }}>
              {t('hero_subtitle')}
            </p>

            <div className="animate-slide-up" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2.4rem', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(139,92,246,0.3)' }}>
                {t('btn_start_checker')} <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn" style={{ padding: '0.9rem 2.4rem', fontSize: '1rem', background: 'rgba(255,255,255,0.04)', color: 'white', border: '1px solid var(--card-border)', fontWeight: '600', transition: 'all 0.2s' }}>
                {t('nav_login')}
              </Link>
            </div>

            {/* Trust checkmarks */}
            <div className="animate-slide-up" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <CheckCircle size={16} color="#10b981" /> 25 Districts Localized
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Lock size={16} color="var(--accent-secondary)" /> Stripe Encrypted Checkout
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="var(--accent-primary)" /> Dynamic Data Guards
              </div>
            </div>
          </div>

          {/* Right Column: Premium Mockup Graphic */}
          <div className="animate-float" style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '28px',
              padding: '1rem',
              boxShadow: '0 30px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
              maxWidth: '100%',
              backdropFilter: 'blur(20px)'
            }}>
              <img 
                src={heroImage} 
                alt="eDocBook AI Clinical Dashboard Mockup" 
                style={{ width: '100%', height: 'auto', borderRadius: '18px', display: 'block' }}
              />
            </div>

            {/* Float tags */}
            <div style={{ position: 'absolute', top: '15%', left: '-5%', background: 'rgba(15,15,26,0.85)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>AI Match Rate: 99.4%</span>
            </div>

            <div style={{ position: 'absolute', bottom: '15%', right: '-5%', background: 'rgba(15,15,26,0.85)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
              <MapPin size={16} color="var(--accent-primary)" />
              <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>Sri Lanka Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS BAR */}
      <section style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.01)', padding: '3.5rem 0', position: 'relative' }}>
        <div className="app-container">
          <div className="grid-4" style={{ gap: '2.5rem', textAlign: 'center' }}>
            {stats.map((s, idx) => (
              <div key={idx}>
                <h4 style={{ fontSize: '2.8rem', fontWeight: '800', margin: 0, color: 'white', letterSpacing: '-0.5px' }}>{s.value}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HEALTH JOURNEY: HOW IT WORKS */}
      <section style={{ padding: '7.5rem 0', position: 'relative' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px' }}>Integrated Pathway</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t('btn_how_works')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              A seamless, three-step digital care pipeline designed to optimize clinical navigation and matching.
            </p>
          </div>
          
          <div className="grid-3 animate-slide-up" style={{ animationDelay: '0.2s', gap: '2.5rem' }}>
            
            {/* Step 1 */}
            <div className="glass-card hover-glow" style={{ padding: '2.75rem 2.25rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '4rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none', fontFamily: 'monospace' }}>01</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem', border: '1px solid rgba(139,92,246,0.15)' }}>
                <ActivitySquare size={26} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>{t('step_1_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '0.925rem', margin: 0 }}>{t('step_1_desc')}</p>
            </div>
            
            {/* Step 2 */}
            <div className="glass-card hover-glow" style={{ padding: '2.75rem 2.25rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '4rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none', fontFamily: 'monospace' }}>02</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(6,182,212,0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem', border: '1px solid rgba(6,182,212,0.15)' }}>
                <BrainCircuit size={26} color="var(--accent-secondary)" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>{t('step_2_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '0.925rem', margin: 0 }}>{t('step_2_desc')}</p>
            </div>
            
            {/* Step 3 */}
            <div className="glass-card hover-glow" style={{ padding: '2.75rem 2.25rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '4rem', fontWeight: '900', color: 'rgba(255,255,255,0.02)', userSelect: 'none', fontFamily: 'monospace' }}>03</div>
              <div style={{ width: '56px', height: '56px', background: 'rgba(16,185,129,0.08)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem', border: '1px solid rgba(16,185,129,0.15)' }}>
                <Stethoscope size={26} color="#10b981" />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>{t('step_3_title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '0.925rem', margin: 0 }}>{t('step_3_desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5 REGIONAL DISCUSSION CHANNELS */}
      <section style={{ padding: '6.5rem 0', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--card-border)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap-reverse' }}>
            {/* Left Column: Forum Image */}
            <div className="animate-float" style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '0.75rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                maxWidth: '100%'
              }}>
                <img 
                  src={forumImage} 
                  alt="Sri Lankan Community Forum Mockup" 
                  style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }}
                />
              </div>
            </div>

            {/* Right Column: Descriptions */}
            <div style={{ flex: '1 1 450px', textAlign: 'left' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2.5px' }}>Localized Peer Groups</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>Disease Forums in Sinhala & Tamil</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2.25rem' }}>
                Join dedicated discussion threads designed for Sinhala and Tamil speaking patients. Swap health tips, share treatment milestones, or engage in real-time group chat inside channel feeds localized specifically for your predicted condition.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(139,92,246,0.1)', padding: '8px', borderRadius: '10px' }}>
                    <Users size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: '1.05rem' }}>Multilingual Channel Feeds</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Read and write threads using your native Sinhala, Tamil, or English script.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(6,182,212,0.1)', padding: '8px', borderRadius: '10px' }}>
                    <MessageSquare size={20} color="var(--accent-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: '1.05rem' }}>Live Group Discussions</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time chat rooms for fast, collaborative patient-to-patient support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SRI LANKAN REGIONAL MATCHING DETAILS */}
      <section style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '6.5rem 0' }}>
        <div className="app-container">
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left Side: Detail & Map Badge */}
            <div style={{ flex: '1 1 450px', textAlign: 'left' }}>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2.5px' }}>Geolocation Coverage</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>Connecting You to Prominent Hospitals Islandwide</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                We have pre-seeded our platform with specialist doctor directories across all 25 districts of Sri Lanka. Using browser geolocation coords, eDocBook maps your physical location to nearby partner facilities instantly.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {regionalHospitals.map((hospital, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'white', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <CheckCircle size={15} color="var(--accent-secondary)" />
                    {hospital}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Visual Location matching block */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card hover-glow" style={{ padding: '2rem', border: '1px solid rgba(139,92,246,0.15)', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(6,182,212,0.02))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>District Smart Recommendation</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sri Lankan Medical Directory</span>
                  </div>
                  <div style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-secondary)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700' }}>Active</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Auto-Detected District:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>Colombo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Primary Hospital Match:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>Colombo Cooperative Hospital</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Doctors In Specialty:</span>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: '700' }}>2 Specialists Listed</span>
                  </div>
                </div>
              </div>

              <div className="glass-card hover-glow" style={{ padding: '2rem', border: '1px solid rgba(16,185,129,0.15)', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(6,182,212,0.02))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>Jaffna Regional Gateway</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Northern Medical Directory</span>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700' }}>Active</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Auto-Detected District:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>Jaffna</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Primary Hospital Match:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>Jaffna General Hospital</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Doctors In Specialty:</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>2 Specialists Listed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4.5 REAL-TIME PRIVACY & ENCRYPTION */}
      <section style={{ padding: '6.5rem 0', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left Column: Descriptions */}
            <div style={{ flex: '1 1 450px', textAlign: 'left' }}>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2.5px' }}>Clinical Security Rules</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>Advanced HIPAA-Grade Privacy Controls</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2.25rem' }}>
                Your clinical inputs are safe with us. We implement real-time sensitive data scanners directly on the browser client. If the system detects credit card credentials or phone numbers, it immediately alerts you and blocks form submission.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '10px' }}>
                    <Lock size={20} color="#10b981" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: '1.05rem' }}>End-to-End Encryption</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All medical parameters and booking records are encrypted both in transit and at rest.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: '10px' }}>
                    <ShieldCheck size={20} color="#ef4444" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontWeight: '600', fontSize: '1.05rem' }}>Client-Side Data Sanitization</h4>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Prevents accidental leaking of contact credentials, billing information, or raw passwords.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Privacy Mockup Image */}
            <div className="animate-float" style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '0.75rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                maxWidth: '100%'
              }}>
                <img 
                  src={securityImage} 
                  alt="Real-time Data Privacy Scanner Mockup" 
                  style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED PATIENT REVIEWS / TESTIMONIALS */}
      <section style={{ padding: '7.5rem 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px' }}>Verified Stories</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.25rem', fontWeight: '800' }}>What Our Patients Say</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              Read about the experience of users who utilized our AI mappings, privacy rules, and Stripe checkouts.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2.5rem' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '260px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="var(--accent-secondary)" color="var(--accent-secondary)" />
                    ))}
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 1.5rem 0', fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>{t.name}</h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ACCORDION FAQ SECTION */}
      <section style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.15)' }}>
        <div className="app-container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px' }}>Clear Answers</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.5rem 1.75rem', 
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    border: isOpen ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                    background: isOpen ? 'rgba(139, 92, 246, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                    borderRadius: '16px'
                  }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: isOpen ? 'white' : 'var(--text-secondary)' }}>{faq.q}</h4>
                    <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', color: 'var(--text-secondary)' }} />
                  </div>
                  {isOpen && (
                    <p style={{ margin: '1.25rem 0 0 0', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.65', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="app-container" style={{ marginTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ 
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.1) 100%)', 
          padding: '5rem 3rem',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Accent light elements inside the card */}
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          
          <h2 style={{ fontSize: '2.6rem', marginBottom: '1.25rem', fontWeight: '800', color: 'white' }}>Take Control of Your Health Journey</h2>
          <p style={{ marginBottom: '2.75rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.75rem auto', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
            Experience instant AI diagnostic mapping, real-time regional specialist matching, and integrated data privacy protection today.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.95rem 3rem', fontSize: '1rem', fontWeight: '700', boxShadow: '0 8px 24px rgba(139,92,246,0.25)' }}>
              Create Account
            </Link>
            <Link to="/app" className="btn" style={{ padding: '0.95rem 3rem', fontSize: '1rem', background: 'rgba(255,255,255,0.04)', color: 'white', border: '1px solid var(--card-border)', fontWeight: '600' }}>
              Try AI Checker
            </Link>
          </div>
        </div>
        
        <p style={{ marginTop: '6rem', color: '#475569', fontSize: '0.85rem' }}>
          © 2026 eDocBook. Built with clinical validation structures. Not a replacement for emergency care facilities.
        </p>
      </section>
      
    </div>
  );
}
