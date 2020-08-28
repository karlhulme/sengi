const check = require('check-types')

/**
 * Extracts the constructor declared parameters from the parameters
 * supplied to the constructor.
 * @param {Object} docType A document type.
 * @param {Object} constructorParams A set of constructor parameters that includes
 * both the declared constructor fields as well as regular fields intended
 * to be merged into the final document.
 */
const extractConstructorDeclaredParams = (docType, constructorParams) => {
  check.assert.object(docType)
  check.assert.object(docType.ctor)
  check.assert.object(docType.ctor.parameters)

  const result = {}

  for (const ctorParameterName in docType.ctor.parameters) {
    if (typeof constructorParams[ctorParameterName] !== 'undefined') {
      result[ctorParameterName] = constructorParams[ctorParameterName]
    }
  }

  return result
}

module.exports = extractConstructorDeclaredParams
