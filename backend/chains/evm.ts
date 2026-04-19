import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const providers = {
  ethereum: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
  bsc: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
  polygon: new ethers.JsonRpcProvider('https://polygon-rpc.com'),
};

const tokenContracts = {
    ethereum: {
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        USDC: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    bsc: {
        USDT: '0x55d398326f99059ff775485246999027b3197955',
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    polygon: {
        USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    }
};


async function getNativeBalance(provider: ethers.JsonRpcProvider, address: string): Promise<number> {
    try {
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.formatEther(balance));
    } catch (error) {
        // Suppress logs for 24/7 operation
        // console.error(`Error getting native balance for ${address}:`, error);
        return 0;
    }
}

async function getTokenBalance(provider: ethers.JsonRpcProvider, tokenAddress: string, userAddress: string): Promise<number> {
    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const [balance, decimals] = await Promise.all([
            contract.balanceOf(userAddress),
            contract.decimals()
        ]);
        return parseFloat(ethers.formatUnits(balance, Number(decimals)));
    } catch (error) {
        // Suppress logs for 24/7 operation
        // console.error(`Error getting token balance for ${userAddress} on contract ${tokenAddress}:`, error);
        return 0;
    }
}

export async function getEvmBalances(address: string) {
    const [ethBalance, bscBalance, polygonBalance] = await Promise.all([
        getNativeBalance(providers.ethereum, address),
        getNativeBalance(providers.bsc, address),
        getNativeBalance(providers.polygon, address),
    ]);

    const [usdtEth, usdcEth] = await Promise.all([
        getTokenBalance(providers.ethereum, tokenContracts.ethereum.USDT, address),
        getTokenBalance(providers.ethereum, tokenContracts.ethereum.USDC, address),
    ]);

    const [usdtBsc, usdcBsc] = await Promise.all([
        getTokenBalance(providers.bsc, tokenContracts.bsc.USDT, address),
        getTokenBalance(providers.bsc, tokenContracts.bsc.USDC, address),
    ]);
    
    const [usdtPolygon, usdcPolygon] = await Promise.all([
        getTokenBalance(providers.polygon, tokenContracts.polygon.USDT, address),
        getTokenBalance(providers.polygon, tokenContracts.polygon.USDC, address),
    ]);

    return {
        ethereum: ethBalance,
        bnb: bscBalance,
        polygon: polygonBalance,
        usdt: usdtEth + usdtBsc + usdtPolygon,
        usdc: usdcEth + usdcBsc + usdcPolygon,
    }
}
