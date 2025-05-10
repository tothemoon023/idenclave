import { create } from 'ipfs-http-client';
import env from './env';

const { projectId, projectSecret, endpoint } = env.IPFS;

if (!projectId || !projectSecret) {
    console.warn('IPFS credentials not found. Please check your environment variables.');
}

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default ipfs; 