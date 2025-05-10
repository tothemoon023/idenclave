import React, { useRef } from 'react';
import NavBar from '../components/NavBar';
import AboutSection from '../components/AboutSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const sectionFadeIn = {
  opacity: 0,
  transform: 'translateY(40px)',
  animation: 'fadeInUp 1s forwards',
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Shared style for CTA buttons
  const ctaButtonStyle = {
    background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '1.2rem',
    padding: '1.1rem 2.8rem',
    fontSize: '1.22rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(59,130,246,0.15)',
    letterSpacing: '0.01em',
    textShadow: '0 1px 8px rgba(59,130,246,0.08)',
    borderWidth: 3,
    borderStyle: 'solid',
    borderImage: 'linear-gradient(90deg, #a5b4fc 0%, #6366f1 100%) 1',
    animation: 'glowBorder 2.5s infinite alternate',
    transition: 'all 0.2s ease',
    minWidth: '220px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        background: 'none',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Hero Section */}
        <section style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
          overflow: 'hidden',
        }}>
          {/* Background Gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(59,130,246,0.15), transparent 50%)',
            zIndex: 0,
          }} />

          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.1))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '250px',
            height: '250px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src="/idenclave-logo.svg"
              alt="IDenclave Logo"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(59,130,246,0.18)',
                marginBottom: '1.5rem',
                background: '#fff',
                animation: 'scaleIn 1.1s cubic-bezier(.23,1.02,.47,1.01) 0.2s both',
                padding: '12px',
              }}
            />
            <h1
              style={{
                fontSize: '4rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#4B3F72',
                margin: 0,
                textShadow: '0 2px 12px rgba(59,130,246,0.10)',
                animation: 'scaleIn 1.1s cubic-bezier(.23,1.02,.47,1.01) 0.35s both',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              <span style={{ background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IDenclave</span>
            </h1>
            <p
              style={{
                fontSize: '1.5rem',
                color: '#4B3F72',
                margin: '1.5rem 0 2.5rem 0',
                fontWeight: 500,
                maxWidth: 640,
                textShadow: '0 1px 8px rgba(59,130,246,0.07)',
                fontFamily: 'Inter, Arial, sans-serif',
                letterSpacing: '0.01em',
                animation: 'fadeInUp 1.2s 0.5s both',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              Empowering <span style={{ color: '#6366f1', fontWeight: 700 }}>privacy-preserving</span>, decentralized identity and credentials on <span style={{ color: '#3b82f6', fontWeight: 700 }}>Solana</span>.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              animation: 'fadeInUp 1.2s 0.6s both',
            }}>
              <button
                onClick={handleGetStarted}
                style={ctaButtonStyle}
                onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'}
                onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                aria-label="Get Started with IDenclave"
              >
                Get Started
              </button>
              <WalletMultiButton style={ctaButtonStyle} />
            </div>

            {/* Feature Highlights */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '2rem',
              animation: 'fadeInUp 1.2s 0.7s both',
            }}>
              {[
                { icon: '🔒', text: 'Privacy-Preserving' },
                { icon: '⚡', text: 'Fast & Secure' },
                { icon: '🌐', text: 'Decentralized' },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{feature.icon}</span>
                  <span style={{ color: '#4B3F72', fontWeight: 600 }}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NavBar current="landing" onNavigate={onNavigate} />
        <div ref={aboutRef} style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3.5rem', marginBottom: '2.5rem' }}>
          <div style={{ ...sectionFadeIn, animationDelay: '0.2s' }}><AboutSection /></div>
          <div style={{ ...sectionFadeIn, animationDelay: '0.4s' }}><HowItWorksSection /></div>
          <div style={{ ...sectionFadeIn, animationDelay: '0.6s' }}><FAQSection /></div>
          <div style={{ ...sectionFadeIn, animationDelay: '0.8s' }}><ContactSection /></div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes glowBorder {
          0% { box-shadow: 0 0 0 0 #a5b4fc44, 0 4px 18px rgba(59,130,246,0.15); }
          100% { box-shadow: 0 0 16px 4px #6366f1aa, 0 4px 18px rgba(59,130,246,0.18); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 