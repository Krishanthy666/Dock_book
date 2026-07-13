import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Stethoscope, Activity, User, Users, Calendar, X, CheckCircle, ChevronRight, ExternalLink, CreditCard, Lock, Star, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const stripePromise = loadStripe("pk_test_51TZ9OHCbniPMzR40qE9NTHgkNENMyNxRPjz5m34KJpE8K4HOOY0Bh4KwkoJjkhgWAK0vEij235uLjgaasQ1sK3zO00vJmjO9Z6");

const CARD_STYLE = {
  style: {
    base: {
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      '::placeholder': { color: '#475569' },
      iconColor: '#8b5cf6',
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

function PaymentForm({ doctor, analysisResult, symptoms, user, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // form | processing | success
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setCardError('');

    try {
      // 1. Create payment intent on backend
      const intentRes = await fetch('http://localhost:8000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: Math.round(doctor.fee * 100),
          doctor_name: doctor.name
        })
      });
      if (!intentRes.ok) throw new Error('Failed to create payment intent');
      const { client_secret, payment_intent_id } = await intentRes.json();

      // 2. Confirm card payment client-side
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user.name, email: user.email }
        }
      });

      if (error) {
        setCardError(error.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentStep('processing');
        // 3. Book appointment with payment confirmation
        const bookRes = await fetch('http://localhost:8000/book-with-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            doctor_id: doctor.id,
            disease: analysisResult.disease,
            symptoms,
            payment_intent_id: paymentIntent.id
          })
        });
        if (!bookRes.ok) throw new Error('Booking failed after payment');
        const bookData = await bookRes.json();
        setPaymentStep('success');
        setTimeout(() => onSuccess(bookData.appointment_id), 2500);
      }
    } catch (err) {
      setCardError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem auto', display: 'block' }} />
        <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>{t('pay_success')}</h2>
        <p style={{ color: '#6ee7b7', fontWeight: '600', marginBottom: '0.5rem' }}>{t('pay_confirmed')}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          {t('pay_email_sent')} <strong style={{ color: 'white' }}>{user.email}</strong>.<br />
          {t('pay_redirect')}
        </p>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }}>
          <CreditCard size={28} color="white" />
        </div>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>{t('pay_processing')}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('pay_wait')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Summary */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{t('pay_summary')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
            <Star size={14} fill="#fbbf24" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{doctor.rating}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { label: t('pay_patient'), value: user.name },
            { label: t('pay_doctor'), value: doctor.name },
            { label: t('pay_specialty'), value: doctor.specialty },
            { label: t('pay_condition'), value: analysisResult.disease },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{value}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontWeight: '600' }}>{t('pay_total')}</span>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1.3rem' }}>${doctor.fee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('pay_card_details')}
        </label>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '12px', padding: '1rem 1.2rem' }}>
          <CardElement options={CARD_STYLE} />
        </div>
        {cardError && (
          <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ⚠️ {cardError}
          </p>
        )}
      </div>

      {/* Security note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px' }}>
        <Lock size={14} color="#10b981" />
        <span style={{ color: '#6ee7b7', fontSize: '0.8rem' }}>Secured by Stripe · Your card data is never stored on our servers</span>
      </div>

      {/* Test card hint */}
      <div style={{ marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '10px' }}>
        <p style={{ color: '#a78bfa', fontSize: '0.75rem', margin: 0 }}>
          🧪 <strong>Test Card:</strong> 4242 4242 4242 4242 · Any future date · Any 3-digit CVC
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: '100%',
          padding: '1rem',
          background: !stripe || isProcessing ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: !stripe || isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s'
        }}
      >
        <CreditCard size={20} />
        {isProcessing ? t('pay_processing') : `${t('pay_btn_pay')} ($${doctor.fee.toFixed(2)})`}
      </button>
    </form>
  );
}

