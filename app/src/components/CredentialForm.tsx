import React, { useState, useEffect } from 'react';
import { PublicKey, Transaction, TransactionInstruction, SystemProgram, Connection, clusterApiUrl } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { uploadToIPFS } from '../utils/ipfs';
import { BN } from 'bn.js';

const CredentialForm: React.FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [network, setNetwork] = useState<string | null>(null);

    // Check wallet connection, network, and balance
    useEffect(() => {
        const checkWallet = async () => {
            if (wallet.publicKey) {
                try {
                    // Check network
                    const version = await connection.getVersion();
                    setNetwork(version['solana-core']);
                    
                    // Check balance
                    const balance = await connection.getBalance(wallet.publicKey);
                    setWalletBalance(balance / 1e9); // Convert lamports to SOL
                    
                    console.log('Network:', version['solana-core']);
                    console.log('Wallet Balance:', balance / 1e9, 'SOL');
                } catch (err) {
                    console.error('Error checking wallet:', err);
                }
            }
        };

        checkWallet();
    }, [wallet.publicKey, connection]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet.publicKey || !wallet.signTransaction) {
            setError('Please connect your wallet first');
            return;
        }

        // Check if wallet has enough SOL (minimum 0.1 SOL for safety)
        if (walletBalance !== null && walletBalance < 0.1) {
            setError('Insufficient SOL balance. Please ensure you have at least 0.1 SOL in your wallet.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Verify program exists
            const programId = new PublicKey("E7C52ahzQMJB7u9LQmbTtRxYDeHS814HGeWZcWZgkuag");
            const programInfo = await connection.getAccountInfo(programId);
            
            if (!programInfo) {
                throw new Error('Program not found. Please ensure the program is deployed to devnet.');
            }

            console.log('Program found:', programId.toString());

            // Create credential data
            const credentialData = {
                credential_type: "test_credential",
                credential_data: {
                    name: "Test Credential",
                    description: "A test credential",
                    attributes: {
                        key1: "value1",
                        key2: "value2"
                    }
                },
                credential_id: Date.now().toString()
            };

            // Upload to IPFS
            const ipfsHash = await uploadToIPFS(credentialData);
            console.log('IPFS Hash:', ipfsHash);

            // Convert IPFS hash to bytes (32 bytes)
            const credentialRef = Buffer.from(ipfsHash.slice(0, 32).padEnd(32, '0'));
            console.log('Credential Reference:', credentialRef.toString('hex'));

            // Find PDA for the identity
            const [identityPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("identity"),
                    wallet.publicKey.toBuffer()
                ],
                programId
            );
            console.log('Identity PDA:', identityPda.toString());

            // Find PDA for the credential
            const [credentialPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("credential"),
                    credentialRef
                ],
                programId
            );
            console.log('Credential PDA:', credentialPda.toString());

            // Get current timestamp and expiration
            const issuedAt = Math.floor(Date.now() / 1000);
            const expiresAt = issuedAt + (365 * 24 * 60 * 60); // 1 year from now

            // Create the instruction data
            const instructionData = Buffer.from([
                1, // Instruction index for issue_credential
                ...credentialRef,
                ...new BN(issuedAt).toArray('le', 8),
                ...new BN(expiresAt).toArray('le', 8)
            ]);
            console.log('Instruction Data:', instructionData.toString('hex'));

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: wallet.publicKey, isSigner: true, isWritable: true }, // issuer
                    { pubkey: credentialPda, isSigner: false, isWritable: true }, // credential
                    { pubkey: identityPda, isSigner: false, isWritable: false }, // identity
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system program
                ],
                programId,
                data: instructionData,
            });

            console.log('Instruction created:', {
                programId: programId.toString(),
                keys: instruction.keys.map(k => ({
                    pubkey: k.pubkey.toString(),
                    isSigner: k.isSigner,
                    isWritable: k.isWritable
                })),
                data: instructionData.toString('hex')
            });

            try {
                // Create the transaction
                const transaction = new Transaction();
                transaction.add(instruction);

                // Use wallet adapter's sendTransaction
                if (!wallet.sendTransaction) {
                    throw new Error('Wallet does not support sendTransaction');
                }
                setIsLoading(true);
                setError(null);

                // Get the latest blockhash
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                console.log('Latest blockhash:', blockhash);

                // Set the transaction's recent blockhash
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

                try {
                    console.log('Signing transaction...');
                    if (!wallet.signTransaction) {
                        throw new Error('Wallet does not support signing transactions');
                    }

                    const signedTransaction = await wallet.signTransaction(transaction);
                    console.log('Transaction signed:', {
                        signatures: signedTransaction.signatures.map(sig => ({
                            publicKey: sig.publicKey.toString(),
                            signature: sig.signature ? Buffer.from(sig.signature).toString('hex') : null
                        }))
                    });

                    console.log('Sending raw transaction...');
                    const rawTransaction = signedTransaction.serialize();
                    console.log('Raw transaction:', Buffer.from(rawTransaction).toString('hex'));

                    const signature = await connection.sendRawTransaction(rawTransaction, {
                        skipPreflight: false,
                        preflightCommitment: 'confirmed',
                        maxRetries: 3
                    });
                    console.log('Transaction sent:', signature);

                    console.log('Waiting for confirmation...');
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
                }
            } catch (err) {
                console.error('Detailed error:', err);
                if (err instanceof Error) {
                    setError(`Transaction failed: ${err.message}`);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Detailed error:', err);
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
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Issue Credential</h2>
                    {!wallet.publicKey && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                            Please connect your wallet first
                        </div>
                    )}
                    {network && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                            Network: {network}
                        </div>
                    )}
                    {walletBalance !== null && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                            Wallet Balance: {walletBalance.toFixed(4)} SOL
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Credential issued successfully!
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !wallet.publicKey}
                    className={`w-full py-2 px-4 rounded ${
                        isLoading || !wallet.publicKey
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isLoading ? 'Issuing Credential...' : 'Issue Credential'}
                </button>
            </form>
        </div>
    );
};

export default CredentialForm; 