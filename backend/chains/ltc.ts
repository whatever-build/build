import axios from 'axios';

const API_URL = 'https://api.blockcypher.com/v1/ltc/main/addrs/';

export async function getLitecoinBalance(address: string): Promise<number> {
    try {
        const response = await axios.get(`${API_URL}${address}/balance`, { timeout: 5000 });
        const balance = response.data.balance;
        return balance / 1e8; // Convert litoshis to LTC
    } catch (error) {
        // For long-running scans, gracefully handle common API errors (e.g., 404 for new addresses)
        // and transient network issues without logging to prevent spam.
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return 0; // Expected for unused addresses.
        }
        // console.error(`[LTC] Silent error for ${address}:`, error.message);
        return 0;
    }
}
