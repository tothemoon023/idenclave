import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ZKPVerification } from '../components/ZKPVerification';
import { useWallet } from '@solana/wallet-adapter-react';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));
jest.mock('snarkjs', () => ({
  groth16: {
    fullProve: jest.fn().mockResolvedValue({
      proof: { a: 1 },
      publicSignals: [42],
    }),
    verify: jest.fn().mockResolvedValue(true),
  },
}));

describe('ZKPVerification', () => {
  it('shows error if wallet not connected', async () => {
    (useWallet as jest.Mock).mockReturnValue({ publicKey: null });
    const { getByText } = render(<ZKPVerification />);
    fireEvent.click(getByText(/generate age proof/i));
    await waitFor(() => getByText(/please connect your wallet/i));
  });

  // Add more tests for file selection, proof generation, and verification
}); 