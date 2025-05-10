pragma circom 2.0.0;

template AgeVerification() {
    // Private inputs
    signal private input age;
    signal private input threshold;

    // Public inputs
    signal input publicAgeHash;
    signal input publicThreshold;

    // Output
    signal output isAboveThreshold;

    // Verify that the age is above the threshold
    component isGreater = GreaterThan(32);
    isGreater.in[0] <== age;
    isGreater.in[1] <== threshold;
    isAboveThreshold <== isGreater.out;
}

template GreaterThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0];
    out <== lt.out;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    signal n2p[n];
    n2p[0] <== 1;
    for (var i = 1; i < n; i++) {
        n2p[i] <== n2p[i-1] * 2;
    }

    signal difference[n];
    difference[0] <== in[0] - in[1];
    for (var i = 1; i < n; i++) {
        difference[i] <== difference[i-1] * difference[i-1];
    }

    component isNegative = IsNegative();
    isNegative.in <== difference[n-1];
    out <== isNegative.out;
}

template IsNegative() {
    signal input in;
    signal output out;

    signal inv <-- in!=0 ? 1/in : 0;
    out <== -in * inv;
}

component main = AgeVerification(); 