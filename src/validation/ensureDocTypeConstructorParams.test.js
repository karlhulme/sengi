/* eslint-env jest */
import { SengiDocTypeCtorParamsValidationFailedError } from '../errors'
import { ensureDocTypeConstructorParams } from './ensureDocTypeConstructorParams'

const createSengiValidation = response => ({
  validateDocTypeCtorParameters: () => response
})

test('An error is raised if the constructor params are invalid.', () => {
  expect(() => ensureDocTypeConstructorParams(createSengiValidation(null), 'example', { field: 'block' })).not.toThrow()
  expect(() => ensureDocTypeConstructorParams(createSengiValidation([{}]), 'example', { field: 'block' })).toThrow(SengiDocTypeCtorParamsValidationFailedError)
})
