const helper = {
    handleInputChange(handler) {
        return (event) => {
            handler(event.target.value)
        }
    },

    handleIntegerChange(handler) {
        return (event) => {
            handler(parseInt(event.target.value))
        }
    },
};

module.exports = helper;
