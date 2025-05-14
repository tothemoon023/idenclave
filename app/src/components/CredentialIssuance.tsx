import React, { useState } from 'react';
import { Transaction, Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const CredentialIssuance: React.FC = () => {
    const wallet = useWallet();
    const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL, 'confirmed');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleIssuance = async () => {
        setIsLoading(true);
        setSuccess(false);
        setError(null);

        try {
            // Create the transaction
            const transaction = new Transaction();
            transaction.add(instruction);

            // Get the latest blockhash
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            console.log('Latest blockhash:', blockhash);

            // Set the transaction's recent blockhash and fee payer
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;

            console.log('Transaction created:', {
                recentBlockhash: transaction.recentBlockhash,
                feePayer: transaction.feePayer?.toString(),
                instructions: transaction.instructions.length,
                instructionKeys: instruction.keys.map(k => ({
                    pubkey: k.pubkey.toString(),
                    isSigner: k.isSigner,
                    isWritable: k.isWritable
                }))
            });

            // Use wallet adapter's sendTransaction
            if (!wallet.sendTransaction) {
                throw new Error('Wallet does not support sendTransaction');
            }

            const signature = await wallet.sendTransaction(transaction, connection, {
                skipPreflight: false,
                preflightCommitment: 'confirmed',
                maxRetries: 3
            });
            console.log('Transaction sent:', signature);

            // Wait for confirmation
            const confirmation = await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            }, 'confirmed');

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${confirmation.value.err}`);
            }

            console.log('Transaction confirmed:', signature);
            setSuccess(true);
        } catch (err) {
            console.error('Transaction error:', err);
            if (err instanceof Error) {
                setError(`Transaction failed: ${err.message}`);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default CredentialIssuance; 