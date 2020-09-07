/* eslint-env jest */
import { SengiDocTypeOperationParamsValidationFailedError } from '../errors'
import { ensureDocTypeOperationParams } from './ensureDocTypeOperationParams'

const createSengiValidation = response => ({
  validateDocTypeOperationParameters: () => response
})

test('Add the system fields to a new doc overwriting existing properties.', () => {
  expect(() => ensureDocTypeOperationParams(createSengiValidation(null), 'example', 'operation', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypeOperationParams(createSengiValidation([{}]), 'example', 'operation', { field: 'block' })).toThrow(SengiDocTypeOperationParamsValidationFailedError)
})
