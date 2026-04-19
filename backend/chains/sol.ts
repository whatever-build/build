import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

export async function getSolanaBalance(address: string): Promise<number> {
    try {
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        // Suppress logs for 24/7 operation
        // console.error(`Error getting Solana balance for ${address}:`, error);
        return 0;
    }
}
