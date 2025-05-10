import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { groth16 } from 'snarkjs';

interface ZKPVerificationProps {
  programId: PublicKey;
  connection: Connection;
}

interface ProofData {
  proof: any;
  publicSignals: any;
}

export const ZKPVerification: React.FC = () => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [circuitFile, setCircuitFile] = useState<File | null>(null);
  const [zkeyFile, setZkeyFile] = useState<File | null>(null);

  const handleCircuitFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCircuitFile(e.target.files[0]);
  };
  const handleZkeyFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setZkeyFile(e.target.files[0]);
  };

  const generateProof = async (credentialData: any, claim: string) => {
    if (!wallet.publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    if (!circuitFile || !zkeyFile) {
      setError('Please select both circuit and zkey files.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Read the circuit and proving key from file
      const circuitBuffer = await circuitFile.arrayBuffer();
      const zkeyBuffer = await zkeyFile.arrayBuffer();

      // 2. Prepare the input for the circuit
      const input = {
        credential: credentialData,
        claim: claim,
        publicKey: wallet.publicKey.toString(),
      };

      // 3. Generate the proof
      const { proof, publicSignals } = await groth16.fullProve(
        input,
        circuitBuffer,
        zkeyBuffer
      );

      setProof({ proof, publicSignals });
    } catch (err) {
      console.error('Error generating proof:', err);
      setError('Failed to generate proof');
    } finally {
      setLoading(false);
    }
  };

  const verifyProof = async () => {
    if (!proof) {
      setError('No proof available to verify');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Load the verification key
      const verificationKey = await fetch('/circuits/credential_verification.vkey.json');

      // 2. Verify the proof
      const isValid = await groth16.verify(
        await verificationKey.json(),
        proof.publicSignals,
        proof.proof
      );

      setVerificationResult(isValid);
    } catch (err) {
      console.error('Error verifying proof:', err);
      setError('Failed to verify proof');
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
        aria-label="ZKP Verification Card"
      >
        {/* Decorative SVG blob */}
        <svg style={{ position: 'absolute', top: '-60px', right: '-80px', width: '220px', height: '140px', zIndex: 0, opacity: 0.13, filter: 'blur(10px)' }} viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="70" rx="110" ry="70" fill="#6366f1" />
        </svg>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#4B3F72', marginBottom: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1, letterSpacing: '-0.01em', textShadow: '0 2px 12px #a5b4fc33' }}>
          <span style={{ background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zero-Knowledge Proof Verification</span>
        </h2>
        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontWeight: 700, color: '#374151', marginBottom: 12 }}>Select Circuit & Proving Key</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <label style={{ fontWeight: 500, color: '#1e293b' }}>
              Circuit (.wasm):
              <input type="file" accept=".wasm" onChange={handleCircuitFile} style={{ marginLeft: 8 }} />
              {circuitFile && <span style={{ marginLeft: 8, color: '#6366f1', fontSize: 13 }}>{circuitFile.name}</span>}
            </label>
            <label style={{ fontWeight: 500, color: '#1e293b' }}>
              ZKey (.zkey):
              <input type="file" accept=".zkey" onChange={handleZkeyFile} style={{ marginLeft: 8 }} />
              {zkeyFile && <span style={{ marginLeft: 8, color: '#6366f1', fontSize: 13 }}>{zkeyFile.name}</span>}
            </label>
          </div>
        </div>
        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontWeight: 700, color: '#374151', marginBottom: 12 }}>Generate Proof</h3>
          <button
            onClick={() => generateProof({ type: 'AgeVerification', age: 25 }, 'age')}
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
            aria-label="Generate a zero-knowledge proof for your credential claim. Prove without revealing sensitive data."
            title="Generate a zero-knowledge proof for your credential claim. Prove without revealing sensitive data."
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Generating...' : 'Generate Age Proof'}
          </button>
        </div>
        {proof && (
          <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontWeight: 700, color: '#374151', marginBottom: 12 }}>Proof & Public Signals</h3>
            <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, fontSize: 13, color: '#334155', wordBreak: 'break-all', marginBottom: 8 }}>
              <strong>Proof:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>{JSON.stringify(proof.proof, null, 2)}</pre>
              <button style={{ marginTop: 6, fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(JSON.stringify(proof.proof))}>Copy Proof</button>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, fontSize: 13, color: '#334155', wordBreak: 'break-all' }}>
              <strong>Public Signals:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>{JSON.stringify(proof.publicSignals, null, 2)}</pre>
              <button style={{ marginTop: 6, fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(JSON.stringify(proof.publicSignals))}>Copy Public Signals</button>
            </div>
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