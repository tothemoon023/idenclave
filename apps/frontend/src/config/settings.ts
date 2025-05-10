// IPFS Configuration
export const IPFS_CONFIG = {
    projectId: import.meta.env.VITE_IPFS_PROJECT_ID || '',
    projectSecret: import.meta.env.VITE_IPFS_PROJECT_SECRET || '',
    endpoint: import.meta.env.VITE_IPFS_ENDPOINT || 'https://ipfs.infura.io:5001'
};

// Solana Configuration
export const SOLANA_CONFIG = {
    network: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    wsUrl: import.meta.env.VITE_SOLANA_WS_URL || 'wss://api.devnet.solana.com'
};

// Application Configuration
export const APP_CONFIG = {
    name: import.meta.env.VITE_APP_NAME || 'IDenclave',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized Identity and Credential Management System'
}; 