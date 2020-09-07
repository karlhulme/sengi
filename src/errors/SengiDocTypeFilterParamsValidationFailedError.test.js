/* eslint-env jest */
import { SengiDocTypeFilterParamsValidationFailedError } from './SengiDocTypeFilterParamsValidationFailedError'

test('The SengiDocTypeFilterParamsValidationFailedError is constructed correctly.', () => {
  const err = new SengiDocTypeFilterParamsValidationFailedError('example', 'filter', [{}, {}])
  expect(err).toHaveProperty('name', 'SengiDocTypeFilterParamsValidationFailedError')
  expect(err.message).toMatch(/parameters supplied to filter/)
  expect(err).toHaveProperty('docTypeName', 'example')
  expect(err).toHaveProperty('filterName', 'filter')
  expect(err).toHaveProperty('errors', [{}, {}])
})
