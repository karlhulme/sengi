/* eslint-env jest */
import { SengiDocTypeFieldsValidationFailedError } from './SengiDocTypeFieldsValidationFailedError'

test('The SengiDocTypeFieldsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeFieldsValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeFieldsValidationFailedError')
  expect(err.message).toMatch(/values supplied for the fields of doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})
