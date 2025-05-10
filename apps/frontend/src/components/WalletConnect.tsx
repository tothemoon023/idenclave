import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletConnect() {
  const { publicKey, wallets } = useWallet();
  const hasWallets = wallets && wallets.length > 0;

  return (
    <div className="wallet-connect">
      {hasWallets ? (
        <WalletMultiButton />
      ) : (
        <div className="wallet-warning">
          <span>No Solana wallet extension detected. Please install Phantom or another Solana wallet to continue.</span>
        </div>
      )}
      {publicKey && (
        <div className="wallet-info">
          <span>Connected: {publicKey.toBase58()}</span>
        </div>
      )}
    </div>
  );
}
