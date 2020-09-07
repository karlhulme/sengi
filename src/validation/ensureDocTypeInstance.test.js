/* eslint-env jest */
import { SengiDocTypeInstanceValidationFailedError } from '../errors'
import { ensureDocTypeInstance } from './ensureDocTypeInstance'

const createSengiValidation = response => ({
  validateDocTypeInstance: () => response
})

test('Add the system fields to a new doc overwriting existing properties.', () => {
  expect(() => ensureDocTypeInstance(createSengiValidation(null), 'example', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypeInstance(createSengiValidation([{}]), 'example', { field: 'block' })).toThrow(SengiDocTypeInstanceValidationFailedError)
})
