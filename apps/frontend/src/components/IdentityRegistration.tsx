import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const IdentityRegistration: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setRegistering(true);
    setError(null);
    try {
      // Simulate registration process (replace with real logic later)
      await new Promise((res) => setTimeout(res, 1200));
      setRegistered(true);
      setShowModal(true);
    } catch (e) {
      setError('Registration failed. Please try again.');
    }
    setRegistering(false);
  };

  if (!connected) {
    return (
      <section className="identity-registration" style={{ background: '#f8fafc', color: '#1e293b', border: '2px dashed #6366f1' }}>
        <h2>Identity Registration</h2>
        <p>Please connect your wallet to register your decentralized identity.</p>
      </section>
    );
  }

  return (
    <section className="identity-registration">
      <h2>Identity Registration</h2>
      <p>Register your wallet address as your decentralized identity.</p>
      <button
        className="cta"
        onClick={handleRegister}
        disabled={registering || registered}
        style={{ minWidth: 180 }}
      >
        {registered ? 'Registered' : registering ? 'Registering...' : 'Register Identity'}
      </button>

      {error && (
        <div className="error-msg" style={{ marginTop: 12, color: '#ef4444', fontWeight: 600 }}>
          {error}
        </div>
      )}
      {/* Modal for registration success */}
      {showModal && (
        <div className="ireg-modal-overlay" role="dialog" aria-modal="true">
          <div className="ireg-modal">
            <h3>Registration Successful!</h3>
            <p>Your wallet is now registered as a decentralized identity.</p>
            <button onClick={() => setShowModal(false)} autoFocus>OK</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default IdentityRegistration;
