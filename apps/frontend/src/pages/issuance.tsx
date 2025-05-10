import React from 'react';
import { CredentialIssuance } from '../components/CredentialIssuance';
import env from '../config/env';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection(env.SOLANA.rpcUrl);
const programId = new PublicKey(env.SOLANA.programId);

const IssuancePage: React.FC = () => (
  <CredentialIssuance programId={programId} connection={connection} />
);

export default IssuancePage; 