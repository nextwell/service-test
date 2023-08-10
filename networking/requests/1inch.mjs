import { utils } from '@zomet/sdk';

const inchRoute = 'https://api.1inch.dev';

export const getRoute = (chainId, from, to, amount, gasPrice) => {
    return new utils.Request('get', `${inchRoute}/swap/v5.0/${chainId}/quote`, {
        params: {
            fromTokenAddress: from,
            toTokenAddress: to,
            amount: amount,
            gasPrice,
        },
    });
};

export const getAllowance = (chainId, tokenAddress, walletAddress) => {
    return new utils.Request('get', `${inchRoute}/swap/v5.0/${chainId}/approve/allowance`, {
        params: {
            tokenAddress,
            walletAddress,
        },
        headers: {
            Authorization: 'Bearer vBhDqaRSvguBKXgzyrBHEdD3t1oQylVx',
        },
    });
};

export const getSwapTx = (chainId, fromTokenAddress, toTokenAddress, amount, fromAddress, slippage) => {
    return new utils.Request('get', `${inchRoute}/swap/v5.0/${chainId}/swap`, {
        params: {
            fromTokenAddress,
            toTokenAddress,
            amount,
            fromAddress,
            slippage,
        },
    });
};
