import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import env from '../config/env';

export const DIDRegistration: React.FC = () => {
  const wallet = useWallet();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [programId, setProgramId] = useState<PublicKey | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  useEffect(() => {
    // Initialize connection and program ID
    const conn = new Connection(env.SOLANA.rpcUrl);
    setConnection(conn);
    
    try {
      const pid = new PublicKey(env.SOLANA.programId);
      setProgramId(pid);
    } catch (err) {
      console.error('Invalid program ID:', err);
      setError('Invalid program ID configuration');
    }
  }, []);

  const checkRegistration = async () => {
    if (!wallet.publicKey || !programId || !connection) return;
    
    try {
      // Derive the identity account address
      const [identityAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('identity'), wallet.publicKey.toBuffer()],
        programId
      );

      // Check if account exists and is initialized
      const accountInfo = await connection.getAccountInfo(identityAccount);
      setIsRegistered(accountInfo !== null);
    } catch (err) {
      console.error('Error checking registration:', err);
      setError('Failed to check registration status');
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      checkRegistration();
    }
  }, [wallet.publicKey]);

  const registerDID = async () => {
    if (!wallet.publicKey || !programId || !connection) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      // Derive the identity account address
      const [identityAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('identity'), wallet.publicKey.toBuffer()],
        programId
      );

      // Create the registration instruction
      const instruction = {
        programId,
        keys: [
          { pubkey: identityAccount, isSigner: false, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        ],
        data: Buffer.from([0]), // RegisterIdentity instruction
      };

      const transaction = new Transaction().add(instruction);
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      setIsRegistered(true);
      setTxSignature(signature);
    } catch (err) {
      console.error('Error registering DID:', err);
      setError('Failed to register DID');
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
                onClick={registerDID}
                disabled={loading}
                style={{
                  background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '1.2rem',
                  padding: '1.1rem 2.8rem',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(59,130,246,0.10)',
                  letterSpacing: '0.01em',
                  textShadow: '0 1px 8px rgba(59,130,246,0.08)',
                  marginTop: '0.5rem',
                  borderWidth: 3,
                  borderStyle: 'solid',
                  borderImage: 'linear-gradient(90deg, #a5b4fc 0%, #6366f1 100%) 1',
                  animation: 'glowBorder 2.5s infinite alternate',
                  transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
                  opacity: loading ? 0.7 : 1,
                  width: '100%',
                }}
                aria-label="Register your DID (Decentralized Identity) on Solana. This is your unique on-chain identity."
                title="Register your DID (Decentralized Identity) on Solana. This is your unique on-chain identity."
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? 'Registering...' : 'Register DID'}
              </button>
            )}
          </div>
        )}
        {error && (
          <div style={{ color: '#d32f2f', marginTop: 18, padding: '1rem', background: '#ffebee', borderRadius: 8, fontWeight: 600, fontSize: 15 }}>{error}</div>
        )}
        <style>{`
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
    </div>
  );
}; 