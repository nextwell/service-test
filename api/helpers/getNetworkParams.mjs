import { evm } from '@zomet/sdk';
import { AVAILABLE_NETS } from '../../networking/constants.mjs';

export default (net) => {
    if (!AVAILABLE_NETS.includes(net)) {
        throw `Network ${net} is not available in 1INCH Swap`;
    }

    if (!evm.config.hasOwnProperty(net)) {
        throw `Cannot get config for ${net}`;
    }

    return evm.config[net];
};
