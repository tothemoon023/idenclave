import { groth16 } from 'snarkjs';

export interface AgeVerificationInput {
    age: number;
    threshold: number;
    publicAgeHash: string;
    publicThreshold: number;
}

export interface Proof {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
}

export interface PublicSignals {
    isAboveThreshold: string;
    publicAgeHash: string;
    publicThreshold: string;
}

export async function generateAgeVerificationProof(
    input: AgeVerificationInput
): Promise<{ proof: Proof; publicSignals: PublicSignals }> {
    try {
        // Load the circuit artifacts
        const wasm = await fetch('/circuits/age_verification.wasm').then(r => r.arrayBuffer());
        const zkey = await fetch('/circuits/age_verification_0001.zkey').then(r => r.arrayBuffer());

        // Generate the proof
        const { proof, publicSignals } = await groth16.fullProve(
            input,
            wasm,
            zkey
        );

        return { proof, publicSignals };
    } catch (error) {
        console.error('Error generating proof:', error);
        throw error;
    }
}

export async function verifyAgeVerificationProof(
    proof: Proof,
    publicSignals: PublicSignals
): Promise<boolean> {
    try {
        // Load the verification key
        const vkey = await fetch('/circuits/verification_key.json').then(r => r.json());

        // Verify the proof
        const isValid = await groth16.verify(vkey, publicSignals, proof);
        return isValid;
    } catch (error) {
        console.error('Error verifying proof:', error);
        throw error;
    }
}

// Helper function to calculate Poseidon hash of age
export async function calculateAgeHash(age: number): Promise<string> {
    // This is a placeholder - in a real implementation, you would use a proper Poseidon hash implementation
    // For now, we'll use a simple hash function
    const encoder = new TextEncoder();
    const data = encoder.encode(age.toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
} 