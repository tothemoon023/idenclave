pub mod credential;
pub use credential::Credential;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
    program_pack::{Pack, Sealed},
    sysvar::{Sysvar},
    rent,

};

// Define the Identity struct with manual serialization
use solana_program::program_pack::IsInitialized;

#[repr(C)]
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Identity {
    pub is_initialized: bool,
    pub authority: Pubkey,
    pub recovery: Pubkey,
    pub attributes: Vec<u8>,
}

impl Sealed for Identity {}

impl Pack for Identity {
    // LEN: is_initialized (1) + authority (32) + recovery (32) + attributes (up to 128 for demo, can be increased)
    const LEN: usize = 1 + 32 + 32 + 128; // attributes fixed to 128 bytes for simplicity

    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0] = self.is_initialized as u8;
        dst[1..33].copy_from_slice(self.authority.as_ref());
        dst[33..65].copy_from_slice(self.recovery.as_ref());
        // Attributes: fixed 128 bytes
        let attr_len = self.attributes.len().min(128);
        dst[65..65+attr_len].copy_from_slice(&self.attributes[..attr_len]);
        // Zero out remaining bytes if attributes is less than 128
        for b in &mut dst[65+attr_len..193] {
            *b = 0;
        }
    }
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() < Self::LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        let is_initialized = src[0] != 0;
        let authority = Pubkey::new_from_array(<[u8; 32]>::try_from(&src[1..33]).map_err(|_| ProgramError::InvalidAccountData)?);
        let recovery = Pubkey::new_from_array(<[u8; 32]>::try_from(&src[33..65]).map_err(|_| ProgramError::InvalidAccountData)?);
        // Attributes: fixed 128 bytes, trim trailing zeros
        let mut attributes = src[65..193].to_vec();
        if let Some(pos) = attributes.iter().rposition(|&x| x != 0) {
            attributes.truncate(pos + 1);
        } else {
            attributes.clear();
        }
        Ok(Identity { is_initialized, authority, recovery, attributes })
    }
}

impl IsInitialized for Identity {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

entrypoint!(process_instruction);

// Instruction types
#[derive(Debug)]
pub enum IdentityInstruction {
    RegisterIdentity, // 0
    UpdateAuthority { new_authority: Pubkey }, // 1
    CloseAccount, // 2
    SetAttributes { data: Vec<u8> }, // 3
    SetRecovery { new_recovery: Pubkey }, // 4
    RecoverAuthority { new_authority: Pubkey }, // 5
    IssueCredential { credential_ref: [u8; 32], issued_at: u64, expires_at: u64 }, // 6
    RevokeCredential, // 7
    QueryCredentialStatus, // 8
}

impl IdentityInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        solana_program::msg!("[DEBUG] IdentityInstruction::unpack tag: {:?}, rest.len(): {}", input.get(0), input.len().saturating_sub(1));
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match tag {
            0 => Self::RegisterIdentity,
            1 => {
                if rest.len() != 32 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let new_authority = Pubkey::new_from_array(rest.try_into().unwrap());
                Self::UpdateAuthority { new_authority }
            }
            2 => Self::CloseAccount,
            3 => Self::SetAttributes { data: rest.to_vec() },
            4 => {
                if rest.len() != 32 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let new_recovery = Pubkey::new_from_array(rest.try_into().unwrap());
                Self::SetRecovery { new_recovery }
            }
            5 => {
                if rest.len() != 32 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let new_authority = Pubkey::new_from_array(rest.try_into().unwrap());
                Self::RecoverAuthority { new_authority }
            }
            6 => {
                if rest.len() != 48 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let credential_ref = <[u8; 32]>::try_from(&rest[..32]).unwrap();
                let issued_at = u64::from_le_bytes(rest[32..40].try_into().unwrap());
                let expires_at = u64::from_le_bytes(rest[40..48].try_into().unwrap());
                Self::IssueCredential { credential_ref, issued_at, expires_at }
            }
            7 => Self::RevokeCredential,
            8 => Self::QueryCredentialStatus,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let instruction = IdentityInstruction::unpack(instruction_data)?;
    let account_info_iter = &mut accounts.iter();

    
    match instruction {
        IdentityInstruction::RevokeCredential => {
            // [credential_account, issuer_account]
            let credential_account = next_account_info(account_info_iter)?;
let issuer_account = next_account_info(account_info_iter)?;


            if !issuer_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut cred_data = credential_account.try_borrow_mut_data()?;
            let mut cred = Credential::unpack(&cred_data)?;
            if cred.issuer != *issuer_account.key {
                return Err(ProgramError::IllegalOwner);
            }
            if cred.revoked {
                return Err(ProgramError::InvalidAccountData);
            }
            cred.revoked = true;
            Credential::pack(cred, &mut cred_data)?;
            msg!("[RevokeCredential] Credential revoked");
            return Ok(());
        }
        IdentityInstruction::RegisterIdentity => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::default();
            if identity_data[0] != 0 {
                return Err(ProgramError::AccountAlreadyInitialized);
            }
            identity.is_initialized = true;
            identity.authority = *authority_account.key;
            Identity::pack(identity, &mut identity_data)?;
            return Ok(());
        }
        IdentityInstruction::UpdateAuthority { new_authority } => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::unpack(&identity_data)?;
            if !identity.is_initialized || identity.authority != *authority_account.key {
                return Err(ProgramError::IllegalOwner);
            }
            identity.authority = new_authority;
            Identity::pack(identity, &mut identity_data)?;
            return Ok(());
        }
        IdentityInstruction::SetAttributes { data } => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::unpack(&identity_data)?;
            if !identity.is_initialized || identity.authority != *authority_account.key {
                return Err(ProgramError::IllegalOwner);
            }
            identity.attributes = data[..data.len().min(128)].to_vec();
            Identity::pack(identity, &mut identity_data)?;
            return Ok(());
        }
        IdentityInstruction::SetRecovery { new_recovery } => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::unpack(&identity_data)?;
            if !identity.is_initialized || identity.authority != *authority_account.key {
                return Err(ProgramError::IllegalOwner);
            }
            identity.recovery = new_recovery;
            Identity::pack(identity, &mut identity_data)?;
            return Ok(());
        }
        IdentityInstruction::IssueCredential { credential_ref, issued_at, expires_at } => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            let credential_account = next_account_info(account_info_iter)?;
