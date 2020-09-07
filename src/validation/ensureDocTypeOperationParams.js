import { SengiDocTypeOperationParamsValidationFailedError } from '../errors'

/**
 * Ensures the given value is valid.
 * @param {SengiValidation} sengiValidation A Sengi validation object.
 * @param {String} docTypeName The name of a doc type.
 * @param {String} operationName The name of an operation.
 * @param {Object} value A set of fields.
 */
export function ensureDocTypeOperationParams (sengiValidation, docTypeName, operationName, value) {
  const errors = sengiValidation.validateDocTypeOperationParameters(docTypeName, operationName, value)

  if (Array.isArray(errors) && errors.length > 0) {
    throw new SengiDocTypeOperationParamsValidationFailedError(docTypeName, operationName, errors)
  }
}
