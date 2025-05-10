use solana_program_test::ProgramTest;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar,
};

#[tokio::test]
async fn test_system_program_close_account() {
    let mut program_test = ProgramTest::default();

    // Create payer and recipient
    let payer = Keypair::new();
    let recipient = Keypair::new();
    let close_me = Keypair::new();

    // Add lamports to payer so they can fund accounts
    program_test.add_account(
        payer.pubkey(),
        Account {
            lamports: 10_000_000_000,
            ..Account::default()
        },
    );

    let (mut banks_client, _, recent_blockhash) = program_test.start().await;

    // Create the account to be closed
    let rent = banks_client.get_rent().await.unwrap();
    let min_balance = rent.minimum_balance(0);
    let create_ix = system_instruction::create_account(
        &payer.pubkey(),
        &close_me.pubkey(),
        min_balance + 1000,
        0,
        &system_program::ID,
    );
    let mut tx = Transaction::new_with_payer(&[create_ix], Some(&payer.pubkey()));
    tx.sign(&[&payer, &close_me], recent_blockhash);
    banks_client.process_transaction(tx).await.unwrap();

    // Now close the account using system program
    let close_ix = system_instruction::transfer(
        &close_me.pubkey(),
        &recipient.pubkey(),
        min_balance + 1000,
    );
    let mut tx2 = Transaction::new_with_payer(&[close_ix], Some(&close_me.pubkey()));
    tx2.sign(&[&close_me], recent_blockhash);
    let result = banks_client.process_transaction(tx2).await;
    println!("[System Close Test] Close result: {:?}", result);
    assert!(result.is_ok());

    // Check recipient balance increased
    let recipient_account = banks_client.get_account(recipient.pubkey()).await.unwrap().unwrap();
    assert!(recipient_account.lamports > 0);
}
