import { utils } from '@zomet/sdk';

export const getRoute = (chainId, from, to, amount, gasPrice) => {
    return new utils.Request(
        'get',
        `https://api.1inch.dev/swap/v5.0/${chainId}/quote`,
        {
            params: {
                fromTokenAddress: from,
                toTokenAddress: to,
                amount: amount,
                gasPrice,
            },
        },
    );
};

export const getAllowance = (chainId, tokenAddress, walletAddress) => {
    return new utils.Request(
        'get',
        `https://api.1inch.dev/swap/v5.0/${chainId}/approve/allowance`,
        {
            params: {
                tokenAddress,
                walletAddress,
            },
        },
    );
};

export const getSwapTx = (chainId, fromTokenAddress, toTokenAddress, amount, fromAddress, slippage) => {
    return new utils.Request(
        'get',
        `https://api.1inch.dev/swap/v5.0/${chainId}/swap`,
        {
            params: {
                fromTokenAddress,
                toTokenAddress,
                amount,
                fromAddress,
                slippage,
            },
        },
    );
};
