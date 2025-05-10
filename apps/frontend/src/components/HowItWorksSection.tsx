import React from 'react';

const steps = [
  {
    icon: '👛',
    title: 'Connect Your Wallet',
    description: 'Connect your Solana wallet (like Phantom) to create your decentralized identity.',
    color: '#6366f1'
  },
  {
    icon: '🔑',
    title: 'Register Your DID',
    description: 'Your wallet address becomes your unique decentralized identity (DID) on Solana.',
    color: '#3b82f6'
  },
  {
    icon: '📜',
    title: 'Issue Credentials',
    description: 'Create and store verifiable credentials (like "Over 18" or "KYC passed") securely on IPFS.',
    color: '#8b5cf6'
  },
  {
    icon: '🔒',
    title: 'Zero-Knowledge Proofs',
    description: 'Generate proofs to verify claims without revealing sensitive data.',
    color: '#ec4899'
  },
  {
    icon: '✅',
    title: 'Instant Verification',
    description: 'Verifiers can instantly check proofs and credentials for trustless verification.',
    color: '#10b981'
  }
];

const HowItWorksSection: React.FC = () => (
  <section
    style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      borderRadius: '1.5rem',
      padding: '3rem 2rem',
      margin: '2rem auto',
      maxWidth: 800,
      boxShadow: '0 4px 24px rgba(75, 63, 114, 0.08)',
      color: '#333',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative Elements */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #6366f1, #3b82f6, #8b5cf6, #ec4899, #10b981)',
    }} />
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '-10%',
      width: '200px',
      height: '200px',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.1))',
      borderRadius: '50%',
      filter: 'blur(40px)',
      zIndex: 0,
    }} />
    <div style={{
      position: 'absolute',
      bottom: '20%',
      left: '-10%',
      width: '200px',
      height: '200px',
      background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))',
      borderRadius: '50%',
      filter: 'blur(40px)',
      zIndex: 0,
    }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: 800,
        color: '#4B3F72',
        marginBottom: '2rem',
        background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        How It Works
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '0 auto',
        maxWidth: 600,
      }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              background: 'rgba(255,255,255,0.8)',
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 12px rgba(59,130,246,0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.12)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,130,246,0.08)';
            }}
          >
            <div style={{
              fontSize: '2rem',
              background: `${step.color}15`,
              color: step.color,
              width: '60px',
              height: '60px',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {step.icon}
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                color: '#4B3F72',
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}>
                {step.title}
              </h3>
              <p style={{
                color: '#475569',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection; 