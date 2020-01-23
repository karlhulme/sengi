const check = require('check-types')
const { getReferencedFieldTypeNames } = require('../fieldTypes')
const createJsonSchemaDefinitionsSection = require('./createJsonSchemaDefinitionsSection')
const getFieldTypeNameForDocTypeField = require('./getFieldTypeNameForDocTypeField')

/**
 * Returns a list of the field type names that are directly referenced
 * by the fields on the given doc type.
 * @param {Object} docType A doc type.
 */
const getDirectlyReferencedFieldTypeNamesFromDocTypeFields = docType => {
  check.assert.object(docType.fields)

  const directlyReferencedFieldTypeNames = ['docId', 'docVersion', 'docCalcs', 'docOpId']

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]

    const fieldTypeName = getFieldTypeNameForDocTypeField(field)

    if (!directlyReferencedFieldTypeNames.includes(fieldTypeName)) {
      directlyReferencedFieldTypeNames.push(fieldTypeName)
    }
  }

  return directlyReferencedFieldTypeNames
}

/**
 * Create a non-array property node for a json schema.
 * @param {Object} field A field.
 * @param {String} fieldTypeName The name of a field type.
 */
const createJsonSchemaNonArrayProperty = (field, fieldTypeName) => {
  check.assert.string(field.description)

  return {
    $ref: `#/definitions/${fieldTypeName}`,
    description: field.description
  }
}

/**
 * Create an array property node for a json schema.
 * @param {Object} field A field.
 * @param {String} fieldTypeName The name of a field type.
 */
const createJsonSchemaArrayProperty = (field, fieldTypeName) => {
  check.assert.string(field.description)

  return {
    type: 'array',
    items: { $ref: `#/definitions/${fieldTypeName}` },
    description: field.description
  }
}

/**
 * Builds the 'properties' section of a JSON schema for the given doc type.
 * Note that while docVersion uses the docVersion type definition, it is not
 * a required field.
 * @param {Object} docType A doc type.
 */
const createJsonSchemaPropertiesSectionForDocTypeFields = docType => {
  check.assert.string(docType.name)
  check.assert.object(docType.fields)

  const properties = {}

  properties.id = { $ref: '#/definitions/docId', description: 'The id of the document.' }
  properties.docType = { enum: [docType.name], description: 'The type of the document.' }
  properties.docVersion = { $ref: '#/definitions/docVersion', description: 'The version of the current iteration of the document (eTag).' }
  properties.docOps = { type: 'array', items: { $ref: '#/definitions/docOpId' }, description: 'The id\'s of recent operations on the document.' }
  properties.docCalcs = { $ref: '#/definitions/docCalcs', description: 'The values of the calculated fields as determined on the last update.' }

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]
    const fieldTypeName = getFieldTypeNameForDocTypeField(field)

    properties[fieldName] = field.isArray
      ? createJsonSchemaArrayProperty(field, fieldTypeName)
      : createJsonSchemaNonArrayProperty(field, fieldTypeName)
  }

  return properties
}

/**
 * Builds the 'required' section of a JSON schema for the given doc type.
 * @param {Object} docType A doc type.
 */
const createJsonSchemaRequiredSectionForDocTypeFields = docType => {
  check.assert.object(docType.fields)

  const required = ['id', 'docType', 'docOps', 'docCalcs']

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]

    if (field.isRequired) {
      required.push(fieldName)
    }
  }

  return required
}

/**
 * Creates a JSON Schema for the given doc type.
 * @param {Object} docType A doc type.
 * @param {Array} fieldTypes An array of field types.
 */
const createJsonSchemaForDocTypeFields = (docType, fieldTypes) => {
  check.assert.object(docType)
  check.assert.string(docType.title)
  check.assert.array.of.object(fieldTypes)

  const directlyReferencedFieldTypeNames = getDirectlyReferencedFieldTypeNamesFromDocTypeFields(docType)
  const referencedFieldTypeNames = getReferencedFieldTypeNames(fieldTypes, directlyReferencedFieldTypeNames)

  const properties = createJsonSchemaPropertiesSectionForDocTypeFields(docType)
  const required = createJsonSchemaRequiredSectionForDocTypeFields(docType)
  const definitions = createJsonSchemaDefinitionsSection(fieldTypes, referencedFieldTypeNames)

  return {
    title: `${docType.title} JSON Schema`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: true,
    properties,
    required,
    definitions
  }
}

module.exports = createJsonSchemaForDocTypeFields
