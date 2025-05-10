import React from 'react';

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.5rem',
  background: 'rgba(240, 240, 255, 0.95)',
  padding: '1rem 0',
  borderRadius: '0 0 1.5rem 1.5rem',
  boxShadow: '0 2px 12px rgba(75, 63, 114, 0.06)',
  marginBottom: '2rem',
};

const linkStyle: React.CSSProperties = {
  color: '#4B3F72',
  fontWeight: 600,
  fontSize: '1.1rem',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  transition: 'background 0.2s',
  cursor: 'pointer',
};

const activeStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)',
};

interface NavBarProps {
  current: string;
  onNavigate: (page: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ current, onNavigate }) => (
  <nav style={navStyle}>
    <span
      style={{ ...linkStyle, ...(current === 'landing' ? activeStyle : {}) }}
      onClick={() => onNavigate('landing')}
    >Home</span>
    <span
      style={{ ...linkStyle, ...(current === 'about' ? activeStyle : {}) }}
      onClick={() => onNavigate('about')}
    >About</span>
    <span
      style={{ ...linkStyle, ...(current === 'how' ? activeStyle : {}) }}
      onClick={() => onNavigate('how')}
    >How It Works</span>
    <span
      style={{ ...linkStyle, ...(current === 'issuance' ? activeStyle : {}) }}
      onClick={() => onNavigate('issuance')}
    >Credential Issuance</span>
    <span
      style={{ ...linkStyle, ...(current === 'verification' ? activeStyle : {}) }}
      onClick={() => onNavigate('verification')}
    >Verification</span>
    <span
      style={{ ...linkStyle, ...(current === 'registration' ? activeStyle : {}) }}
      onClick={() => onNavigate('registration')}
    >DID Registration</span>
  </nav>
);

export default NavBar; 