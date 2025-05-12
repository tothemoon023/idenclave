import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import idl from '../config/idenclave.json';

// Program ID from your Anchor program
export const PROGRAM_ID = new PublicKey('E7C52ahzQMJB7u9LQmbTtRxYDeHS814HGeWZcWZgkuag');

// Helper to get the provider
export const useProvider = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet as any, {
      commitment: 'confirmed',
    });
  }, [connection, wallet]);
};

// Helper to get the program
export const useProgram = () => {
  const provider = useProvider();

  return useMemo(() => {
    if (!provider) return null;
    return new Program(idl as any, PROGRAM_ID, provider);
  }, [provider]);
};

// Helper to get the PDA for a wallet
export const getWalletPDA = async (wallet: PublicKey) => {
  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from('identity'), wallet.toBuffer()],
    PROGRAM_ID
  );
  return pda;
};

// Helper to register a DID
export const registerDID = async (
  program: Program,
  wallet: PublicKey
) => {
  const pda = await getWalletPDA(wallet);
  try {
    const tx = await program.methods
      .registerIdentity()
      .accounts({
        identity: pda,
        authority: wallet,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    return tx;
  } catch (error) {
    console.error('Error registering DID:', error);
    throw error;
  }
};

// Helper to get DID info
export const getDIDInfo = async (
  program: Program,
  wallet: PublicKey
) => {
  const pda = await getWalletPDA(wallet);
  try {
    const account = await program.account.identity.fetch(pda);
    return account;
  } catch (error) {
    // If the account does not exist, Anchor throws an error
    return null;
  }
}; 