import check from 'check-types'
import { SengiDocumentCustomValidationError } from '../errors'

/**
 * Executes the validator function on the given doc type if
 * one is defined and that will raise an error if the validation
 * fails.
 * @param {Object} docType A doc type.
 * @param {Object} doc A document.
 */
export const executeValidator = (docType, doc) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)

  if (typeof docType.validate === 'function') {
    try {
      docType.validate(doc)
    } catch (err) {
      throw new SengiDocumentCustomValidationError(docType.name, err)
    }
  }
}
