export default async (funcToTest, inputData) => {
    for (const keyToDelete in inputData) {
        const modifiedInputData = { ...inputData };
        delete modifiedInputData[keyToDelete];
        await expect(funcToTest(modifiedInputData)).rejects.toMatchSnapshot();
    }
};