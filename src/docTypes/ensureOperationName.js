const check = require('check-types')
const { JsonotronUnrecognisedOperationNameError } = require('jsonotron-errors')

/**
 * Ensure that the given operation name is an operation defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} operationName The name of an operation.
 */
const ensureOperationName = (docType, operationName) => {
  check.assert.object(docType)
  check.assert.object(docType.operations)
  check.assert.string(operationName)

  if (!docType.operations[operationName]) {
    throw new JsonotronUnrecognisedOperationNameError(docType.name, operationName)
  }
}

module.exports = ensureOperationName
