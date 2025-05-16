use anchor_lang::prelude::*;

pub mod credential;
use crate::credential::Credential;

declare_id!("GhdfjF2uHkx45jWaLTaHLfTeCoEsnAnyi2ZcsHxpCNha");

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
        issued_at: i64,
        expires_at: i64,
    ) -> Result<()> {
        let credential = &mut ctx.accounts.credential;
        credential.is_initialized = true;
        credential.revoked = false;
        credential.identity = ctx.accounts.identity.key();
        credential.issuer = ctx.accounts.issuer.key();
        credential.credential_ref = credential_ref;
        credential.issued_at = issued_at;
        credential.expires_at = expires_at;
        Ok(())
    }

    pub fn close_identity(ctx: Context<CloseIdentity>) -> Result<()> {
        Ok(())
    }

    pub fn close_credential(ctx: Context<CloseCredential>) -> Result<()> {
        Ok(())
    }
}

#[account]
pub struct Identity {
    pub is_initialized: bool,
    pub authority: Pubkey,
    // Add other fields as needed (e.g., recovery, attributes)
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
        space = 8 + Credential::LEN,
        seeds = [b"credential", credential_ref.as_ref()],
        bump
    )]
    pub credential: Account<'info, Credential>,
    #[account(
        seeds = [b"identity", identity.authority.as_ref()],
        bump,
        has_one = authority
    )]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseIdentity<'info> {
    #[account(
        mut,
        close = authority,
        seeds = [b"identity", authority.key().as_ref()],
        bump
    )]
    pub identity: Account<'info, Identity>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseCredential<'info> {
    #[account(
        mut,
        close = issuer,
        seeds = [b"credential", credential.credential_ref.as_ref()],
        bump
    )]
    pub credential: Account<'info, Credential>,
    #[account(mut)]
    pub issuer: Signer<'info>,
}
