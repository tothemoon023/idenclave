import React, { useState } from 'react';

/**
 * Helper component for users to paste an encrypted credential, save it as a file, and see CLI upload instructions.
 */
const UploadEncryptedHelper: React.FC = () => {
  const [encrypted, setEncrypted] = useState('');
  const [filename, setFilename] = useState('credential.enc');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setFileUrl(url);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`w3 up ${filename}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: '24px 0', background: '#fafbfc' }}>
      <h3>Upload Encrypted Credential via CLI</h3>
      <ol>
        <li>Paste your <b>encrypted credential</b> below.</li>
        <li>Download it as a file.</li>
        <li>Upload it to Web3.Storage using the CLI.</li>
      </ol>
      <textarea
        rows={5}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          background: '#fff',
          color: '#1e293b',
          border: '1.5px solid #b6b8d6',
          borderRadius: 6,
          fontSize: 15,
          padding: 10,
          outline: 'none',
          marginBottom: 12,
        }}
        placeholder="Paste encrypted credential here..."
        value={encrypted}
        onChange={e => setEncrypted(e.target.value)}
      />
      <div style={{ margin: '12px 0' }}>
        <label>
          Filename:
          <input
            type="text"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            style={{
              marginLeft: 8,
              background: '#fff',
              color: '#1e293b',
              border: '1.5px solid #b6b8d6',
              borderRadius: 6,
              fontSize: 15,
              padding: 8,
              outline: 'none',
            }}
          />
        </label>
        <button
          onClick={handleDownload}
          style={{
            marginLeft: 16,
            background: !encrypted ? '#cbd5e1' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 15,
            cursor: !encrypted ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
          disabled={!encrypted}
        >
          Download File
        </button>
        {fileUrl && (
          <a href={fileUrl} download={filename} style={{ marginLeft: 8 }}>
            Click here to save
          </a>
        )}
      </div>
      <div style={{ margin: '12px 0', background: '#f3f6fa', padding: 8, borderRadius: 4 }}>
        <div><b>Upload via CLI:</b></div>
        <code style={{ background: '#eaeaea', padding: '2px 6px', borderRadius: 4 }}>
          w3 up {filename}
        </code>
        <button
          onClick={handleCopyCommand}
          style={{
            marginLeft: 8,
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 14px',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy command'}
        </button>
      </div>
      <div style={{ fontSize: 13, color: '#888' }}>
        After uploading, copy the returned <b>CID</b> and use it in your app to fetch and decrypt the credential.
      </div>
    </div>
  );
};

export default UploadEncryptedHelper;
