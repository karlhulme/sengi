/* eslint-env jest */
const { createCustomisedAjv } = require('../jsonValidation')
const createFieldTypeValueValidator = require('./createFieldTypeValueValidator')

const createValidFieldType = () => ({
  name: 'candidateFieldType',
  title: 'Candidate Field Type',
  description: 'A candidate field type.',
  jsonSchema: {
    type: 'number',
    exclusiveMinimum: 0
  }
})

test('Can create a field type value validator that correctly assesses validity.', () => {
  const ajv = createCustomisedAjv()
  const validator = createFieldTypeValueValidator(ajv, [createValidFieldType()], 'candidateFieldType')
  expect(validator(123)).toEqual(true)
  expect(validator.errors).toEqual(null)
  expect(validator(-123)).toEqual(false)
  expect(validator.errors).not.toEqual(null)
  expect(validator('123')).toEqual(false)
  expect(validator.errors).not.toEqual(null)
  expect(validator({ foo: 'bar' })).toEqual(false)
  expect(validator.errors).not.toEqual(null)
  expect(validator(['foo', 'bar'])).toEqual(false)
  expect(validator(1)).toEqual(true)
  expect(validator.errors).toEqual(null)
})
