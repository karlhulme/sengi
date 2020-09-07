import { SengiDocTypeFieldsValidationFailedError } from '../errors'

/**
 * Ensures the given value is valid.
 * @param {SengiValidation} sengiValidation A Sengi validation object.
 * @param {String} docTypeName The name of a doc type.
 * @param {Object} value A set of fields.
 */
export function ensureDocTypeFields (sengiValidation, docTypeName, value) {
  const errors = sengiValidation.validateDocTypeFields(docTypeName, value)

  if (Array.isArray(errors) && errors.length > 0) {
    throw new SengiDocTypeFieldsValidationFailedError(docTypeName, errors)
  }
}
