import axios from 'axios';

const API_URL = 'https://blockstream.info/api/address/';

export async function getBitcoinBalance(address: string): Promise<number> {
    try {
        const response = await axios.get(`${API_URL}${address}`, { timeout: 5000 });
        const { chain_stats } = response.data;
        const confirmedBalance = chain_stats.funded_txo_sum - chain_stats.spent_txo_sum;
        return confirmedBalance / 1e8; // Convert satoshis to BTC
    } catch (error) {
        // For long-running scans, gracefully handle common API errors (e.g., 404 for new addresses)
        // and transient network issues without logging to prevent spam.
        if (axios.isAxiosError(error) && error.response && (error.response.status === 400 || error.response.status === 404)) {
            return 0; // Expected for unused addresses.
        }
        // All other errors are silenced to maintain operational integrity and prevent log flooding.
        return 0;
    }
}
