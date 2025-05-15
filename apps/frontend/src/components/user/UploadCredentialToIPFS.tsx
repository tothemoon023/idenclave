import React, { useState } from 'react';
import { uploadToPinata } from '../../utils/ipfs';
import { encryptWithAES } from '../../utils/encryption';

const UploadCredentialToIPFS: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [cid, setCid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      const encrypted = encryptWithAES(credential, passphrase);
      const apiKey = import.meta.env.VITE_PINATA_JWT;
      if (!apiKey) throw new Error('Pinata API key not set');
      const hash = await uploadToPinata(encrypted, apiKey);
      setCid(hash);
    } catch (e: any) {
      setError((e && e.message) ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 4px 24px rgba(59,130,246,0.09)',
      padding: 28,
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      minWidth: 320,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        background: 'linear-gradient(90deg,#3b82f6 0%,#a5b4fc 100%)',
        borderRadius: 10,
        padding: '10px 18px',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(59,130,246,0.07)',
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>🔒</span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Upload Encrypted Credential to IPFS</span>
      </div>
      <label style={{ fontWeight: 500, color: '#1e293b', marginBottom: 6, display: 'block' }}>
        Credential JSON
        <textarea
          value={credential}
          onChange={e => setCredential(e.target.value)}
          placeholder="Paste credential JSON here"
          rows={4}
          style={{
            width: '100%',
            marginTop: 4,
            marginBottom: 16,
            background: '#f7fafc',
            color: '#1e293b',
            border: '1.5px solid #b6b8d6',
            borderRadius: 7,
            fontSize: 16,
            padding: 12,
            outline: 'none',
            transition: 'border 0.2s',
            boxShadow: '0 1.5px 7px rgba(59,130,246,0.04)',
          }}
        />
      </label>
      <label style={{ fontWeight: 500, color: '#1e293b', marginBottom: 6, display: 'block', position: 'relative' }}>
        Encryption Passphrase
        <span
          style={{
            marginLeft: 8,
            fontSize: 13,
            color: '#3b82f6',
            cursor: 'help',
            borderBottom: '1px dotted #3b82f6',
            position: 'relative',
          }}
          title="This passphrase will be required to decrypt your credential. Keep it safe!"
        >
          [?]
        </span>
        <input
          type="password"
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
          placeholder="Encryption passphrase"
          style={{
            width: '100%',
            marginTop: 4,
            marginBottom: 18,
            background: '#f7fafc',
            color: '#1e293b',
            border: '1.5px solid #b6b8d6',
            borderRadius: 7,
            fontSize: 16,
            padding: 12,
            outline: 'none',
            transition: 'border 0.2s',
            boxShadow: '0 1.5px 7px rgba(59,130,246,0.04)',
          }}
        />
      </label>
      <button
        disabled={loading}
        style={{
          background: loading ? '#cbd5e1' : '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 7,
          padding: '12px 28px',
          fontWeight: 700,
          fontSize: 17,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 12px rgba(59,130,246,0.07)',
          marginBottom: 12,
        }}
        title="Encrypt & Upload to NFT.Storage"
        onClick={handleUpload}
      >
        {loading ? 'Uploading...' : 'Encrypt & Upload'}
      </button>
      <div style={{ color: '#dc2626', fontWeight: 600, marginTop: 10, marginBottom: 6 }}>
        <span role="img" aria-label="warning">⚠️</span> Make sure your NFT.Storage API key is set in your environment.<br />
        Your credential is encrypted client-side and uploaded to IPFS via NFT.Storage.
      </div>
      {cid && (
        <div style={{
          marginTop: 18,
          padding: '12px 14px',
          background: '#f0f8ff',
          borderRadius: 7,
          color: '#166534',
          fontWeight: 600,
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeIn 0.6s',
        }}>
          <span role="img" aria-label="success">✅</span>
          <span style={{ flex: 1 }}><b>IPFS CID:</b> <code style={{ fontSize: 15 }}>{cid}</code></span>
          <button
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
              padding: '4px 10px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => { navigator.clipboard.writeText(cid); }}
            title="Copy CID"
          >Copy</button>
        </div>
      )}
      {error && <div style={{ color: '#dc2626', fontWeight: 600, marginTop: 12 }}>{error}</div>}
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 16 }}>
        Your credential is encrypted client-side and uploaded to IPFS. <br />
        <b>Keep your passphrase safe!</b> You'll need it to decrypt later.
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default UploadCredentialToIPFS;
