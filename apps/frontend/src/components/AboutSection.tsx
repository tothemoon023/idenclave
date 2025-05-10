import React from 'react';

const AboutSection: React.FC = () => (
  <section
    style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      borderRadius: '1.5rem',
      padding: '2.5rem 2rem',
      margin: '2rem auto',
      maxWidth: 700,
      boxShadow: '0 4px 24px rgba(75, 63, 114, 0.08)',
      color: '#333',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#4B3F72', marginBottom: '1rem' }}>About IDenclave</h2>
    <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: '#444' }}>
      <b>IDenclave</b> empowers users with privacy-preserving, decentralized identity and verifiable credentials on Solana. Our mission is to give everyone control over their digital identity, enabling secure, selective sharing of credentials and zero-knowledge proofs for a safer, more open web.
    </p>
  </section>
);

export default AboutSection;
