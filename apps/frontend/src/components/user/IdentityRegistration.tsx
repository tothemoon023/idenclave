import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const IdentityRegistration: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [registering, setRegistering] = useState(false);
  const [did, setDid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulated DID registration (replace with real contract interaction)
  const handleRegisterDID = async () => {
    setRegistering(true);
    setError(null);
    setTimeout(() => {
      setDid(`did:sol:${publicKey?.toBase58() || 'FAKE_DID_1234567890'}`);
      setRegistering(false);
    }, 1200);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(59,130,246,0.08)', padding: 24 }}>
      <h3 style={{ color: '#1e293b', marginBottom: 14, fontWeight: 700 }}>Decentralized Identity Registration</h3>
      <div style={{ marginBottom: 18, color: '#64748b', fontSize: 15 }}>
        Connect your Solana wallet and register a decentralized identity (DID) for use with IDenclave.
      </div>
      <div style={{ marginBottom: 18 }}>
        <WalletMultiButton />
      </div>
      {connected && publicKey && (
        <>
          <div style={{ marginBottom: 10, color: '#2563eb', fontWeight: 500 }}>
            Wallet Connected: <span style={{ fontFamily: 'monospace' }}>{publicKey.toBase58()}</span>
          </div>
          <button
            style={{ background: did ? '#cbd5e1' : '#22c55e', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: did ? 'not-allowed' : 'pointer', marginBottom: 8 }}
            onClick={handleRegisterDID}
            disabled={!!did || registering}
          >
            {registering ? 'Registering...' : did ? 'DID Registered' : 'Register DID'}
          </button>
          {did && (
            <div style={{ marginTop: 10, color: '#16a34a', fontWeight: 600 }}>
              Your DID: <span style={{ fontFamily: 'monospace' }}>{did}</span>
            </div>
          )}
        </>
      )}
      {error && <div style={{ color: '#dc2626', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default IdentityRegistration;
