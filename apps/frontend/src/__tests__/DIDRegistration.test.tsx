import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DIDRegistration } from '../components/DIDRegistration';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn().mockImplementation(() => ({
    getAccountInfo: jest.fn().mockResolvedValue(null),
    confirmTransaction: jest.fn().mockResolvedValue({}),
  })),
  PublicKey: jest.fn().mockImplementation((x) => x),
  Transaction: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockReturnThis(),
  })),
}));

describe('DIDRegistration', () => {
  it('shows error if wallet not connected', async () => {
    (useWallet as jest.Mock).mockReturnValue({ publicKey: null });
    const { getByText } = render(<DIDRegistration />);
    fireEvent.click(getByText(/register did/i));
    await waitFor(() => getByText(/please connect your wallet/i));
  });

  // Add more tests for successful registration, error handling, etc.
}); 