/* eslint-env jest */
import { SengiDocTypeInstanceValidationFailedError } from './SengiDocTypeInstanceValidationFailedError'

test('The SengiDocTypeInstanceValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeInstanceValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeInstanceValidationFailedError')
  expect(err.message).toMatch(/values supplied for an instance of doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})
