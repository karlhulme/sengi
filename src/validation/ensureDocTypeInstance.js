import { SengiDocTypeInstanceValidationFailedError } from '../errors'

/**
 * Ensures the given value is valid.
 * @param {SengiValidation} sengiValidation A Sengi validation object.
 * @param {String} docTypeName The name of a doc type.
 * @param {Object} value A set of fields.
 */
export function ensureDocTypeInstance (sengiValidation, docTypeName, value) {
  const errors = sengiValidation.validateDocTypeInstance(docTypeName, value)

  if (Array.isArray(errors) && errors.length > 0) {
    throw new SengiDocTypeInstanceValidationFailedError(docTypeName, errors)
  }
}
