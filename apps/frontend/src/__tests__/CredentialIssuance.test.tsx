import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CredentialIssuance } from '../components/CredentialIssuance';
import { useWallet } from '@solana/wallet-adapter-react';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));
jest.mock('ipfs-http-client', () => ({
  create: jest.fn().mockReturnValue({
    add: jest.fn().mockResolvedValue({ cid: { toString: () => 'FAKECID' } }),
  }),
}));

describe('CredentialIssuance', () => {
  it('validates required fields', async () => {
    (useWallet as jest.Mock).mockReturnValue({ publicKey: { toString: () => 'FAKEPUBKEY' } });
    const { getByText } = render(<CredentialIssuance programId={'FAKEPID'} connection={{}} />);
    fireEvent.click(getByText(/issue credential/i));
    await waitFor(() => getByText(/credential type is required/i));
  });

  // Add more tests for successful issuance, IPFS error, Solana error, etc.
}); 