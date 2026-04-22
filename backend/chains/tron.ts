import TronWeb from 'tronweb';

let tronWeb: any;

try {
    tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
    });
} catch (e) {
    // This initialization error is critical and should be logged.
    console.error("FATAL: Failed to initialize TronWeb. TRON balance checks will fail.", e)
}


export async function getTronBalance(address: string): Promise<number> {
    if (!tronWeb) {
        // TronWeb failed to initialize, so we can't proceed.
        return 0;
    }
    try {
        const balance = await tronWeb.trx.getBalance(address);
        return tronWeb.fromSun(balance);
    } catch (error) {
        // Silently fail on purpose to prevent log spam from network errors or invalid addresses.
        return 0;
    }
}
