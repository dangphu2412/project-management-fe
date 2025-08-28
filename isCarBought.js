const {getCarByName} = require("./car-repository");

function isCarBought(name) {
    validateName(name);

    const car = getCarByName(name);

    return car?.isCarBought ?? false;
}

function validateName(name) {
    if (!name) {
        throw new Error('Name is not empty');
    }

    if (typeof name !== 'string') {
        throw new TypeError('Incorrect name type');
    }

    if (name.length < 3) {
        throw new Error('name must be at least 3')
    }
}

module.exports = {isCarBought};
