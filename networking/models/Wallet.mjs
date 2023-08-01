import { BigNumber as ethBigNumber } from 'ethers';
import { utils, evm } from '@zomet/sdk';

import { INCH_ROUTER_CONTRACT_ADDRESS, NATIVE_TOKEN_PLACEHOLDER } from '../constants.mjs';

import { getRoute, getSwapTx, getAllowance } from '../requests/1inch.mjs';

const requestManager = new utils.RequestManager();

export default class Wallet {
    constructor(opts = {}) {
        this.chainId = opts.chainId;
        this.net = opts.net;
        this.name = opts.name;
        this.address = opts.address;
        this.decimals = opts.decimals;
        this.scannerURL = opts.scannerURL;
        this.jsonrpc = opts.rpc;
        this.standard = opts.standard;
        this.nativeToken = opts.nativeToken;
    }

    async getTokenDecimals(address) {
        const contract = address.toLowerCase() !== NATIVE_TOKEN_PLACEHOLDER
            && new evm.standards.ERC20(this.net, address);

        return address.toLowerCase() === NATIVE_TOKEN_PLACEHOLDER
            ? this.nativeToken.decimals
            : await contract.call('decimals');
    }

    getFee(gas, gasPrice) {
        const estimatedGasGwei = ethBigNumber.from(gas).mul(gasPrice);

        return utils.formatUnits(estimatedGasGwei, this.nativeToken.decimals).toString();
    }

    async estimateSwap(fromTokenAddress, toTokenAddress, amount) {
        const contract = new evm.standards.ERC20(this.net, fromTokenAddress);

        const [
            tokenFromDecimals,
            gasPrice,
        ] = await Promise.all([
            this.getTokenDecimals(fromTokenAddress),
            contract.getGasPrice(),
        ]);

        const res = await requestManager.send(getRoute(
            this.chainId,
            fromTokenAddress,
            toTokenAddress,
            utils.parseUnits(amount, tokenFromDecimals).toString(),
            gasPrice,
        ));

        return {
            fromTokenAmount: utils.formatUnits(res.fromTokenAmount, res.fromToken.decimals),
            toTokenAmount: utils.formatUnits(res.toTokenAmount, res.toToken.decimals),
            fee: {
                amount: this.getFee(res.estimatedGas, gasPrice),
                currency: this.nativeToken.symbol,
            },
        };
    }

    async getAllowance(tokenAddress) {
        return await requestManager.send(getAllowance(
            this.chainId,
            tokenAddress,
            this.address,
        ));
    }

    async buildSwapTransaction(fromTokenAddress, toTokenAddress, amount, ownerAddress, slippage) {
        const tokenFromDecimals = await this.getTokenDecimals(fromTokenAddress);

        const { tx } = await requestManager.send(getSwapTx(
            this.chainId,
            fromTokenAddress,
            toTokenAddress,
            utils.parseUnits(amount, tokenFromDecimals).toString(),
            ownerAddress,
            slippage,
        ));

        return {
            ...tx,
            chainId: this.chainId,
            gas: tx.gas.toString(),
        };
    }

    async buildApproveTx(tokenAddress) {
        const tokenContract = new evm.standards.ERC20(this.net, tokenAddress);

        return tokenContract.buildTransaction({
            method: 'approve',
            args: [
                INCH_ROUTER_CONTRACT_ADDRESS,
                ethBigNumber.from(Number.MAX_SAFE_INTEGER.toString()).toHexString(),
            ],
            from: this.address,
            value: 0,
        });
    }

    getContractUrl(address) { // TODO Unused method, suggest removing it
        return `${this.scannerURL}/address/${address}`;
    }
}
