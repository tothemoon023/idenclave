import React, { useState, useEffect } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { useProgram, useProvider, getDIDInfo, registerDID } from '../utils/solana';

export const DIDRegistration: React.FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [networkVerified, setNetworkVerified] = useState<boolean>(false);

  // Verify network and balance
  useEffect(() => {
    const verifyNetworkAndBalance = async () => {
      if (!wallet.publicKey || !connection) return;

      try {
        // Check network
        const endpoint = connection.rpcEndpoint;
        const isDevnet = endpoint.includes('devnet');
        setNetworkVerified(isDevnet);

        if (!isDevnet) {
          setError('Please connect to Solana devnet');
          return;
        }

        // Check balance
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);

        if (balance < LAMPORTS_PER_SOL * 0.1) { // Require at least 0.1 SOL
          setError('Insufficient balance. Please ensure you have at least 0.1 SOL');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error verifying network and balance:', err);
        setError('Failed to verify network and balance');
      }
    };

    verifyNetworkAndBalance();
  }, [wallet.publicKey, connection]);

  // Check registration status
  useEffect(() => {
    const checkRegistration = async () => {
      if (!wallet.publicKey || !program) return;
      
      try {
        const didInfo = await getDIDInfo(program, wallet.publicKey);
        setIsRegistered(didInfo !== null);
      } catch (err) {
        console.error('Error checking registration:', err);
        setError('Failed to check registration status');
      }
    };

    if (wallet.publicKey) {
      checkRegistration();
    }
  }, [wallet.publicKey, program]);

  const handleRegisterDID = async () => {
    if (isRegistered) {
      setError('You have already registered a DID for this wallet.');
      return;
    }
    if (!wallet.publicKey || !program) {
      setError('Please connect your wallet first');
      return;
    }
    if (!networkVerified) {
      setError('Please connect to Solana devnet');
      return;
    }
    if (balance !== null && balance < 0.1) {
      setError('Insufficient balance. Please ensure you have at least 0.1 SOL');
      return;
    }
    setLoading(true);
    setError(null);
    setTxSignature(null);
    try {
      const signature = await registerDID(program, wallet.publicKey);
      setIsRegistered(true);
      setTxSignature(signature);
    } catch (err) {
      console.error('Error registering DID:', err);
      let errorMsg = 'Failed to register DID. Please try again.';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      } else if (typeof err === 'object' && err !== null) {
        errorMsg = JSON.stringify(err, null, 2);
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      background: 'none',
    }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
          padding: '2.8rem 2.2rem',
          maxWidth: 540,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInUp 1s',
          margin: '0 auto',
        }}
        aria-label="DID Registration Card"
      >
        {/* Decorative SVG blob */}
        <svg style={{ position: 'absolute', top: '-60px', right: '-80px', width: '220px', height: '140px', zIndex: 0, opacity: 0.13, filter: 'blur(10px)' }} viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="70" rx="110" ry="70" fill="#6366f1" />
        </svg>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#4B3F72', marginBottom: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1, letterSpacing: '-0.01em', textShadow: '0 2px 12px #a5b4fc33' }}>
          <span style={{ background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Decentralized Identity Registration</span>
        </h2>
        
        {/* Network and Balance Status */}
        {wallet.publicKey && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Network:</strong> {networkVerified ? '✅ Devnet' : '❌ Not Devnet'}
            </div>
            {balance !== null && (
              <div>
                <strong>Balance:</strong> {balance.toFixed(4)} SOL
                {balance < 0.1 && ' ⚠️ (Low balance)'}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <WalletMultiButton />
        </div>
        {wallet.publicKey && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            {isRegistered ? (
              <div style={{ background: '#e8f5e9', color: '#2e7d32', borderRadius: 8, padding: '1rem', fontWeight: 600, fontSize: 15, marginBottom: 16, textAlign: 'center', boxShadow: '0 2px 8px #6366f133' }}>
                <p style={{ margin: 0 }}>✅ Your DID is registered</p>
                <p style={{ margin: 0, fontSize: 13, color: '#2563eb', wordBreak: 'break-all' }}>Public Key: {wallet.publicKey.toString()}</p>
                {txSignature && (
                  <p style={{ margin: 0, fontSize: 13, color: '#6366f1', wordBreak: 'break-all' }}>
                    Tx: <a href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>View on Solana Explorer</a>
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleRegisterDID}
                disabled={loading || !networkVerified || (balance !== null && balance < 0.1)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
                }}
              >
                {loading ? 'Registering...' : 'Register DID'}
              </button>
            )}
            {error && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 