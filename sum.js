function sum(a, b) {
    return a + b;
}

function setName(object) {
    return {
        ...object,
        name: 'hello',
        age: '2'
    }
}

module.exports = {sum, setName};