let issuer_account = next_account_info(account_info_iter)?;


            if !issuer_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            if !authority_account.is_signer {
                return Err(ProgramError::MissingRequiredSignature);
            }
            let identity_data = identity_account.try_borrow_data()?;
            let identity = Identity::unpack(&identity_data)?;
            if !identity.is_initialized {
                return Err(ProgramError::UninitializedAccount);
            }
            let mut cred_data = credential_account.try_borrow_mut_data()?;
            let mut cred = Credential::default();
            cred.is_initialized = true;
            cred.identity = *identity_account.key;
            cred.issuer = *issuer_account.key;
            cred.credential_ref = credential_ref;
            cred.issued_at = issued_at;
            cred.expires_at = expires_at;
            Credential::pack(cred, &mut cred_data)?;
            return Ok(());
        }
        IdentityInstruction::QueryCredentialStatus => {
            use solana_program::sysvar::{clock::Clock, Sysvar};
            // [credential_account]
            let credential_account = next_account_info(account_info_iter)?;
            let cred_data = credential_account.try_borrow_data()?;
            let cred = Credential::unpack(&cred_data)?;
            let clock = Clock::get()?;
            if cred.revoked {
                msg!("[QueryCredentialStatus] Credential is revoked");
            } else if clock.unix_timestamp as u64 > cred.expires_at {
                msg!("[QueryCredentialStatus] Credential is expired");
            } else {
                msg!("[QueryCredentialStatus] Credential is valid");
            }
            return Ok(());
        }
        IdentityInstruction::RecoverAuthority { new_authority } => {
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                msg!("Authority signature missing");
                return Err(ProgramError::MissingRequiredSignature);
            }
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::unpack(&identity_data)?;
            // The signer must be the recovery address
            if !identity.is_initialized || identity.recovery != *authority_account.key {
                msg!("Only recovery address can recover authority");
                return Err(ProgramError::IllegalOwner);
            }
            identity.authority = new_authority;
            Identity::pack(identity, &mut identity_data)?;
            msg!("[RecoverAuthority] Authority recovered");
            return Ok(());
        }
        IdentityInstruction::CloseAccount => {
            // [identity_account, authority_account, recipient_account]
            let identity_account = next_account_info(account_info_iter)?;
            let authority_account = next_account_info(account_info_iter)?;
            let recipient_account = next_account_info(account_info_iter)?;
            if !authority_account.is_signer {
                msg!("Authority signature missing");
                return Err(ProgramError::MissingRequiredSignature);
            }
            let identity_data = identity_account.try_borrow_mut_data()?;
            let identity = Identity::unpack(&identity_data)?;
            if !identity.is_initialized || identity.authority != *authority_account.key {
                msg!("Only current authority can close");
                return Err(ProgramError::IllegalOwner);
            }
            msg!("[CloseAccount] Start");
            // Unpack identity, drop data borrow before mutably borrowing lamports
            {
                let identity_data = identity_account.try_borrow_data()?;
                let identity = Identity::unpack(&identity_data)?;
                msg!("[CloseAccount] Unpacked identity, is_initialized={}, authority={}", identity.is_initialized as u8, identity.authority);
                if !identity.is_initialized || identity.authority != *authority_account.key {
                    msg!("Only current authority can close");
                    return Err(ProgramError::IllegalOwner);
                }
            }
            msg!("[CloseAccount] Passed authority check");
            // Transfer lamports to recipient (must do before mutably borrowing data again)
            let rent = solana_program::rent::Rent::get()?;
            let min_balance = rent.minimum_balance(identity_account.data_len());
            let lamports = **identity_account.lamports.borrow();
            let to_transfer = lamports.saturating_sub(min_balance);
            msg!("[CloseAccount] lamports={}, min_balance={}, to_transfer={}", lamports, min_balance, to_transfer);
            if to_transfer > 0 {
                **recipient_account.lamports.borrow_mut() += to_transfer;
                **identity_account.lamports.borrow_mut() -= to_transfer;
                msg!("Transferred {} lamports to recipient, left {} for rent-exemption", to_transfer, **identity_account.lamports.borrow());
            } else {
                msg!("No lamports available for transfer, account at rent-exempt minimum");
            }
            // Mark account as closed
            let mut identity_data = identity_account.try_borrow_mut_data()?;
            let mut identity = Identity::unpack(&identity_data)?;
            identity.is_initialized = false;
            Identity::pack(identity, &mut identity_data)?;
            msg!("[CloseAccount] Marked account as closed (is_initialized = false)");
            return Ok(());
        }
    }
}
