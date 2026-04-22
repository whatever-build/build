import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Upgraded to a high-performance, enterprise-grade RPC for Solana.
const RPC_URL = 'https://rpc.ankr.com/solana';
const connection = new Connection(RPC_URL, 'confirmed');

export async function getSolanaBalance(address: string): Promise<number> {
    try {
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        // Silently fail on purpose to prevent log spam from network errors or invalid addresses.
        return 0;
    }
}
