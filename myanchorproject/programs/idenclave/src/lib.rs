use anchor_lang::prelude::*;

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
