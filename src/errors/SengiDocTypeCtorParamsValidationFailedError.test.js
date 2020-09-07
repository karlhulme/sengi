/* eslint-env jest */
import { SengiDocTypeCtorParamsValidationFailedError } from './SengiDocTypeCtorParamsValidationFailedError'

test('The SengiDocTypeCtorParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeCtorParamsValidationFailedError('example', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeCtorParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to the constructor/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('errors', [{}, {}])
})
