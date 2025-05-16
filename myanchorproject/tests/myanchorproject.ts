import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Idenclave } from "../target/types/idenclave";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("idenclave", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Idenclave as Program<Idenclave>;

  // Use provider's wallet for all test cases
  const authority = provider.wallet.payer;
  const issuer = provider.wallet.payer;
  const unauthorized = Keypair.generate();

  // Helper function to get PDA for identity
  const getIdentityPDA = (authority: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("identity"), authority.toBuffer()],
      program.programId
    )[0];
  };

  // Helper function to get PDA for credential
  const getCredentialPDA = (credentialRef: Uint8Array) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("credential"), credentialRef],
      program.programId
    )[0];
  };

  // Clean up before tests
  before(async () => {
    try {
      const identityPDA = getIdentityPDA(authority.publicKey);
      await program.methods
        .closeIdentity()
        .accounts({
          identity: identityPDA,
          authority: authority.publicKey,
        })
        .rpc();
    } catch (err) {
      // Ignore errors if account doesn't exist
      console.log("No existing identity account to clean up");
    }
  });

  // Clean up after tests
  after(async () => {
    try {
      const identityPDA = getIdentityPDA(authority.publicKey);
      await program.methods
        .closeIdentity()
        .accounts({
          identity: identityPDA,
          authority: authority.publicKey,
        })
        .rpc();
    } catch (err) {
      console.log("Error cleaning up identity account:", err);
    }
  });

  describe("Identity Registration", () => {
    it("Successfully registers an identity", async () => {
      const identityPDA = getIdentityPDA(authority.publicKey);

      await program.methods
        .registerIdentity()
        .accounts({
          identity: identityPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const identityAccount = await program.account.identity.fetch(identityPDA);
      expect(identityAccount.isInitialized).to.be.true;
      expect(identityAccount.authority.toString()).to.equal(authority.publicKey.toString());
    });

    it("Fails to register identity with unauthorized signer", async () => {
      const identityPDA = getIdentityPDA(unauthorized.publicKey);

      try {
        await program.methods
          .registerIdentity()
          .accounts({
            identity: identityPDA,
            authority: unauthorized.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([unauthorized])
          .rpc();
        expect.fail("Expected transaction to fail");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });
  });

  describe("Credential Issuance", () => {
    // Generate a unique credential reference for each test run
    const credentialRef = new Uint8Array(32);
    new TextEncoder().encode(`test-cred-${Date.now()}`).forEach((byte, i) => {
      if (i < 32) credentialRef[i] = byte;
    });
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + 365 * 24 * 60 * 60; // 1 year from now

    it("Successfully issues a credential", async () => {
      const identityPDA = getIdentityPDA(authority.publicKey);
      const credentialPDA = getCredentialPDA(credentialRef);

      await program.methods
        .issueCredential(
          Array.from(credentialRef),
          new anchor.BN(issuedAt),
          new anchor.BN(expiresAt)
        )
        .accounts({
          credential: credentialPDA,
          identity: identityPDA,
          issuer: issuer.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([issuer, authority])
        .rpc();

      const credentialAccount = await program.account.credential.fetch(credentialPDA);
      expect(credentialAccount.isInitialized).to.be.true;
      expect(credentialAccount.revoked).to.be.false;
      expect(credentialAccount.identity.toString()).to.equal(identityPDA.toString());
      expect(credentialAccount.issuer.toString()).to.equal(issuer.publicKey.toString());
      expect(credentialAccount.issuedAt.toNumber()).to.equal(issuedAt);
      expect(credentialAccount.expiresAt.toNumber()).to.equal(expiresAt);

      // Clean up the credential after the test
      await program.methods
        .closeCredential()
        .accounts({
          credential: credentialPDA,
          issuer: issuer.publicKey,
        })
        .rpc();
    });

    it("Fails to issue credential with unauthorized issuer", async () => {
      const identityPDA = getIdentityPDA(authority.publicKey);
      const credentialPDA = getCredentialPDA(credentialRef);

      try {
        await program.methods
          .issueCredential(
            Array.from(credentialRef),
            new anchor.BN(issuedAt),
            new anchor.BN(expiresAt)
          )
          .accounts({
            credential: credentialPDA,
            identity: identityPDA,
            issuer: unauthorized.publicKey,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([unauthorized, authority])
          .rpc();
        expect.fail("Expected transaction to fail");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });

    it("Fails to issue credential with unauthorized authority", async () => {
      const identityPDA = getIdentityPDA(authority.publicKey);
      const credentialPDA = getCredentialPDA(credentialRef);

      try {
        await program.methods
          .issueCredential(
            Array.from(credentialRef),
            new anchor.BN(issuedAt),
            new anchor.BN(expiresAt)
          )
          .accounts({
            credential: credentialPDA,
            identity: identityPDA,
            issuer: issuer.publicKey,
            authority: unauthorized.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([issuer, unauthorized])
          .rpc();
        expect.fail("Expected transaction to fail");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
      }
    });
  });
});
