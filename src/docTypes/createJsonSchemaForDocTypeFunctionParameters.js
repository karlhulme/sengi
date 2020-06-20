const check = require('check-types')
const { getReferencedFieldTypeNames } = require('jsonotron-validation')
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
 * @param {String} definitionsPath The path to the field definitions.
 */
const createNamedJsonSchemaNonArrayProperty = (fieldTypeName, description, definitionsPath) => {
  return {
    $ref: `${definitionsPath}${fieldTypeName}`,
    description: description
  }
}

/**
 * Create an array property node for a json schema.
 * @param {String} fieldTypeName The name of a field type.
 * @param {String} description The description of the parameter.
 * @param {String} definitionsPath The path to the field definitions.
 */
const createNamedJsonSchemaArrayProperty = (fieldTypeName, description, definitionsPath) => {
  return {
    type: 'array',
    items: { $ref: `${definitionsPath}${fieldTypeName}` },
    description: description
  }
}

/**
 * Builds the 'properties' section of a JSON schema for the given doc type.
 * @param {Object} docType a doc type.
 * @param {Object} functionParameters A parameter block.
 * @param {String} definitionsPath The path to the field definitions.
 */
const buildPropertiesSectionForDocTypeFunctionParameters = (docType, functionParameters, definitionsPath) => {
  const properties = {}

  for (const parameterName in functionParameters) {
    const parameter = functionParameters[parameterName]
    const fieldTypeName = resolveParameterFieldTypeName(docType, parameterName, parameter)
    const parameterDescription = resolveParameterFieldDescription(docType, parameterName, parameter)
    const parameterIsArray = resolveParameterFieldIsArray(docType, parameterName, parameter)

    properties[parameterName] = parameterIsArray
      ? createNamedJsonSchemaArrayProperty(fieldTypeName, parameterDescription, definitionsPath)
      : createNamedJsonSchemaNonArrayProperty(fieldTypeName, parameterDescription, definitionsPath)
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
 * @param {Boolean} [fragment] True if the $schema property should be omitted from the result.
 * @param {String} [externalDefs] A path to external definitions.  If supplied, then
 * the definitions property will omitted from the result.
 */
const createJsonSchemaForDocTypeFunctionParameters = (docType, subTitle, functionParameters, fieldTypes, fragment, externalDefs) => {
  check.assert.object(docType)
  check.assert.string(docType.title)
  check.assert.string(subTitle)
  check.assert.object(functionParameters)
  check.assert.array.of.object(fieldTypes)

  const definitionsInternalPath = '#/definitions/'
  const definitionsPath = typeof externalDefs === 'string' && externalDefs.length > 0 ? externalDefs : definitionsInternalPath

  const properties = buildPropertiesSectionForDocTypeFunctionParameters(docType, functionParameters, definitionsPath)
  const required = buildRequiredSectionForDocTypeFunctionParameters(functionParameters)

  const schema = {
    title: `${docType.title} "${subTitle}" JSON Schema`,
    type: 'object',
    additionalProperties: false,
    properties,
    required
  }

  if (!fragment) {
    schema.$schema = 'http://json-schema.org/draft-07/schema#'
  }

  if (definitionsPath === definitionsInternalPath) {
    const directlyReferencedFieldTypeNames = getDirectlyReferencedFieldTypeNamesFromFunctionParameters(docType, functionParameters)
    const referencedFieldTypeNames = getReferencedFieldTypeNames(fieldTypes, directlyReferencedFieldTypeNames)
    schema.definitions = createJsonSchemaDefinitionsSection(fieldTypes, referencedFieldTypeNames)
  }

  return schema
}

module.exports = createJsonSchemaForDocTypeFunctionParameters
