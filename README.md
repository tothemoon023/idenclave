# IDenclave – Decentralized Identity & Credential Management on Solana

## Overview
IDenclave is a privacy-preserving, decentralized identity and credential management MVP built on Solana. It empowers users to create and manage their digital identity, issue and store verifiable credentials, and share zero-knowledge proofs (ZKPs) for trustless verification—all while keeping sensitive data secure and under user control.

## Features
- **Decentralized Identity (DID) Registration** on Solana
- **Credential Issuance** with off-chain storage on IPFS
- **Zero-Knowledge Proof (ZKP) Flows** for privacy-preserving verification
- **Modern, Responsive UI** (React + TypeScript)
- **Wallet Integration** (Phantom, Solana wallets)
- **Professional Landing Page** with FAQ and Contact
- **Open Graph & Twitter Card Meta Tags** for social sharing

## Tech Stack
- **Frontend:** React, TypeScript, CSS Modules
- **Blockchain:** Solana (Anchor smart contracts)
- **Off-chain Storage:** IPFS (via Infura)
- **ZKP:** snarkjs, circom
- **Wallet:** @solana/wallet-adapter

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/idenclave/idenclave-mvp.git
cd idenclave-mvp/apps/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `apps/frontend`:
```
VITE_INFURA_IPFS_PROJECT_ID=your_infura_project_id
VITE_INFURA_IPFS_PROJECT_SECRET=your_infura_project_secret
VITE_SOLANA_PROGRAM_ID=your_solana_program_id
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_APP_NAME=IDenclave
VITE_APP_DESCRIPTION=Decentralized Identity and Credential Management System
```

### 4. Run the App
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Usage Guide

### DID Registration
- Go to **DID Registration** page
- Connect your Solana wallet (Phantom, etc.)
- Click **Register DID** to create your decentralized identity on Solana

### Credential Issuance
- Go to **Credential Issuance** page
- Fill in credential type and claims
- Issue credential (stored on IPFS, reference on-chain)

### Zero-Knowledge Proof Verification
- Go to **Verification** page
- Connect your wallet
- Generate and verify ZKPs for credentials without revealing sensitive data

### FAQ & Support
- See the **FAQ** section on the landing page for common questions
- Use the **Contact** section to reach out via email, X (Twitter), or GitHub

## Project Structure
- `src/pages/` – Main pages (Landing, Issuance, Verification, Registration)
- `src/components/` – UI components and flows
- `src/config/` – Environment and settings
- `src/assets/` – Images, logos, SVGs
- `smart-contract/` – Anchor program (Solana)
- `circuits/` – ZKP circuits (circom)

## Contributing
Pull requests and feedback are welcome! Please open an issue or PR on GitHub.

## License
MIT

## Contact & Support
- Email: malikathaiyab023@gmail.com
- X (Twitter): [@tothemoon_023](https://twitter.com/tothemoon_023)
- GitHub: [idenclave](https://github.com/idenclave) 