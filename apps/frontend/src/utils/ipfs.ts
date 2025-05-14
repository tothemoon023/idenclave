// New upload function using NFT.Storage HTTP API
export async function uploadToNFTStorage(content: string | Uint8Array, apiKey: string): Promise<string> {
  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/octet-stream',
    },
    body: typeof content === 'string' ? new TextEncoder().encode(content) : content,
  });
  if (!response.ok) {
    throw new Error(`NFT.Storage upload failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.value.cid;
}

export async function fetchFromIPFS(cid: string): Promise<string> {
  // For fetching, you can use a public gateway
  const url = `https://w3s.link/ipfs/${cid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch file from IPFS');
  return await res.text();
}

export async function uploadToPinata(content: string | Uint8Array, apiKey: string): Promise<string> {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  const file = new Blob([content], { type: 'application/octet-stream' });
  formData.append('file', file, 'credential.enc');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.IpfsHash;
}
