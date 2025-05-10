import React, { useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { create } from 'ipfs-http-client';

interface CredentialIssuanceProps {
  programId: PublicKey;
  connection: Connection;
}

interface CredentialData {
  type: string;
  claims: Record<string, any>;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
}

export const CredentialIssuance: React.FC<CredentialIssuanceProps> = ({ programId, connection }) => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentialData, setCredentialData] = useState<CredentialData>({
    type: '',
    claims: {},
    issuer: '',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  });
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  // Initialize IPFS client with Infura
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: 'Basic ' + btoa(
        import.meta.env.VITE_INFURA_IPFS_PROJECT_ID + ':' +
        import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET
      ),
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentialData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClaimChange = (key: string, value: string) => {
    setCredentialData(prev => ({
      ...prev,
      claims: {
        ...prev.claims,
        [key]: value
      }
    }));
  };

  const validateCredential = () => {
    if (!credentialData.type.trim()) return 'Credential type is required.';
    if (!credentialData.claims || Object.keys(credentialData.claims).length === 0) return 'At least one claim is required.';
    if (!credentialData.expiresAt) return 'Expiration date is required.';
    return null;
  };

  const issueCredential = async () => {
    if (!wallet.publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    const validationError = validateCredential();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);
    setIpfsHash(null);

    try {
      // 1. Prepare credential data
      const credential = {
        ...credentialData,
        issuer: wallet.publicKey.toString(),
      };

      // 2. Upload to IPFS
      let cid;
      try {
        const result = await ipfs.add(JSON.stringify(credential));
        cid = result.cid;
        setIpfsHash(cid.toString());
      } catch (ipfsErr) {
        setError('Failed to upload credential to IPFS. Please try again.');
        setLoading(false);
        return;
      }
      const credentialRef = Buffer.from(cid.toString());

      // 3. Create the issuance instruction
      const [credentialAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('credential'), credentialRef],
        programId
      );

      const instruction = {
        programId,
        keys: [
          { pubkey: credentialAccount, isSigner: false, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        ],
        data: Buffer.from([
          6, // IssueCredential instruction
          ...credentialRef,
          ...Buffer.from(new Date().getTime().toString()),
          ...Buffer.from(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime().toString()),
        ]),
      };

      const transaction = new Transaction().add(instruction);
      let signature;
      try {
        signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature);
        setTxSignature(signature);
      } catch (solanaErr) {
        setError('Failed to send transaction to Solana. Please try again.');
        setLoading(false);
        return;
      }

      // Reset form
      setCredentialData({
        type: '',
        claims: {},
        issuer: '',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

    } catch (err) {
      console.error('Error issuing credential:', err);
      setError('Unexpected error occurred during credential issuance.');
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
        aria-label="Credential Issuance Card"
      >
        {/* Decorative SVG blob */}
        <svg style={{ position: 'absolute', top: '-60px', right: '-80px', width: '220px', height: '140px', zIndex: 0, opacity: 0.13, filter: 'blur(10px)' }} viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="70" rx="110" ry="70" fill="#6366f1" />
        </svg>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#4B3F72', marginBottom: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1, letterSpacing: '-0.01em', textShadow: '0 2px 12px #a5b4fc33' }}>
          <span style={{ background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Issue Credential</span>
        </h2>
        <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <label style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Credential Type</label>
          <input
            type="text"
            name="type"
            value={credentialData.type}
            onChange={handleInputChange}
            placeholder="e.g., AgeVerification"
            style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, marginBottom: 8, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
            aria-label="Credential Type"
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #6366f1')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <label style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Claims</label>
          <div className="claims-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Claim key"
              onChange={(e) => handleClaimChange(e.target.value, '')}
              style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
              aria-label="Claim Key"
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #6366f1')}
              onBlur={e => (e.target.style.boxShadow = 'none')}
            />
            <input
              type="text"
              placeholder="Claim value"
              onChange={(e) => handleClaimChange(Object.keys(credentialData.claims)[0], e.target.value)}
              style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
              aria-label="Claim Value"
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #6366f1')}
              onBlur={e => (e.target.style.boxShadow = 'none')}
            />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <label style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Expiration Date</label>
          <input
            type="datetime-local"
            name="expiresAt"
            value={credentialData.expiresAt}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
            aria-label="Expiration Date"
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #6366f1')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
        </div>
        <button
          onClick={issueCredential}
          disabled={loading || !wallet.publicKey}
          style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '1.2rem',
            padding: '1.1rem 2.8rem',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: loading || !wallet.publicKey ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 18px rgba(59,130,246,0.10)',
            letterSpacing: '0.01em',
            textShadow: '0 1px 8px rgba(59,130,246,0.08)',
            marginTop: '0.5rem',
            borderWidth: 3,
            borderStyle: 'solid',
            borderImage: 'linear-gradient(90deg, #a5b4fc 0%, #6366f1 100%) 1',
            animation: 'glowBorder 2.5s infinite alternate',
            transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
            opacity: loading || !wallet.publicKey ? 0.7 : 1,
          }}
          aria-label="Issue a new credential (e.g., Over 18, KYC passed) and store it securely on IPFS."
          title="Issue a new credential (e.g., Over 18, KYC passed) and store it securely on IPFS."
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? 'Issuing...' : 'Issue Credential'}
        </button>
        {error && (
          <div style={{ color: '#d32f2f', marginTop: 18, padding: '1rem', background: '#ffebee', borderRadius: 8, fontWeight: 600, fontSize: 15 }}>{error}</div>
        )}
        {txSignature && (
          <div style={{ color: '#6366f1', marginTop: 18, fontSize: 15, wordBreak: 'break-all' }}>
            Tx: <a href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>View on Solana Explorer</a>
          </div>
        )}
        {ipfsHash && (
          <div style={{ color: '#10b981', marginTop: 8, fontSize: 15, wordBreak: 'break-all' }}>
            IPFS: <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>{ipfsHash}</a>
          </div>
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