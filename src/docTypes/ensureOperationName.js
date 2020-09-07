import check from 'check-types'
import { SengiUnrecognisedOperationNameError } from '../errors'

/**
 * Ensure that the given operation name is an operation defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} operationName The name of an operation.
 */
export const ensureOperationName = (docType, operationName) => {
  check.assert.object(docType)
  check.assert.object(docType.operations)
  check.assert.string(operationName)

  if (typeof docType.operations[operationName] !== 'object') {
    throw new SengiUnrecognisedOperationNameError(docType.name, operationName)
  }
}
