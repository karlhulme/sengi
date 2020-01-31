const check = require('check-types')
const createJsonSchemaForDocTypeFunctionParameters = require('./createJsonSchemaForDocTypeFunctionParameters')
const getConstructorParameters = require('./getConstructorParameters')

/**
 * Creates a JSON schema for the constructor parameters of a given document type.
 * @param {Object} docType A document type.
 * @param {Array} fieldTypes An array of field types.
 */
const createJsonSchemaForDocTypeConstructorParameters = (docType, fieldTypes) => {
  check.assert.object(docType)
  check.assert.array.of.object(fieldTypes)

  const constructorParameters = getConstructorParameters(docType)
  return createJsonSchemaForDocTypeFunctionParameters(docType, 'Constructor', constructorParameters, fieldTypes)
}

module.exports = createJsonSchemaForDocTypeConstructorParameters
