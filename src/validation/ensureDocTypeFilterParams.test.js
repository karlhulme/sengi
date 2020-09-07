/* eslint-env jest */
import { SengiDocTypeFilterParamsValidationFailedError } from '../errors'
import { ensureDocTypeFilterParams } from './ensureDocTypeFilterParams'

const createSengiValidation = response => ({
  validateDocTypeFilterParameters: () => response
})

test('An error is raised if the filter params are invalid.', () => {
  expect(() => ensureDocTypeFilterParams(createSengiValidation(null), 'example', 'filter', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypeFilterParams(createSengiValidation([{}]), 'example', 'filter', { field: 'block' })).toThrow(SengiDocTypeFilterParamsValidationFailedError)
})
