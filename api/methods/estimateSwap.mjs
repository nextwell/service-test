import joi from 'joi';

import Wallet from '../../networking/models/Wallet.mjs';

import { checkErrors, getNetworkParams, validateArgs } from '../helpers/index.mjs';
import { AVAILABLE_NETS } from '../../networking/constants.mjs';
import { types, patterns } from '../schemas.mjs';

/**
 * @api {get} /estimateSwap estimateSwap 123
 * @apiName estimateSwap
 * @apiGroup 1inch
 * @apiDescription Get estimate for tokens swap
 *
 * @apiQuery {string} net Network name
 * @apiQuery {address} fromTokenAddress Token from contract address
 * @apiQuery {address} toTokenAddress Token to contract address
 * @apiQuery {number} amount AMMMMOUNT for swap 345
 *
 *
 * @apiSuccessExample Data:
 * {
 *   "toTokenAmount": String,
 *   "fromTokenAmount": String,
 *   "estimatedGas": Number
 * }
 */

export const inputSchema = joi.object({
    net: joi.string().valid(...Object.values(AVAILABLE_NETS)).required(),
    fromTokenAddress: joi.string().pattern(patterns.evmAddress).required(),
    toTokenAddress: joi.string().pattern(patterns.evmAddress).required(),
    amount: joi.string().pattern(patterns.numeric).required(),
});

export const outputSchema = joi.object({
    toTokenAmount: joi.string().pattern(patterns.numeric).required(),
    fromTokenAmount: joi.string().pattern(patterns.numeric).required(),
    fee: types.amount,
});


export default async (args) => {
    const { net, fromTokenAddress, toTokenAddress, amount } = args;

    try {
        validateArgs(args, inputSchema)

        const wallet = new Wallet(getNetworkParams(net));
        const estimated = await wallet.estimateSwap(fromTokenAddress, toTokenAddress, amount);

        return validateArgs(estimated, outputSchema);
    } catch (e) {
        checkErrors(e);
    }
};
