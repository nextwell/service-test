import { estimateSwap } from '../api/index.mjs';
import assertValidate from './helpers/assertValidate.mjs';
import nock from 'nock';
import { jest } from '@jest/globals';
import { evm } from '@zomet/sdk';

let inputData;
beforeEach(() => {
    nock.cleanAll();
    inputData = {
        net: 'eth',
        fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        toTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        amount: '1',
    };
});

afterAll(() => {
    nock.restore();
});

describe('estimateSwap method tests', () => {
    it('Case #1: Check estimate swap from Ether to USDT.', async () => {
        // given
        const expectResponseByMock = {
            fromToken: {
                symbol: 'ETH',
                name: 'Ether',
                decimals: 18,
                address: inputData.fromTokenAddress,
                logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
                tags: [Array],
            },
            toToken: {
                symbol: 'USDT',
                name: 'Tether USD',
                address: inputData.toTokenAddress,
                decimals: 6,
                logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
                tags: [Array],
            },
            toTokenAmount: '1852876810',
            fromTokenAmount: '1000000000000000000',
            protocols: [[Array]],
            estimatedGas: 201221,
        };

        const gasPriceMock = '14547152383';

        const inchRouterContractMock = { getGasPrice: jest.fn().mockReturnValue(gasPriceMock) };
        jest.spyOn(evm.standards, 'ERC20').mockReturnValue(inchRouterContractMock);

        const mock = nock(`${process.env.INCH_API_URL}`)
            .get('/v5.0/1/quote')
            .query({
                fromTokenAddress: inputData.fromTokenAddress,
                toTokenAddress: inputData.toTokenAddress,
                amount: '1000000000000000000',
                gasPrice: gasPriceMock,
            })
            .reply(200, expectResponseByMock);

        // when
        const response = await estimateSwap(inputData);

        // then
        expect(inchRouterContractMock.getGasPrice).toHaveBeenCalled();
        expect(response).toMatchSnapshot();
        expect(mock.isDone()).toBe(true);
    });

    it('Case #2: Assert error if use invalid contract address', async () => {
        // given
        inputData.toTokenAddress = '0x55d398326f99059fF775485246999027B3197951';
        const expect_response = `${inputData.toTokenAddress} is wrong address`;

        const gasPriceMock = '14547152383';

        const inchRouterContractMock = { getGasPrice: jest.fn().mockReturnValue(gasPriceMock) };
        jest.spyOn(evm.standards, 'ERC20').mockReturnValue(inchRouterContractMock);

        const mock = nock(`${process.env.INCH_API_URL}`)
            .get('/v5.0/1/quote')
            .query({
                fromTokenAddress: inputData.fromTokenAddress,
                toTokenAddress: inputData.toTokenAddress,
                amount: '1000000000000000000',
                gasPrice: gasPriceMock,
            })
            .reply(400, expect_response);

        // then
        await expect(estimateSwap(inputData))
            .rejects
            .toEqual(expect_response);
        expect(inchRouterContractMock.getGasPrice).toHaveBeenCalled();
        expect(mock.isDone()).toBe(true);
    });

    it('Case #3: Assert error if use invalid method signature',
        async () => assertValidate(estimateSwap, inputData));

    it('Case #4: Assert error if use invalid network name', async () => {
        inputData.net = 'abc';
        await expect(estimateSwap(inputData)).rejects.toMatchSnapshot();
    });
});
