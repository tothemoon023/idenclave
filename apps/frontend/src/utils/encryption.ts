import CryptoJS from 'crypto-js';

// Encrypt a string with AES using a passphrase
export function encryptWithAES(data: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(data, passphrase).toString();
}

// Decrypt a string with AES using a passphrase
export function decryptWithAES(ciphertext: string, passphrase: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}
