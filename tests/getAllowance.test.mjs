import { getAllowance } from '../api/index.mjs';
import assertValidate from './helpers/assertValidate.mjs';
import nock from 'nock';

let inputData;
beforeEach(() => {
    nock.cleanAll();
    inputData = {
        net: 'eth',
        tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        ownerAddress: '0xd5ed26d93129a8b51ac54b40477327f6511824b6',
    };
});

afterAll(() => {
    nock.restore();
});

describe('getAllowance method tests', () => {
    it('Case #1: Getting Allowance for Binance-Peg BSC-USD contract', async () => {
        // given
        const expect_response = {
            allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        };

        // const mock = nock(`${process.env.INCH_API_URL}`)
        //     .get('/v5.0/56/approve/allowance')
        //     .query({
        //         tokenAddress: inputData.tokenAddress,
        //         walletAddress: inputData.ownerAddress,
        //     })
        //     .reply(200, expect_response);

        // when
        const result = await getAllowance(inputData);

        //then
        expect(result).toStrictEqual(expect_response);
        // expect(mock.isDone()).toBe(true);
    });

    // it('Case #2: Getting info about absence Allowance for test wallet', async () => {
    //     // given
    //     inputData.ownerAddress = '0x6e328d22012562f8200bb1dd77aa2831ca9942d3';

    //     const expect_response = {
    //         allowance: "0",
    //     };

    //     const mock = nock(`${process.env.INCH_API_URL}`)
    //         .get('/v5.0/56/approve/allowance')
    //         .query({
    //             tokenAddress: inputData.tokenAddress,
    //             walletAddress: inputData.ownerAddress
    //         })
    //         .reply(200, expect_response);

    //     //when
    //     const response = await getAllowance(inputData);

    //     // then
    //     expect(expect_response).toStrictEqual(response);
    //     expect(mock.isDone()).toBe(true);
    // });

    // it('Case #3: Assert error if use invalid network name', async () => {
    //     inputData.net = 'abc';
    //     await expect(getAllowance(inputData)).rejects.toMatchSnapshot();
    // });

    // it('Case #4: Assert error if use invalid contract address', async () => {
    //     // given
    //     inputData.tokenAddress = '0x55d398326f99059fF775485246999027B3197951';
    //     const expectResponse = `${inputData.tokenAddress} is wrong address`;
    //     const mock = nock(`${process.env.INCH_API_URL}`)
    //         .get('/v5.0/56/approve/allowance')
    //         .query({
    //             tokenAddress: inputData.tokenAddress,
    //             walletAddress: inputData.ownerAddress
    //         })
    //         .reply(400, expectResponse);

    //     // then
    //     await expect(getAllowance(inputData)).rejects.toEqual(expectResponse);
    //     expect(mock.isDone()).toBe(true);
    // });

    // it(`Case #5: Assert error if use invalid method signature`,
    //     async () => assertValidate(getAllowance, inputData));
});
