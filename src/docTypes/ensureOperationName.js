const getOperationNames = require('./getOperationNames')
const { JsonotronUnrecognisedOperationNameError } = require('jsonotron-errors')

/**
 * Ensure that the given operation name is an operation defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} operationName The name of an operation.
 */
const ensureOperationName = (docType, operationName) => {
  const operationNames = getOperationNames(docType)

  if (!operationNames.includes(operationName)) {
    throw new JsonotronUnrecognisedOperationNameError(docType.name, operationName)
  }
}

module.exports = ensureOperationName
