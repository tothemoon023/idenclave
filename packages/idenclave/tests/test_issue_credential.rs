use solana_program_test::{processor, ProgramTest};
use solana_sdk::{
    account::Account,
    instruction::{AccountMeta, Instruction},
    signature::{Keypair, Signer},
    transaction::Transaction,
    pubkey::Pubkey,
};
use solana_program::program_pack::Pack;
use idenclave::Identity;
use idenclave::credential::Credential;
use std::str::FromStr;

#[tokio::test]
async fn test_issue_credential() {
    let program_id = Pubkey::from_str("GTfY1BxDLovBFHHuaQVR27URfEQvqSFLWS39wHHSk21K").unwrap();
    let mut program_test = ProgramTest::new(
        "idenclave",
        program_id,
        processor!(idenclave::process_instruction),
    );
    let authority = Keypair::new();
    let identity = Keypair::new();
    let issuer = Keypair::new();
    program_test.add_account(
        authority.pubkey(),
        Account { lamports: 10_000_000_000, ..Account::default() },
    );
    program_test.add_account(
        issuer.pubkey(),
        Account { lamports: 10_000_000_000, ..Account::default() },
    );
    let (mut banks_client, _payer, recent_blockhash) = program_test.start().await;
    let rent = banks_client.get_rent().await.unwrap();
    let space = Identity::LEN;
    let lamports = rent.minimum_balance(space);
    let create_ix = solana_sdk::system_instruction::create_account(
        &authority.pubkey(),
        &identity.pubkey(),
        lamports,
        space as u64,
        &program_id,
    );
    let register_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(identity.pubkey(), false),
            AccountMeta::new(authority.pubkey(), true),
        ],
        data: vec![0],
    };
    let mut tx = Transaction::new_with_payer(&[create_ix, register_ix], Some(&authority.pubkey()));
    tx.sign(&[&authority, &identity], recent_blockhash);
    banks_client.process_transaction(tx).await.unwrap();
    // Create credential account
    let cred = Keypair::new();
    let cred_space = Credential::LEN;
    let cred_lamports = rent.minimum_balance(cred_space);
    let create_cred_ix = solana_sdk::system_instruction::create_account(
        &issuer.pubkey(),
        &cred.pubkey(),
        cred_lamports,
        cred_space as u64,
        &program_id,
    );
    // First, create the credential account in its own transaction
    let mut tx_create_cred = Transaction::new_with_payer(&[create_cred_ix], Some(&issuer.pubkey()));
    tx_create_cred.sign(&[&issuer, &cred], recent_blockhash);
    banks_client.process_transaction(tx_create_cred).await.unwrap();

    // Prepare IssueCredential instruction
    let credential_ref = [42u8; 32];
    let issued_at = 1_700_000_000u64;
    let mut issue_data = vec![6]; // 6 = IssueCredential
    issue_data.extend_from_slice(&credential_ref);
    issue_data.extend_from_slice(&issued_at.to_le_bytes());

    // The order of accounts must match the program's expectation:
    // [identity_account, authority_account (dummy), credential_account, issuer_account]
    let issue_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(identity.pubkey(), false),   // writable, not signer
            AccountMeta::new(authority.pubkey(), false),  // writable, not signer
            AccountMeta::new(cred.pubkey(), false),       // writable, not signer
            AccountMeta::new(issuer.pubkey(), true),      // writable, signer
        ],
        data: issue_data,
    };






    let mut tx_issue = Transaction::new_with_payer(&[issue_ix], Some(&issuer.pubkey()));
    tx_issue.sign(&[&issuer], recent_blockhash);
    banks_client.process_transaction(tx_issue).await.unwrap();

    // Fetch and verify credential
    let cred_account = banks_client.get_account(cred.pubkey()).await.unwrap().unwrap();
    let cred_data = Credential::unpack(&cred_account.data).unwrap();
    assert!(cred_data.is_initialized);
    assert_eq!(cred_data.identity, identity.pubkey());
    assert_eq!(cred_data.issuer, issuer.pubkey());
    assert_eq!(cred_data.credential_ref, credential_ref);
    assert_eq!(cred_data.issued_at, issued_at);
}
