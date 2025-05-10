use solana_program_test::*;
use solana_sdk::{
    account::Account,
    instruction::{AccountMeta, Instruction},
    signature::{Keypair, Signer},
    transaction::Transaction,
    pubkey::Pubkey,
};
use idenclave::Identity;

#[tokio::test]
async fn test_register_identity() {
    // Use the deployed program id
    let program_id = Pubkey::from_str("GTfY1BxDLovBFHHuaQVR27URfEQvqSFLWS39wHHSk21K").unwrap();

    let mut program_test = ProgramTest::new(
        "idenclave",
        program_id,
        processor!(idenclave::process_instruction),
    );

    // Create authority keypair
    let authority = Keypair::new();
    let identity = Keypair::new();

    // Add lamports to authority for rent
    program_test.add_account(
        authority.pubkey(),
        Account {
            lamports: 10_000_000_000,
            ..Account::default()
        },
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    // Create identity account
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
        data: vec![], // No instruction data needed
    };

    let mut tx = Transaction::new_with_payer(&[create_ix, register_ix], Some(&authority.pubkey()));
    tx.sign(&[&authority, &identity], recent_blockhash);
    banks_client.process_transaction(tx).await.unwrap();

    // Fetch and verify identity account
    let identity_account = banks_client.get_account(identity.pubkey()).await.unwrap().unwrap();
    let identity_data = Identity::unpack(&identity_account.data).unwrap();
    assert_eq!(identity_data.authority, authority.pubkey());
}
