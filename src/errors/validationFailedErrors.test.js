/* eslint-env jest */
import {
  SengiDocTypeCtorParamsValidationFailedError,
  SengiDocTypeFieldsValidationFailedError,
  SengiDocTypeFilterParamsValidationFailedError,
  SengiDocTypeInstanceValidationFailedError,
  SengiDocTypeOperationParamsValidationFailedError,
  SengiDocTypePatchValidationFailedError
} from './validationFailedErrors'

test('The SengiDocTypeCtorParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeCtorParamsValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeCtorParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to the constructor/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})

test('The SengiDocTypeFieldsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeFieldsValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeFieldsValidationFailedError')
  expect(err.message).toMatch(/values supplied for the fields of doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})

test('The SengiDocTypeFilterParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeFilterParamsValidationFailedError('example', 'filter', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeFilterParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to filter/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('filterName', 'filter')
  expect(err).toHaveProperty('errors', [{}, {}])
})

test('The SengiDocTypeInstanceValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeInstanceValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeInstanceValidationFailedError')
  expect(err.message).toMatch(/values supplied for an instance of doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})

test('The SengiDocTypeOperationParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeOperationParamsValidationFailedError('example', 'operation', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeOperationParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to operation/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('operationName', 'operation')
  expect(err).toHaveProperty('errors', [{}, {}])
})

test('The SengiDocTypePatchValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypePatchValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypePatchValidationFailedError')
  expect(err.message).toMatch(/parameters supplied for a patch for doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})
