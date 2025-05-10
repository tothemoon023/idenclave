#!/bin/bash

# Install circom if not already installed
if ! command -v circom &> /dev/null; then
    echo "Installing circom..."
    npm install -g circom
fi

# Create circuits directory if it doesn't exist
mkdir -p public/circuits

# Compile the circuit
echo "Compiling circuit..."
circom public/circuits/credential_verification.circom --r1cs --wasm --sym -o public/circuits/

# Generate proving key
echo "Generating proving key..."
snarkjs groth16 setup public/circuits/credential_verification.r1cs public/circuits/pot12_final.ptau public/circuits/credential_verification.zkey

# Export verification key
echo "Exporting verification key..."
snarkjs zkey export verificationkey public/circuits/credential_verification.zkey public/circuits/credential_verification.vkey.json

echo "Circuit compilation and key generation complete!" 