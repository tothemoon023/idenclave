declare module 'snarkjs' {
    export const groth16: {
        fullProve(
            input: any,
            wasm: ArrayBuffer,
            zkey: ArrayBuffer
        ): Promise<{
            proof: {
                pi_a: string[];
                pi_b: string[][];
                pi_c: string[];
                protocol: string;
            };
            publicSignals: any;
        }>;
        verify(
            vkey: any,
            publicSignals: any,
            proof: any
        ): Promise<boolean>;
    };
} 