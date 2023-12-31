import joi from 'joi';

import Wallet from '../../networking/models/Wallet.mjs';

import { checkErrors, getNetworkParams, validateArgs } from '../helpers/index.mjs';
import { AVAILABLE_NETS } from '../../networking/constants.mjs';
import { patterns } from '../schemas.mjs';

/**
 * @api {get} /getAllowance getAllowance
 * @apiName getAllowance
 * @apiGroup 1inch
 * @apiDescription Get allowance for spender
 *
 * @apiQuery {string} net Network name
 * @apiQuery {address} tokenAddress Token contract address
 * @apiQuery {address} ownerAddress Wallet address
 *
 *
 * @apiSuccessExample Data:
 * {
 *   123123123123
 * }
 */

export const inputSchema = joi.object({
    net: joi.string().valid(...Object.values(AVAILABLE_NETS)).required(),
    tokenAddress: joi.string().pattern(patterns.evmAddress).required(),
    ownerAddress: joi.string().pattern(patterns.evmAddress).required(),
});

export const outputSchema = joi.object({
    allowance: joi.string().pattern(patterns.numeric).required()
});

export default async (args) => {
    const { net, tokenAddress, ownerAddress } = args;

    try {
        validateArgs(args, inputSchema);

        const wallet = new Wallet({
            ...getNetworkParams(net),
            address: ownerAddress,
        });
        const allowance = await wallet.getAllowance(tokenAddress);

        return validateArgs(allowance, outputSchema);
    } catch (e) {
        checkErrors(e);
    }
};
