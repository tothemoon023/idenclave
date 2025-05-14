use anchor_lang::prelude::*;

/// A verifiable credential issued to an identity.

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone, Debug, PartialEq)]
pub struct Credential {
    pub expires_at: u64,
    pub is_initialized: bool,
    pub revoked: bool,
    pub identity: Pubkey,      // The identity this credential is linked to
    pub issuer: Pubkey,        // The issuer's public key
    pub credential_ref: [u8; 32], // Off-chain reference (e.g. IPFS CID hash or similar, for MVP use 32 bytes)
    pub issued_at: u64,        // Unix timestamp
    // Add more fields as needed (e.g., type, expiration, status)
}
