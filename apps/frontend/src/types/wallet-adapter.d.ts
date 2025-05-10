import { FC, ReactNode } from 'react';

declare module '@solana/wallet-adapter-react' {
    export interface ConnectionProviderProps {
        endpoint: string;
        children?: ReactNode;
    }
    export const ConnectionProvider: FC<ConnectionProviderProps>;

    export interface WalletProviderProps {
        wallets: any[];
        autoConnect?: boolean;
        children?: ReactNode;
    }
    export const WalletProvider: FC<WalletProviderProps>;
}

declare module '@solana/wallet-adapter-react-ui' {
    export interface WalletModalProviderProps {
        children?: ReactNode;
    }
    export const WalletModalProvider: FC<WalletModalProviderProps>;
} 