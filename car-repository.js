function getCarByName(name) {
    console.log('getCarByName', name);

    return [
        {
            name: 'Phu',
            isCarBought: false
        },
        {
            name: 'Dong',
            isCarBought: true
        },
        {
            name: 'Nam',
            isCarBought: true
        },
        {
            name: 'Duyen',
            isCarBought: false
        }
    ].find(car => car.name === name);
}

module.exports = {getCarByName};
