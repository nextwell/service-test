export default (args, schema) => {
    const { error } = schema.validate(args);

    if (error) {
        throw error.details[0].message;
    }

    return args;
};
