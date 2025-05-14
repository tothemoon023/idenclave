use anchor_lang::prelude::*;

declare_id!("Fn79hmpPaRKmMhN5TN4nQd3YtsNzD8zy8bS728pSs3WQ");

#[account]
pub struct CredentialAccount {
    pub owner: Pubkey,
    pub issuer: Pubkey,
    pub credential_type: String,
    pub credential_data: String,
    pub issuance_date: i64,
    pub expiration_date: i64,
    pub revoked: bool,
    pub credential_id: String,
    pub credential_hash: String,
    pub credential_uri: String,
    pub credential_subject: String,
    pub credential_issuer: String,
    pub credential_issuance_date: i64,
    pub credential_expiration_date: i64,
    pub credential_claim: String,
    pub credential_proof: String,
    pub credential_status: String,
    pub credential_terms_of_use: String,
    // ... add the rest of your fields and logic as needed ...
}
