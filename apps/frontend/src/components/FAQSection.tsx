import React from 'react';

const FAQSection: React.FC = () => (
  <section
    style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      borderRadius: '1.5rem',
      padding: '2.5rem 2rem',
      margin: '2rem auto',
      maxWidth: 700,
      boxShadow: '0 4px 24px rgba(75, 63, 114, 0.08)',
      color: '#333',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#4B3F72', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
    <div className="faq-list">
      <div className="faq-item">
        <h3>What is IDenclave?</h3>
        <p>IDenclave is a decentralized identity and credential management system built on Solana. It allows users to create and manage their digital identity, issue verifiable credentials, and share proofs without revealing sensitive information.</p>
      </div>
      
      <div className="faq-item">
        <h3>How does zero-knowledge proof work?</h3>
        <p>Zero-knowledge proofs allow you to prove something is true without revealing the underlying data. For example, you can prove you're over 18 without sharing your actual birth date, or prove you have a valid credential without revealing all its details.</p>
      </div>
      
      <div className="faq-item">
        <h3>Is my data secure?</h3>
        <p>Yes! Your data is encrypted and stored on IPFS, with only the necessary information stored on-chain. Your private keys never leave your device, and you have full control over what information you share and with whom.</p>
      </div>
      
      <div className="faq-item">
        <h3>How do I get started?</h3>
        <p>First, connect your Solana wallet. Then, you can register your decentralized identity (DID), issue credentials, and start using zero-knowledge proofs for verification. Check out our "How It Works" section for detailed steps.</p>
      </div>
      
      <div className="faq-item">
        <h3>What wallets are supported?</h3>
        <p>Currently, we support Phantom wallet, with plans to add more Solana wallet options in the future. Make sure you have some SOL in your wallet for transaction fees.</p>
      </div>
    </div>
  </section>
);

export default FAQSection; 