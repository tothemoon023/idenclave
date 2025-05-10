import React from 'react';
import UploadCredentialToIPFS from '../components/user/UploadCredentialToIPFS';
import UploadEncryptedHelper from '../components/user/UploadEncryptedHelper';
import IdentityRegistration from '../components/user/IdentityRegistration';
import ZKPGenerator from '../components/user/ZKPGenerator';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 16px rgba(59,130,246,0.08)',
  padding: 24,
  margin: '32px auto',
  maxWidth: 540,
  textAlign: 'left',
};

const sectionSpacing: React.CSSProperties = {
  marginBottom: 36,
};

const UserPortal: React.FC = () => (
  <div style={{ background: '#f4f6fa', minHeight: '100vh', padding: '32px 0' }}>
    <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: 32, fontWeight: 800, letterSpacing: 1 }}>IDenclave User Portal</h2>

    <div style={{ ...cardStyle, borderLeft: '6px solid #f59e42', background: '#fff7ed', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>⚠️</span>
        <span style={{ fontWeight: 700, color: '#b45309', fontSize: 18 }}>Browser Uploads Disabled</span>
      </div>
      <div style={{ color: '#92400e', fontSize: 15, marginBottom: 10 }}>
        Due to web3.storage API changes, uploading directly from the browser is no longer supported.<br/>
        <b>Please use the CLI-based upload flow below.</b>
      </div>
    </div>

    <div style={{ ...cardStyle, marginBottom: 36, borderLeft: '6px solid #3b82f6', background: '#f0f8ff' }}>
      <h3 style={{ color: '#1e293b', marginBottom: 16, fontWeight: 700 }}>Upload Encrypted Credential via CLI</h3>
      <div style={{ color: '#2563eb', fontWeight: 500, marginBottom: 12 }}>
        <ol style={{ marginLeft: 18, marginBottom: 0 }}>
          <li>Paste your <b>encrypted credential</b> below.</li>
          <li>Download it as a file (e.g., <code>credential.enc</code>).</li>
          <li>Upload using the CLI: <code style={{ background: '#eaeaea', padding: '2px 6px', borderRadius: 4 }}>w3 up credential.enc</code></li>
          <li>Copy the returned <b>CID</b> and use it in your app.</li>
        </ol>
      </div>
      <UploadEncryptedHelper />
    </div>

    <div style={{ ...cardStyle, marginBottom: 36 }}>
      <IdentityRegistration />
    </div>
    <div style={{ ...cardStyle, marginBottom: 36 }}>
      <ZKPGenerator />
    </div>
  </div>
);


export default UserPortal;
