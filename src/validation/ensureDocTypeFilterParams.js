import { SengiDocTypeFilterParamsValidationFailedError } from '../errors'

/**
 * Ensures the given value is valid.
 * @param {SengiValidation} sengiValidation A Sengi validation object.
 * @param {String} docTypeName The name of a doc type.
 * @param {String} filterName The name of a filter.
 * @param {Object} value A set of fields.
 */
export function ensureDocTypeFilterParams (sengiValidation, docTypeName, filterName, value) {
  const errors = sengiValidation.validateDocTypeFilterParameters(docTypeName, filterName, value)

  if (Array.isArray(errors) && errors.length > 0) {
    throw new SengiDocTypeFilterParamsValidationFailedError(docTypeName, filterName, errors)
  }
}
