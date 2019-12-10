const check = require('check-types')
const { getReferencedFieldTypeNames } = require('../fieldTypes')
const createJsonSchemaDefinitionsSection = require('./createJsonSchemaDefinitionsSection')
const resolveParameterFieldDescription = require('./resolveParameterFieldDescription')
const resolveParameterFieldIsArray = require('./resolveParameterFieldIsArray')
const resolveParameterFieldTypeName = require('./resolveParameterFieldTypeName')

/**
 * Returns a list of the field type names that are directly referenced
 * by the fields on the given parameter block.
 * @param {Objec} docType a doc type.
 * @param {Object} functionParameters A parameter block.
 */
const getDirectlyReferencedFieldTypeNamesFromFunctionParameters = (docType, functionParameters) => {
  const directlyReferencedFieldTypeNames = []

  for (const parameterName in functionParameters) {
    const parameter = functionParameters[parameterName]

    const fieldTypeName = resolveParameterFieldTypeName(docType, parameterName, parameter)

    if (!directlyReferencedFieldTypeNames.includes(fieldTypeName)) {
      directlyReferencedFieldTypeNames.push(fieldTypeName)
    }
  }

  return directlyReferencedFieldTypeNames
}

/**
 * Create a non-array property node for a json schema.
 * @param {String} fieldTypeName The name of a field type.
 * @param {String} description The description of the parameter.
 */
const createJsonSchemaNonArrayProperty = (fieldTypeName, description) => {
  return {
    $ref: `#/definitions/${fieldTypeName}`,
    description: description
  }
}

/**
 * Create an array property node for a json schema.
 * @param {String} fieldTypeName The name of a field type.
 * @param {String} description The description of the parameter.
 */
const createJsonSchemaArrayProperty = (fieldTypeName, description) => {
  return {
    type: 'array',
    items: { $ref: `#/definitions/${fieldTypeName}` },
    description: description
  }
}

/**
 * Builds the 'properties' section of a JSON schema for the given doc type.
 * @param {Object} docType a doc type.
 * @param {Object} functionParameters A parameter block.
 */
const buildPropertiesSectionForDocTypeFunctionParameters = (docType, functionParameters) => {
  const properties = {}

  for (const parameterName in functionParameters) {
    const parameter = functionParameters[parameterName]
    const fieldTypeName = resolveParameterFieldTypeName(docType, parameterName, parameter)
    const parameterDescription = resolveParameterFieldDescription(docType, parameterName, parameter)
    const parameterIsArray = resolveParameterFieldIsArray(docType, parameterName, parameter)

    properties[parameterName] = parameterIsArray
      ? createJsonSchemaArrayProperty(fieldTypeName, parameterDescription)
      : createJsonSchemaNonArrayProperty(fieldTypeName, parameterDescription)
  }

  return properties
}

/**
 * Builds the 'required' section of a JSON schema for the given parameter block.
 * @param {Object} functionParameters A parameter block.
 */
const buildRequiredSectionForDocTypeFunctionParameters = functionParameters => {
  const required = []

  for (const parameterName in functionParameters) {
    const parameter = functionParameters[parameterName]

    if (parameter.isRequired) {
      required.push(parameterName)
    }
  }

  return required
}

/**
 * Creates a JSON Schema for the given doc type.
 * @param {Object} docType A doc type.
 * @param {String} subTitle A sub title to appear in the title of the schema.
 * @param {Object} functionParameters A parameter block.
 * @param {Array} fieldTypes An array of field types.
 */
const createJsonSchemaForDocTypeFunctionParameters = (docType, subTitle, functionParameters, fieldTypes) => {
  check.assert.object(docType)
  check.assert.string(docType.title)
  check.assert.string(subTitle)
  check.assert.object(functionParameters)
  check.assert.array.of.object(fieldTypes)

  const directlyReferencedFieldTypeNames = getDirectlyReferencedFieldTypeNamesFromFunctionParameters(docType, functionParameters)
  const referencedFieldTypeNames = getReferencedFieldTypeNames(fieldTypes, directlyReferencedFieldTypeNames)

  const properties = buildPropertiesSectionForDocTypeFunctionParameters(docType, functionParameters)
  const required = buildRequiredSectionForDocTypeFunctionParameters(functionParameters)
  const definitions = createJsonSchemaDefinitionsSection(fieldTypes, referencedFieldTypeNames)

  return {
    title: `${docType.title} "${subTitle}" JSON Schema`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties,
    required,
    definitions
  }
}

module.exports = createJsonSchemaForDocTypeFunctionParameters
