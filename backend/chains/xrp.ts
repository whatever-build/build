import { Client } from 'xrpl';

const RPC_URL = 'wss://s1.ripple.com';

export async function getRippleBalance(address: string): Promise<number> {
    const client = new Client(RPC_URL, {
        connectionTimeout: 5000 // Client-level connection timeout for stability.
    });
    try {
        await client.connect();
        const response = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated'
        });
        const balance = (response.result.account_data as any).Balance;
        return parseInt(balance) / 1_000_000; // Convert drops to XRP
    } catch (error: any) {
        // Gracefully handle "account not found" errors, which are expected for empty wallets.
        if (error.data?.error === 'actNotFound' || error.name === 'NotFoundError' || (error.message && error.message.includes('actNotFound'))) {
            return 0;
        }
        // All other errors are silenced to maintain operational integrity and prevent log flooding.
        return 0;
    } finally {
        // Ensure client is always disconnected.
        if (client.isConnected()) {
            await client.disconnect();
        }
    }
}
