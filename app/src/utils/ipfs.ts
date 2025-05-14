import axios from 'axios';

const PINATA_API_KEY = process.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.VITE_PINATA_SECRET_KEY;

export const uploadToIPFS = async (data: any): Promise<string> => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error('Pinata API keys are not configured. Please check your environment variables.');
    }

    try {
        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );

        if (!response.data.IpfsHash) {
            throw new Error('No IPFS hash received from Pinata');
        }

        return response.data.IpfsHash;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Pinata API Error:', error.response.data);
                throw new Error(`Pinata API Error: ${error.response.data.error || error.response.statusText}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response from Pinata:', error.request);
                throw new Error('No response from Pinata. Please check your internet connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                throw new Error(`Error setting up request: ${error.message}`);
            }
        }
        console.error('Error uploading to IPFS:', error);
        throw new Error('Failed to upload to IPFS');
    }
}; 