/* eslint-env jest */
const { typeOfValidatorGenerator } = require('./keywordValidatorGenerators')

test('Verify the typeof validator generator.', () => {
  expect(typeof typeOfValidatorGenerator('string', {})).toEqual('function')
  expect(typeOfValidatorGenerator('string', {})('hello')).toEqual(true)
  expect(typeOfValidatorGenerator('string', {})(123)).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})(true)).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})({})).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})([])).toEqual(false)
  expect(typeOfValidatorGenerator('string', {})(null)).toEqual(false)
})
