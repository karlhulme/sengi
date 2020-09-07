import { SengiDocTypeCtorParamsValidationFailedError } from '../errors'

/**
 * Ensures the given value is valid.
 * @param {SengiValidation} sengiValidation A Sengi validation object.
 * @param {String} docTypeName The name of a doc type.
 * @param {Object} value A set of fields.
 */
export function ensureDocTypeConstructorParams (sengiValidation, docTypeName, value) {
  const errors = sengiValidation.validateDocTypeCtorParameters(docTypeName, value)

  if (Array.isArray(errors) && errors.length > 0) {
    throw new SengiDocTypeCtorParamsValidationFailedError(docTypeName, errors)
  }
}
