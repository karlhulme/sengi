const check = require('check-types')

/**
 * Extracts the merge parameters from the parameters
 * supplied to the constructor.
 * @param {Object} docType A document type.
 * @param {Object} constructorParams A set of constructor parameters that includes
 * both the declared constructor fields as well as regular fields intended
 * to be merged into the final document.
 */
const extractConstructorMergeParams = (docType, constructorParams) => {
  check.assert.object(docType)
  check.assert.object(docType.ctor)
  check.assert.object(docType.ctor.parameters)

  const result = {}

  for (const fieldName in docType.fields) {
    if (typeof constructorParams[fieldName] !== 'undefined') {
      result[fieldName] = constructorParams[fieldName]
    }
  }

  return result
}

module.exports = extractConstructorMergeParams
