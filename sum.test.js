const {sum, setName} = require('./sum');

test('1 + 1 = 2', () => {
    expect(sum(1, 1)).toBe(2);
})

test('name hello should be add to object', () => {
    const inputObject = {};

    expect(setName(inputObject)).toEqual({
        name: 'hello',
        age: '2'
    })
})

test('test Object is compare same reference', () => {
    expect(Object.is(1, '1')).toBe(false);
})

test('test Object is compare same reference', () => {
    const input = {name: '2'};
    expect(Object.is(input, input)).toBe(true);
})

test('test Object is compare diff reference', () => {
    expect(Object.is({name: '2'}, {name: '2'})).toBe(false);
})

test('test Symbol is compare diff reference', () => {
    expect(
        Object.is(Symbol.for('phu dep trai'), Symbol.for('phu dep trai'))
    )
    .toBe(true);
})
