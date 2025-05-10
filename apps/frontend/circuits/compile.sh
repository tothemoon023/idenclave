#!/bin/bash

# Create output directory
mkdir -p build

# Compile the circuit
circom age_verification.circom --r1cs --wasm --sym -o build

# Generate the witness
node build/age_verification_js/generate_witness.js build/age_verification_js/age_verification.wasm input.json build/witness.wtns

# Generate the proof
snarkjs groth16 prove build/age_verification_0001.zkey build/witness.wtns build/proof.json build/public.json

# Verify the proof
snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json 