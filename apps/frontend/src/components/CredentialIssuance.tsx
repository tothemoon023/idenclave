import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { uploadToPinata } from '../utils/ipfs';

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

const CREDENTIAL_TYPES = [
  'Age Verification',
  'Date of Birth Verification',
  'Third Party Membership ID Verification',
  'Blood Type Verification',
  'Parents Name Verification'
];

const VALIDITY_PERIODS = [
  { label: '1 Year', value: 1 },
  { label: '2 Years', value: 2 },
  { label: '3 Years', value: 3 }
];

export const CredentialIssuance: React.FC<CredentialIssuanceProps> = ({ 
  programId, 
  connection
}) => {
  const wallet = useWallet(); // This will be both the issuer and authority
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
  const [validityPeriod, setValidityPeriod] = useState<number>(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCredentialData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValidityPeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const years = parseInt(e.target.value);
    setValidityPeriod(years);
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + years);
    setCredentialData(prev => ({
      ...prev,
      expiresAt: newExpiryDate.toISOString()
    }));
  };

  const handleClaimValueChange = (value: string) => {
    setCredentialData(prev => ({
      ...prev,
      claims: {
        ...prev.claims,
        [prev.type]: value
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

      // 2. Upload to IPFS using Pinata
      let cid;
      try {
        const apiKey = import.meta.env.VITE_PINATA_JWT;
        if (!apiKey) {
          throw new Error('Pinata API key not configured');
        }
        cid = await uploadToPinata(JSON.stringify(credential), apiKey);
        setIpfsHash(cid);
      } catch (ipfsErr) {
        console.error('IPFS upload error:', ipfsErr);
        setError('Failed to upload credential to IPFS. Please try again.');
        setLoading(false);
        return;
      }

      // Create a 32-byte buffer from the IPFS hash
      const hashBuffer = Buffer.from(cid);
      const credentialRef = Buffer.alloc(32);
      hashBuffer.copy(credentialRef, 0, 0, Math.min(32, hashBuffer.length));

      // 3. Find PDAs for identity and credential accounts
      const [identityAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('identity'), wallet.publicKey.toBuffer()],
        programId
      );

      const [credentialAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('credential'), credentialRef],
        programId
      );

      // 4. Create the instruction data
      const instructionData = Buffer.from([
        6, // IssueCredential instruction
        ...credentialRef,
        ...Buffer.from(new Date().getTime().toString()),
        ...Buffer.from(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime().toString()),
      ]);

      // 5. Create the transaction
      const transaction = new Transaction();
      transaction.add({
        programId,
        keys: [
          { pubkey: credentialAccount, isSigner: false, isWritable: true },
          { pubkey: identityAccount, isSigner: false, isWritable: false },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: false }, // issuer and authority
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      });

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = wallet.publicKey;

      let signature;
      try {
        // Check if wallet supports transaction signing
        if (!wallet.signTransaction) {
          throw new Error('Wallet does not support transaction signing');
        }

        // Sign and send the transaction
        const signedTransaction = await wallet.signTransaction(transaction);
        signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3,
        });

        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        setTxSignature(signature);
      } catch (solanaErr: any) {
        console.error('Solana transaction error:', solanaErr);
        let errorMessage = 'Failed to send transaction to Solana. ';
        if (solanaErr.message) {
          errorMessage += solanaErr.message;
        } else if (solanaErr.error) {
          errorMessage += solanaErr.error.message || 'Unknown error';
        }
        setError(errorMessage);
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

    } catch (err: any) {
      console.error('Error issuing credential:', err);
      setError(err.message || 'Unexpected error occurred during credential issuance.');
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
          maxWidth: 640,
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <select
              name="type"
              value={credentialData.type}
              onChange={handleInputChange}
              style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
              aria-label="Credential Type"
            >
              <option value="">Select a type</option>
              {CREDENTIAL_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {credentialData.type && (
              <input
                type="text"
                placeholder="Claim value"
                value={credentialData.claims[credentialData.type] || ''}
                onChange={(e) => handleClaimValueChange(e.target.value)}
                style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
                aria-label="Claim Value"
              />
            )}
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <label style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Valid Until</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <select
              value={validityPeriod}
              onChange={handleValidityPeriodChange}
              style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#fff', transition: 'border 0.2s, box-shadow 0.2s' }}
              aria-label="Validity Period"
            >
              {VALIDITY_PERIODS.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={new Date(credentialData.expiresAt).toLocaleDateString()}
              readOnly
              style={{ padding: '0.7rem', border: '1.5px solid #b6b8d6', borderRadius: 8, fontSize: 16, background: '#f3f4f6', transition: 'border 0.2s, box-shadow 0.2s' }}
              aria-label="Expiration Date"
            />
          </div>
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
            fontWeight: 600,
            cursor: loading || !wallet.publicKey ? 'not-allowed' : 'pointer',
            opacity: loading || !wallet.publicKey ? 0.7 : 1,
            transition: 'all 0.2s',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {loading ? 'Issuing...' : 'Issue Credential'}
        </button>
        {error && (
          <div style={{ color: '#EF4444', marginTop: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {txSignature && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#059669' }}>Credential issued successfully!</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Transaction: {txSignature}</p>
            {ipfsHash && (
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>IPFS Hash: {ipfsHash}</p>
            )}
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