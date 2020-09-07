/* eslint-env jest */
import { SengiDocTypeFieldsValidationFailedError } from '../errors'
import { ensureDocTypeFields } from './ensureDocTypeFields'

const createSengiValidation = response => ({
  validateDocTypeFields: () => response
})

test('An error is raised if the fields are invalid.', () => {
  expect(() => ensureDocTypeFields(createSengiValidation(null), 'example', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypeFields(createSengiValidation([{}]), 'example', { field: 'block' })).toThrow(SengiDocTypeFieldsValidationFailedError)
})
