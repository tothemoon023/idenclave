use anchor_lang::prelude::*;
mod credential;
use credential::Credential;

declare_id!("E7C52ahzQMJB7u9LQmbTtRxYDeHS814HGeWZcWZgkuag"); // Updated to match new program ID

#[program]
pub mod idenclave {
    use super::*;

    pub fn register_identity(ctx: Context<RegisterIdentity>) -> Result<()> {
        let identity = &mut ctx.accounts.identity;
        identity.authority = *ctx.accounts.authority.key;
        identity.is_initialized = true;
        Ok(())
    }

    pub fn issue_credential(
        ctx: Context<IssueCredential>,
        credential_ref: [u8; 32],
        issued_at: u64,
        expires_at: u64,
    ) -> Result<()> {
        let credential = &mut ctx.accounts.credential;
        credential.is_initialized = true;
        credential.revoked = false;
        credential.identity = *ctx.accounts.identity.key;
        credential.issuer = *ctx.accounts.issuer.key;
        credential.credential_ref = credential_ref;
        credential.issued_at = issued_at;
        credential.expires_at = expires_at;
        Ok(())
    }
}

#[account]
pub struct Identity {
    pub is_initialized: bool,
    pub authority: Pubkey,
    // Add other fields as needed (e.g., recovery, attributes)
}

#[account]
pub struct CredentialAccount {
    pub expires_at: u64,
    pub is_initialized: bool,
    pub revoked: bool,
    pub identity: Pubkey,
    pub issuer: Pubkey,
    pub credential_ref: [u8; 32],
    pub issued_at: u64,
}

#[derive(Accounts)]
pub struct RegisterIdentity<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 1 + 32, // 8 for Anchor discriminator, 1 for bool, 32 for Pubkey
        seeds = [b"identity", authority.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(credential_ref: [u8; 32])]
pub struct IssueCredential<'info> {
    #[account(
        init,
        payer = issuer,
        space = 8 + 4096, // Large space for Credential struct and future fields
        seeds = [b"credential", &credential_ref[..]],
        bump
    )]
    pub credential: Account<'info, CredentialAccount>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    /// CHECK: This is the identity account to which the credential is linked
    pub identity: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
