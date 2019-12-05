const check = require('check-types')
const { getReferencedFieldTypeNames } = require('../fieldTypes')
const createJsonSchemaDefinitionsSection = require('./createJsonSchemaDefinitionsSection')
const getFieldTypeNameForDocTypeField = require('./getFieldTypeNameForDocTypeField')

/**
 * Returns a list of the field type names that are directly referenced
 * by the updatable fields on the given doc type.
 * @param {Object} docType A doc type.
 */
const getDirectlyReferencedFieldTypeNamesFromDocTypeUpdateFields = docType => {
  check.assert.object(docType.fields)

  const directlyReferencedFieldTypeNames = []

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]

    if (field.canUpdate) {
      const fieldTypeName = getFieldTypeNameForDocTypeField(field)

      if (!directlyReferencedFieldTypeNames.includes(fieldTypeName)) {
        directlyReferencedFieldTypeNames.push(fieldTypeName)
      }
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
 * Builds the 'properties' section of an Update JSON schema for the given doc type.
 * @param {Object} docType A doc type.
 */
const createJsonSchemaPropertiesSectionForDocTypeUpdateFields = docType => {
  check.assert.object(docType.fields)

  const properties = {}

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]

    if (field.canUpdate) {
      const fieldTypeName = getFieldTypeNameForDocTypeField(field)

      properties[fieldName] = field.isArray
        ? createJsonSchemaArrayProperty(field, fieldTypeName)
        : createJsonSchemaNonArrayProperty(field, fieldTypeName)
    }
  }

  return properties
}

/**
 * Creates a JSON Schema for merge patches for the given doc type.
 * @param {Object} docType A doc type.
 * @param {Array} fieldTypes An array of field types.
 */
const createJsonSchemaForDocTypeMergePatch = (docType, fieldTypes) => {
  check.assert.object(docType)
  check.assert.string(docType.title)
  check.assert.array.of.object(fieldTypes)

  const directlyReferencedFieldTypeNames = getDirectlyReferencedFieldTypeNamesFromDocTypeUpdateFields(docType)
  const referencedFieldTypeNames = getReferencedFieldTypeNames(fieldTypes, directlyReferencedFieldTypeNames)

  const properties = createJsonSchemaPropertiesSectionForDocTypeUpdateFields(docType)
  const definitions = createJsonSchemaDefinitionsSection(fieldTypes, referencedFieldTypeNames)

  return {
    title: `${docType.title} "Merge Patch" JSON Schema`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties,
    definitions
  }
}

module.exports = createJsonSchemaForDocTypeMergePatch
