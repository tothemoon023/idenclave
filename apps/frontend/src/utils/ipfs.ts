import { Web3Storage, File } from 'web3.storage';

// TODO: Replace with your Web3.Storage API token from https://web3.storage/tokens/
const WEB3STORAGE_TOKEN = 'YOUR_WEB3STORAGE_API_TOKEN';

function getWeb3Client() {
  return new Web3Storage({ token: WEB3STORAGE_TOKEN });
}

export async function uploadToIPFS(content: string | Uint8Array): Promise<string> {
  const client = getWeb3Client();
  const file = new File([content], 'credential.enc');
  const cid = await client.put([file]);
  return cid;
}

export async function fetchFromIPFS(cid: string): Promise<string> {
  // For fetching, you can use a public gateway
  const url = `https://w3s.link/ipfs/${cid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch file from IPFS');
  return await res.text();
}