export default function SymptomChecker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioPlay, setAudioPlay] = useState(null);

  // Auto re-analyze when user switches language
  useEffect(() => {
    if (analysisResult && symptoms.trim()) {
      reAnalyze();
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (audioPlay) {
        audioPlay.pause();
      }
    };
  }, [audioPlay]);

  const reAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, lang })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        fetchDoctors(data.specialist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      if (audioPlay) {
        audioPlay.pause();
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!analysisResult) return;
      
      const speechText = `${t('check_predicted_disease')}: ${analysisResult.disease}. ${t('check_advice')}: ${analysisResult.advice}`;
      
      // Google TTS works beautifully on all platforms for Tamil, Sinhala, and English!
      const gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(speechText)}`;
      const audio = new Audio(gttsUrl);
      setAudioPlay(audio);
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        // Local Web Speech API Fallback
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'si' ? 'si-LK' : 'en-US';
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      };
      
      setIsSpeaking(true);
      audio.play();
    }
  };

  if (!user) return null;

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setDoctors([]);
    try {
      const res = await fetch('http://localhost:8000/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, lang })
      });
      if (!res.ok) throw new Error('Failed to analyze symptoms');
      const data = await res.json();
      setAnalysisResult(data);
      
      // Store analysis history in localStorage
      const history = JSON.parse(localStorage.getItem('symptom_history') || '[]');
      const newRecord = {
        id: Date.now(),
        symptoms: symptoms,
        disease: data.disease,
        specialist: data.specialist,
        advice: data.advice,
        date: new Date().toLocaleDateString()
      };
      localStorage.setItem('symptom_history', JSON.stringify([newRecord, ...history].slice(0, 5)));

      fetchDoctors(data.specialist);
    } catch (err) {
      alert('An error occurred while analyzing symptoms.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchDoctors = async (specialty) => {
    setIsLoadingDoctors(true);
    try {
      const res = await fetch(`http://localhost:8000/doctors?specialty=${encodeURIComponent(specialty)}`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handlePaymentSuccess = (apptId) => {
    setAppointmentId(apptId);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoctor(null);
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="app-container">
      <header className="header animate-slide-up" style={{ padding: '1rem 0 3rem 0' }}>
        <h1 className="header-title" style={{ fontSize: '2.5rem' }}>{t('check_title')}</h1>
        <p className="header-subtitle">{t('hero_subtitle')}</p>
      </header>

      <div className="grid-2">
        {/* Left: Symptom Input & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={24} color="var(--accent-primary)" />
              {t('step_1_title')}
            </h2>
            <form onSubmit={handleAnalyze}>
              <div className="input-group">
                <textarea
                  className="input-field"
                  placeholder={t('check_placeholder')}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isAnalyzing || !symptoms.trim()}>
                {isAnalyzing ? t('check_analyzing') : t('check_btn_analyze')}
                {!isAnalyzing && <ChevronRight size={20} />}
              </button>
            </form>
          </div>

          {analysisResult && (
            <div className="glass-card animate-slide-up">
              <div className="result-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="result-badge">{t('check_report_title')}</span>
                  <button
                    onClick={toggleSpeech}
                    style={{
                      background: isSpeaking ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isSpeaking ? '#ef4444' : 'var(--text-secondary)',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    title={isSpeaking ? "Stop Speaking" : "Read Care Advice"}
                  >
                    {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
                <h3 className="disease-title" style={{ marginTop: 0 }}>{analysisResult.disease}</h3>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                  <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Stethoscope size={20} /> {t('check_rec_specialist')}
                  </h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{analysisResult.specialist_translated}</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{t('check_advice')}</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{analysisResult.advice}</p>
                </div>
                {analysisResult.nhs_url && (
                  <a href={analysisResult.nhs_url} target="_blank" rel="noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.05)', width: '100%', color: 'white', border: '1px solid var(--card-border)' }}>
                    {t('check_nhs_btn')} <ExternalLink size={18} />
                  </a>
                )}
                <button
                  onClick={() => navigate(`/community?channel=${encodeURIComponent(analysisResult.disease_raw)}`)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Users size={18} /> {t('comm_join_btn')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Doctors */}
        <div>
          {analysisResult && (
            <div className="glass-card animate-slide-up" style={{ height: '100%' }}>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={24} color="var(--accent-secondary)" />
                {t('check_doc_avail')}
              </h2>
              {isLoadingDoctors ? (
                <div className="text-center mt-8 text-secondary">Finding the best doctors for you...</div>
              ) : doctors.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {doctors.map(doctor => (
                    <div key={doctor.id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem' }}>
                      <div className="doctor-card">
                        <div className="doctor-header">
                          <h3 className="doctor-name">{doctor.name}</h3>
                          <span style={{ fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Star size={14} fill="#10b981" color="#10b981" /> {doctor.rating}
                          </span>
                        </div>
                        <span className="doctor-specialty">{doctor.specialty}</span>
                        <div className="doctor-meta">
                          <span>{t('check_fee')}: <strong style={{ color: '#10b981' }}>${doctor.fee}</strong></span>
                        </div>
                        <button
                          className="btn btn-primary mt-4"
                          style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <CreditCard size={18} /> {t('check_btn_book')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center mt-8 text-secondary" style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  No doctors found for this specialty at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-slide-up" style={{ maxWidth: '520px', width: '90vw' }}>
            {!bookingSuccess && (
              <button className="close-btn" onClick={() => setSelectedDoctor(null)}>
                <X size={24} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('check_btn_book')}</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>with {selectedDoctor.name}</p>
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm
                doctor={selectedDoctor}
                analysisResult={analysisResult}
                symptoms={symptoms}
                user={user}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
