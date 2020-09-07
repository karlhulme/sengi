/* eslint-env jest */
import { SengiDocTypeOperationParamsValidationFailedError } from './SengiDocTypeOperationParamsValidationFailedError'

test('The SengiDocTypeOperationParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeOperationParamsValidationFailedError('example', 'operation', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeOperationParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to operation/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('operationName', 'operation')
  expect(err).toHaveProperty('errors', [{}, {}])
})
