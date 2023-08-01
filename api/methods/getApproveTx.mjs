import joi from 'joi';

import Wallet from '../../networking/models/Wallet.mjs';

import { checkErrors, getNetworkParams, validateArgs } from '../helpers/index.mjs';
import { AVAILABLE_NETS } from '../../networking/constants.mjs';
import { types, patterns } from '../schemas.mjs';

/**
 * @api {get} /getApproveTx getApproveTx
 * @apiName getApproveTx
 * @apiGroup 1inch
 * @apiDescription Get prepared approve tx
 *
 * @apiQuery {string} net Network name
 * @apiQuery {address} token_address Token to approve
 * @apiQuery {address} owner Caller address
 *
 *
 * @apiSuccessExample Data:
 * {
 *     "from": "0xbc29b0935c71865aa859d9f3cbba76892298b237",
 *     "to": "0x55d398326f99059fF775485246999027B3197955",
 *     "data": "0x095ea7b30000000000000000000000001111111254eeb25477b68fb85ed929f73a960582000000000000000000000000000000000000000000000000001fffffffffffff",
 *     "value": "0",
 *     "nonce": 169,
 *     "gasPrice": "3000000000",
 *     "gas": "29106",
 *     "chainId": 56
 * }
 */

export const inputSchema = joi.object({
    net: joi.string().valid(...Object.values(AVAILABLE_NETS)).required(),
    tokenAddress: joi.string().pattern(patterns.evmAddress).required(),
    ownerAddress: joi.string().pattern(patterns.evmAddress).required(),
});

export const outputSchema = types.transaction;

export default async (args) => {
    const { net, tokenAddress, ownerAddress } = args;

    try {
        validateArgs(args, inputSchema);

        const wallet = new Wallet({
            ...getNetworkParams(net),
            address: ownerAddress,
        });
        const tx = await wallet.buildApproveTx(tokenAddress);

        return validateArgs(tx, outputSchema);
    } catch (e) {
        checkErrors(e);
    }
};
