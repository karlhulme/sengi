/* eslint-env jest */
import { SengiDocTypePatchValidationFailedError } from '../errors'
import { ensureDocTypePatch } from './ensureDocTypePatch'

const createSengiValidation = response => ({
  validateDocTypePatch: () => response
})

test('Add the system fields to a new doc overwriting existing properties.', () => {
  expect(() => ensureDocTypePatch(createSengiValidation(null), 'example', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypePatch(createSengiValidation([{}]), 'example', { field: 'block' })).toThrow(SengiDocTypePatchValidationFailedError)
})
