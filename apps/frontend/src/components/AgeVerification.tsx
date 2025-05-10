import React, { useState } from 'react';
import { calculateAgeHash } from '../utils/zkp';

interface AgeVerificationProps {
    onVerification: (isValid: boolean) => void;
}

export const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerification }) => {
    const [age, setAge] = useState<string>('');
    const [threshold, setThreshold] = useState<string>('18');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const ageNum = parseInt(age);
            const thresholdNum = parseInt(threshold);

            if (isNaN(ageNum) || isNaN(thresholdNum)) {
                throw new Error('Please enter valid numbers');
            }

            // Calculate age hash
            const ageHash = await calculateAgeHash(ageNum);

            // For now, we'll do a simple comparison
            // In the future, this will be replaced with ZK proof verification
            const isValid = ageNum >= thresholdNum;

            onVerification(isValid);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Age Verification</h2>
            <form onSubmit={handleVerification} className="space-y-4">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                        Age Threshold
                    </label>
                    <input
                        type="number"
                        id="threshold"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loading
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                    {loading ? 'Verifying...' : 'Verify Age'}
                </button>
            </form>
        </div>
    );
}; 