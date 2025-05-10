use solana_program::{
    program_pack::{Pack, Sealed},
    pubkey::Pubkey,
    program_error::ProgramError,
};

/// A verifiable credential issued to an identity.
use solana_program::program_pack::IsInitialized;

#[derive(Clone, Debug, PartialEq)]
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

impl Default for Credential {
    fn default() -> Self {
        Self {
            expires_at: 0,
            is_initialized: false,
            revoked: false,
            identity: Pubkey::default(),
            issuer: Pubkey::default(),
            credential_ref: [0u8; 32],
            issued_at: 0,
        }
    }
}

impl IsInitialized for Credential {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Sealed for Credential {}

impl Pack for Credential {
    // LEN: is_initialized (1) + revoked (1) + identity (32) + issuer (32) + ref (32) + issued_at (8)
    const LEN: usize = 1 + 1 + 32 + 32 + 32 + 8;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0] = self.is_initialized as u8;
        dst[1] = self.revoked as u8;
        dst[2..34].copy_from_slice(self.identity.as_ref());
        dst[34..66].copy_from_slice(self.issuer.as_ref());
        dst[66..98].copy_from_slice(&self.credential_ref);
        dst[98..106].copy_from_slice(&self.issued_at.to_le_bytes());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() < Self::LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        let is_initialized = src[0] != 0;
        let revoked = src[1] != 0;
        let identity = Pubkey::new_from_array(<[u8; 32]>::try_from(&src[2..34]).map_err(|_| ProgramError::InvalidAccountData)?);
        let issuer = Pubkey::new_from_array(<[u8; 32]>::try_from(&src[34..66]).map_err(|_| ProgramError::InvalidAccountData)?);
        let credential_ref = <[u8; 32]>::try_from(&src[66..98]).map_err(|_| ProgramError::InvalidAccountData)?;
        let issued_at = u64::from_le_bytes(<[u8; 8]>::try_from(&src[98..106]).map_err(|_| ProgramError::InvalidAccountData)?);
        Ok(Credential { expires_at: 0, is_initialized, revoked, identity, issuer, credential_ref, issued_at })
    }
}
