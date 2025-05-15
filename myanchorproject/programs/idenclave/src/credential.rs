use anchor_lang::prelude::*;

#[account]
pub struct Credential {
    pub expires_at: i64,           // 8
    pub is_initialized: bool,      // 1
    pub revoked: bool,             // 1
    pub identity: Pubkey,          // 32
    pub issuer: Pubkey,            // 32
    pub credential_ref: [u8; 32],  // 32
    pub issued_at: i64,            // 8
}

impl Credential {
    pub const LEN: usize = 8 + 1 + 1 + 32 + 32 + 32 + 8;
}
