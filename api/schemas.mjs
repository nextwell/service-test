import joi from 'joi';

export const patterns = {
    evmAddress: /^0x([a-zA-Z0-9]{40})$/,
    numeric: /^\d+(\.\d+)?$/,
};

export const types = {
    transaction: joi.object({
        from: joi.string().pattern(patterns.evmAddress).required(),
        to: joi.string().pattern(patterns.evmAddress).required(),
        data: joi.string().required(),
        value: joi.string().pattern(patterns.numeric).required(),
        nonce: joi.number(),
        gasPrice: joi.string().pattern(patterns.numeric).required(),
        gas: joi.string().pattern(patterns.numeric).required(),
        chainId: joi.number().required(),
    }),
    amount: joi.object({
        amount: joi.string().pattern(patterns.numeric).required(),
        currency: joi.string().required(),
    }),
}

