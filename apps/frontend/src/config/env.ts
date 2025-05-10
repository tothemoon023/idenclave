interface EnvConfig {
    IPFS: {
        projectId: string;
        projectSecret: string;
        endpoint: string;
    };
    SOLANA: {
        network: string;
        rpcUrl: string;
        wsUrl: string;
        programId: string;
    };
    APP: {
        name: string;
        description: string;
    };
}

const env: EnvConfig = {
    IPFS: {
        projectId: import.meta.env.VITE_IPFS_PROJECT_ID || '',
        projectSecret: import.meta.env.VITE_IPFS_PROJECT_SECRET || '',
        endpoint: import.meta.env.VITE_IPFS_ENDPOINT || 'https://ipfs.infura.io:5001'
    },
    SOLANA: {
        network: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
        rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        wsUrl: import.meta.env.VITE_SOLANA_WS_URL || 'wss://api.devnet.solana.com',
        programId: import.meta.env.VITE_SOLANA_PROGRAM_ID || ''
    },
    APP: {
        name: import.meta.env.VITE_APP_NAME || 'IDenclave',
        description: import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized Identity and Credential Management System'
    }
};

export default env; 