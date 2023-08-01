import { getSwapTx } from "../api/index.mjs";
import { types } from '../api/schemas.mjs';
import { validateArgs } from '../api/helpers/index.mjs';
import assertValidate from './helpers/assertValidate.mjs';
import { evm } from '@zomet/sdk';
import { jest } from '@jest/globals'
import nock from 'nock';

let inputData;
beforeEach(() => {
    nock.cleanAll();
    inputData = {
        net: 'eth',
        fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        toTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ownerAddress: '0xaac594a9b83f892f1a4b5b8804339fc6ddb797ee',
        amount: '0.0001',
        slippage: '0.5'
    }
});

afterAll(() => {
    nock.restore();
});


describe('getSwapTx method tests', () => {
    it('Case #1: get tx swap from Ether to USDT in ETH', async () => {
        // given
        const expectResponseByHttpMock = {
            fromToken: {
                symbol: 'ETH',
                name: 'Ether',
                decimals: 18,
                address: inputData.fromTokenAddress,
                logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
                tags: [Array]
            },
            toToken: {
                symbol: 'USDT',
                name: 'Tether USD',
                address: inputData.toTokenAddress,
                decimals: 6,
                logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
                tags: [Array]
            },
            toTokenAmount: '181177',
            fromTokenAmount: '100000000000000',
            protocols: [[Array]],
            tx: {
                from: inputData.ownerAddress,
                to: '0x1111111254eeb25477b68fb85ed929f73a960582',
                data: '0x0502b1c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000002c02f0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000003b6d03400d4a11d5eeaac28ec3f61d100daf4d40471f185261c0064f',
                value: '100000000000000',
                gas: 145146,
                gasPrice: '18069299540'
            }
        };

        const txMock = {
            from: inputData.ownerAddress,
            to: "0x1111111254eeb25477b68fb85ed929f73a960582",
            data: "0x0502b1c5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000002c02f0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000003b6d03400d4a11d5eeaac28ec3f61d100daf4d40471f1852",
            value: "100000000000000000000000000000000",
            gasPrice: "18069299540",
            gas: "145146",
            chainId: 1,
        }

        const inchRouterContractMock = { buildTransaction: jest.fn().mockReturnValue(txMock) };
        jest.spyOn(evm, 'Contract').mockReturnValue(inchRouterContractMock);

        const httpMock = nock(`${process.env.INCH_API_URL}`)
            .get('/v5.0/1/swap')
            .query(true)
            .reply(200, expectResponseByHttpMock);

        // when
        const response = await getSwapTx(inputData);

        // then
        expect(httpMock.isDone()).toBe(true);
        validateArgs(response, types.transaction);
        expect(response).toMatchSnapshot();
    });

    it(`Case #2: Assert error if use invalid method signature`,
        async () => assertValidate(getSwapTx, inputData));

    it('Case #3: Assert error if use invalid network name', async () => {
        inputData.net = 'abc';
        await expect(getSwapTx(inputData)).rejects.toMatchSnapshot();
    });

    it('Case #4: Assert service error if send wrong contract in toTokenAddress', async () => {
        const expectResponseByMock = `${inputData.toTokenAddress} is wrong address`;

        const mock = nock(`${process.env.INCH_API_URL}`)
            .get('/v5.0/1/swap')
            .query(true)
            .reply(400, expectResponseByMock);

        await expect(getSwapTx(inputData)).rejects.toEqual(expectResponseByMock);
        expect(mock.isDone()).toBe(true);
    });

    it(`Case #5: Assert error if use invalid param "fromTokenAddress"`, async () => {
        inputData.fromTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
        await expect(getSwapTx(inputData)).rejects.toMatchSnapshot();
    });
});
