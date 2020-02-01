/* eslint-env jest */
const { typeOfValidatorGenerator } = require('./keywordValidatorGenerators')

test('Verify the typeof validator generator returns a function.', () => {
  expect(typeof typeOfValidatorGenerator('string', {})).toEqual('function')
  expect(typeof typeOfValidatorGenerator('number', {})).toEqual('function')
  expect(typeof typeOfValidatorGenerator(['boolean', 'function'], {})).toEqual('function')
})

test('Verify the typeof validator generator works with a single type.', () => {
  expect(typeOfValidatorGenerator('string', {})('hello')).toEqual(true)
  expect(typeOfValidatorGenerator('string', {})(123)).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})(true)).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})({})).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})([])).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})(null)).toEqual(false)

  expect(typeOfValidatorGenerator('number', {})(123)).toEqual(true)
  expect(typeOfValidatorGenerator('number', {})('hello')).toEqual(false)
  expect(typeOfValidatorGenerator('number', {})(true)).toEqual(false)
  expect(typeOfValidatorGenerator('number', {})({})).toEqual(false)
  expect(typeOfValidatorGenerator('number', {})([])).toEqual(false)
  expect(typeOfValidatorGenerator('number', {})(null)).toEqual(false)
})

test('Verify the typeof validator generator works with an array.', () => {
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})(true)).toEqual(true)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})(() => {})).toEqual(true)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})(123)).toEqual(false)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})('true')).toEqual(false)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})({})).toEqual(false)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})([])).toEqual(false)
  expect(typeOfValidatorGenerator(['boolean', 'function'], {})(null)).toEqual(false)
})
