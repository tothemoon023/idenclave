import React, { useState } from 'react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  if (!open) return null;

  const steps = [
    {
      title: "Welcome to IDenclave! 👋",
      description: "Let's get you started with decentralized identity and credentials on Solana.",
      icon: "🎉"
    },
    {
      title: "Connect Your Wallet",
      description: "First, connect your Solana wallet (like Phantom) to create your decentralized identity.",
      icon: "👛"
    },
    {
      title: "Register Your DID",
      description: "Your wallet address becomes your unique decentralized identity (DID) on Solana.",
      icon: "🔑"
    },
    {
      title: "Issue Credentials",
      description: "Create and store verifiable credentials (like 'Over 18' or 'KYC passed') securely on IPFS.",
      icon: "📜"
    },
    {
      title: "Zero-Knowledge Proofs",
      description: "Generate proofs to verify claims without revealing sensitive data.",
      icon: "🔒"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(30,41,59,0.32)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.25s',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 16px 48px rgba(99,102,241,0.16)',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        minWidth: 320,
        maxWidth: 420,
        width: '90vw',
        textAlign: 'center',
        position: 'relative',
        animation: 'popIn 0.22s',
      }}>
        <button
          onClick={onClose}
          aria-label="Close help modal"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#64748b',
            cursor: 'pointer',
            fontWeight: 700,
            transition: 'color 0.2s',
            padding: 4,
          }}
          onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}
          onMouseOut={e => e.currentTarget.style.color = '#64748b'}
        >
          ×
        </button>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 24,
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: index <= currentStep ? '#6366f1' : '#e2e8f0',
                transition: 'all 0.3s ease',
                transform: index === currentStep ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: 16,
            animation: 'bounceIn 0.5s',
          }}>
            {steps[currentStep].icon}
          </div>
          <h2 style={{
            color: '#4B3F72',
            fontWeight: 800,
            fontSize: '1.8rem',
            marginBottom: 12,
            background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {steps[currentStep].title}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            marginBottom: 18,
          }}>
            {steps[currentStep].description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '0.8rem',
                padding: '0.8rem 1.6rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.8rem',
              padding: '0.8rem 1.6rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 100,
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popIn { 0% { transform: scale(0.92); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default HelpModal; 