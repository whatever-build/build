import TronWeb from 'tronweb';

let tronWeb: any;

try {
    tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
    });
} catch (e) {
    // This initialization error should be logged as it's a critical setup failure.
    console.error("Failed to initialize TronWeb", e)
}


export async function getTronBalance(address: string): Promise<number> {
    if (!tronWeb) {
        // This would be too spammy if called repeatedly.
        return 0;
    }
    try {
        const balance = await tronWeb.trx.getBalance(address);
        return tronWeb.fromSun(balance);
    } catch (error) {
        // Suppress logs for 24/7 operation
        // console.error(`Error getting Tron balance for ${address}:`, error);
        return 0;
    }
}
