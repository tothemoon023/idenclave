import React, { useState } from 'react';

const ZKPGenerator: React.FC = () => {
  const [claim, setClaim] = useState('over18');
  const [generating, setGenerating] = useState(false);
  const [proof, setProof] = useState<string | null>(null);

  // Simulate proof generation
  const handleGenerateProof = async () => {
    setGenerating(true);
    setTimeout(() => {
      setProof('PROOF_SIMULATED_1234567890abcdef');
      setGenerating(false);
    }, 1200);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(59,130,246,0.08)', padding: 24 }}>
      <h3 style={{ color: '#1e293b', marginBottom: 14, fontWeight: 700 }}>Zero-Knowledge Proof Generator</h3>
      <div style={{ marginBottom: 18, color: '#64748b', fontSize: 15 }}>
        Select a claim and generate a zero-knowledge proof (ZKP) to share with a verifier. (This is a demo; real ZKP integration coming soon!)
      </div>
      <label style={{ fontWeight: 500, color: '#1e293b', marginBottom: 6, display: 'block' }}>
        Claim:
        <select
          value={claim}
          onChange={e => setClaim(e.target.value)}
          style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 6, border: '1.5px solid #b6b8d6', fontSize: 15 }}
        >
          <option value="over18">I am over 18</option>
          <option value="kycPassed">KYC Passed</option>
        </select>
      </label>
      <button
        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 16 }}
        onClick={handleGenerateProof}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Proof'}
      </button>
      {proof && (
        <div style={{ marginTop: 18, color: '#166534', background: '#f0fdf4', borderRadius: 7, padding: '12px 14px', fontWeight: 600 }}>
          <span role="img" aria-label="success">✅</span> Proof: <span style={{ fontFamily: 'monospace' }}>{proof}</span>
        </div>
      )}
    </div>
  );
};

export default ZKPGenerator;
