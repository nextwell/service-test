import { getApproveTx } from "../api/index.mjs";
import { evm } from '@zomet/sdk';
import { jest } from '@jest/globals'
import assertValidate from './helpers/assertValidate.mjs';
import nock from 'nock';

let inputData;
beforeEach(() => {
    nock.cleanAll();
    inputData = {
        net: 'eth',
        tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ownerAddress: '0xaac594a9b83f892f1a4b5b8804339fc6ddb797ee'
    }
});

afterAll(() => {
    nock.restore();
});

describe('getApproveTx method tests', () => {
    it('Case #1: Get approve tx swap from Ether to USDT in ETH', async () => {
        // given
        const txMock = {
            from: inputData.ownerAddress,
            to: inputData.tokenAddress,
            data: '0x095ea7b30000000000000000000000001111111254eeb25477b68fb85ed929f73a960582000000000000000000000000000000000000000000000000001fffffffffffff',
            value: '0',
            nonce: 0,
            gasPrice: '29568592931',
            gas: '48597',
            chainId: 1
        };

        const inchRouterContractMock = { buildTransaction: jest.fn().mockReturnValue(txMock) };
        jest.spyOn(evm.standards, 'ERC20').mockReturnValue(inchRouterContractMock);

        // when
        const response = await getApproveTx(inputData);

        // then
        expect(inchRouterContractMock.buildTransaction).toHaveBeenCalled();
        expect(response).toMatchSnapshot();
    });

    it(`Case #2: Assert error if use invalid method signature`,
        async () => assertValidate(getApproveTx, inputData));
});
