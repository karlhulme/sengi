const check = require('check-types')
const {
  JsonotronInternalError,
  JsonotronOperationFailedError,
  JsonotronOperationNonObjectResponseError,
  JsonotronUnrecognisedOperationNameError
} = require('../errors')

/**
 * Call operation implementation and wrap any errors raised.
 * @param {String} docTypeName The name of the doc type.
 * @param {String} operationName The name of the operation being called.
 * @param {Function} implementation The function to be invoked.
 * @param {Object} doc A document.
 * @param {Object} operationParams The parameters of an operation.
 */
const callOperationImplementation = (docTypeName, operationName, implementation, doc, operationParams) => {
  try {
    return implementation(doc, operationParams)
  } catch (err) {
    throw new JsonotronOperationFailedError(docTypeName, operationName, err)
  }
}

/**
 * Execute a doc type operation that may alter the given document and
 * will return the result of the operation.
 * @param {String} docType A doc type.
 * @param {Object} doc A document that may be amended by the operation.
 * @param {String} operationName The name of an operation.
 * @param {Object} operationParams A parameter object to be passed to the operation.
 */
const executeOperation = (docType, doc, operationName, operationParams) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)
  check.assert.string(operationName)
  check.assert.object(operationParams)

  const operation = (docType.operations || {})[operationName]

  if (typeof operation !== 'object') {
    throw new JsonotronUnrecognisedOperationNameError(docType.name, operationName)
  }

  if (typeof operation.implementation !== 'function') {
    throw new JsonotronInternalError(`Doc type '${docType.name}' does not define an implementation for operation '${operationName}'.`)
  }

  const result = callOperationImplementation(docType.name, operationName, operation.implementation, doc, operationParams)

  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new JsonotronOperationNonObjectResponseError(docType.name, operationName)
  }

  return result
}

module.exports = executeOperation
