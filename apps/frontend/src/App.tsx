import React, { useState, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SOLANA_CONFIG } from './config/settings';
import VerificationPage from './pages/verification';
import '@solana/wallet-adapter-react-ui/styles.css';
import LandingPage from './pages/LandingPage';
import { CredentialIssuance } from './components/CredentialIssuance';
import { DIDRegistration } from './components/DIDRegistration';
import AboutSection from './components/AboutSection';
import HowItWorksSection from './components/HowItWorksSection';
import env from './config/env';
import { Connection, PublicKey } from '@solana/web3.js';
import HelpModal from './components/HelpModal';

const PAGES = ['landing', 'about', 'how', 'issuance', 'verification', 'registration'] as const;
type Page = typeof PAGES[number];

function App() {
    const [page, setPage] = useState<Page>('landing');
    const [helpOpen, setHelpOpen] = useState(false);

    // Prepare Solana connection and programId
    const connection = useMemo(() => new Connection(env.SOLANA.rpcUrl), []);
    const programId = useMemo(() => new PublicKey(env.SOLANA.programId), []);

    let content;
    if (page === 'verification') content = <VerificationPage />;
    else if (page === 'issuance') content = <CredentialIssuance programId={programId} connection={connection} />;
    else if (page === 'registration') content = <DIDRegistration />;
    else if (page === 'about') content = <AboutSection />;
    else if (page === 'how') content = <HowItWorksSection />;
    else content = <LandingPage onNavigate={setPage as (page: string) => void} />;

    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    // Show help modal on first visit
    React.useEffect(() => {
        if (!localStorage.getItem('idenclave_help_shown')) {
            setHelpOpen(true);
            localStorage.setItem('idenclave_help_shown', '1');
        }
    }, []);

    return (
        <ConnectionProvider endpoint={SOLANA_CONFIG.rpcUrl}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <BrowserRouter>
                        <div className="app">
                            {content}
                            {page !== 'landing' && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <button onClick={() => setPage('landing')}>Back to Home</button>
                                </div>
                            )}
                            {/* Floating Help Button */}
                            <button
                                aria-label="Open Help"
                                onClick={() => setHelpOpen(true)}
                                style={{
                                    position: 'fixed',
                                    bottom: 28,
                                    right: 28,
                                    zIndex: 10001,
                                    background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 56,
                                    height: 56,
                                    boxShadow: '0 4px 18px rgba(59,130,246,0.18)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 28,
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    transition: 'background 0.18s, box-shadow 0.18s',
                                }}
                                title="Help & Onboarding"
                            >
                                ?
                            </button>
                            <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
                            <footer className="footer" style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem 0', color: '#888', fontSize: '1rem', borderTop: '1px solid #eee' }}>
                                <span>
                                    © {new Date().getFullYear()} IDenclave. Built on{' '}
                                    <a href="https://solana.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4B3F72', textDecoration: 'underline' }}>
                                        Solana <img src='/solana-icon.svg' alt='Solana' style={{ height: '1.1em', verticalAlign: 'middle', marginLeft: '0.2em' }} />
                                    </a>.
                                </span>
                            </footer>
                        </div>
                    </BrowserRouter>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
