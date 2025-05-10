use solana_program_test::{processor, ProgramTest};
use solana_sdk::{account::Account, instruction::{AccountMeta, Instruction}, signature::{Keypair, Signer}, transaction::Transaction, pubkey::Pubkey};
use solana_program::program_pack::Pack;
use idenclave::Identity;
use std::str::FromStr;

#[tokio::test]
async fn test_set_recovery() {
    let program_id = Pubkey::from_str("GTfY1BxDLovBFHHuaQVR27URfEQvqSFLWS39wHHSk21K").unwrap();
    let mut program_test = ProgramTest::new(
        "idenclave",
        program_id,
        processor!(idenclave::process_instruction),
    );
    let authority = Keypair::new();
    let identity = Keypair::new();
    program_test.add_account(
        authority.pubkey(),
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
    // Set recovery as authority
    let recovery = Keypair::new();
    let mut set_recovery_ix_data = vec![4];
    set_recovery_ix_data.extend_from_slice(recovery.pubkey().as_ref());
    let set_recovery_ix = Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(identity.pubkey(), false),
            AccountMeta::new(authority.pubkey(), true),
        ],
        data: set_recovery_ix_data.clone(),
    };
    let mut tx_recovery = Transaction::new_with_payer(&[set_recovery_ix], Some(&authority.pubkey()));
    tx_recovery.sign(&[&authority], recent_blockhash);
    banks_client.process_transaction(tx_recovery).await.unwrap();
    // Fetch and verify recovery
    let identity_account = banks_client.get_account(identity.pubkey()).await.unwrap().unwrap();
    let identity_data = Identity::unpack(&identity_account.data).unwrap();
    assert_eq!(identity_data.recovery, recovery.pubkey());
}
