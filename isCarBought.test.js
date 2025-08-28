const { isCarBought } = require('./isCarBought');
const { getCarByName } = require('./car-repository');

jest.mock('./car-repository')

/**
 * Arrange: Set up the test environment.
 * Act: Execute the code to test
 * Assert = expect
 */

test('return true with correct name', () => {
    // Arrange
    getCarByName.mockReturnValueOnce({
        name: 'Phu Qua Dep Trai',
        isCarBought: true
    })

    // Act
    const result = isCarBought('Nam');

    // Assert
    expect(result).toBe(true);
    expect(getCarByName).toHaveBeenCalledWith('Nam');
})

test('return false with isCarBought false', () => {
    getCarByName.mockReturnValueOnce({
        name: 'Huy Nam qua giau',
        isCarBought: false
    })

    expect(isCarBought('Nam')).toBe(false);
    expect(getCarByName).toHaveBeenCalledWith('Nam');
})

test('return false when no car found', () => {
    getCarByName.mockReturnValueOnce(undefined)

    expect(isCarBought('Nam')).toBe(false);
    expect(getCarByName).toHaveBeenCalledWith('Nam');
})

test('raise error type is not string', () => {
    expect(() => isCarBought(1)).toThrow(new TypeError('Incorrect name type'))
})

test('raise error when character less than 3', () => {
    expect(() => isCarBought('Ph')).toThrow(new Error('name must be at least 3'))
})

test('raise error name required', () => {
    expect(() => isCarBought()).toThrow(new Error('Name is not empty'))
    expect(() => isCarBought(undefined)).toThrow(new Error('Name is not empty'))
    expect(() => isCarBought(null)).toThrow(new Error('Name is not empty'))
    expect(() => isCarBought(0)).toThrow(new Error('Name is not empty'))
    expect(() => isCarBought('')).toThrow(new Error('Name is not empty'))
})
