/* eslint-env jest */
import { SengiDocTypePatchValidationFailedError } from './SengiDocTypePatchValidationFailedError'

test('The SengiDocTypePatchValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypePatchValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypePatchValidationFailedError')
  expect(err.message).toMatch(/parameters supplied for a patch for doc type/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})
