export default (error) => {
    if (error.response?.data?.description) {
        throw error.response?.data?.description;
    }

    if (error.response?.data) {
        throw error.response?.data;
    }

    if (error.response) {
        throw error.response;
    }

    throw error;
};
