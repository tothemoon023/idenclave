pragma circom 2.0.0;

include "circomlib/comparators.circom";

template CredentialVerification() {
    // Input signals
    signal input credentialHash;
    signal input issuerPublicKey;
    signal input issuedAt;
    signal input expiresAt;
    signal input currentTimestamp;

    // Output signals
    signal output isValid;

    // Components
    component lessThan = LessThan(32);
    component greaterThan = GreaterThan(32);

    // Check if credential is not expired
    lessThan.in[0] <== currentTimestamp;
    lessThan.in[1] <== expiresAt;

    // Check if credential is issued
    greaterThan.in[0] <== currentTimestamp;
    greaterThan.in[1] <== issuedAt;

    // Credential is valid if not expired and issued
    isValid <== lessThan.out * greaterThan.out;
}

component main = CredentialVerification(); 