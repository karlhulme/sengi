const check = require('check-types')

/**
 * Create a non-array property node for a json schema.
 * @param {Object} docTypeField A field defined on a doc type.
 * @param {String} fieldTypeName The name of a field type.
 * @param {String} definitionsPath The path to the field definitions.
 */
const createJsonSchemaForDocTypeFieldNonArrayProperty = (docTypeField, fieldTypeName, definitionsPath) => {
  check.assert.object(docTypeField)
  check.assert.string(docTypeField.description)
  check.assert.string(definitionsPath)

  return {
    $ref: `${definitionsPath}${fieldTypeName}`,
    description: docTypeField.description
  }
}

module.exports = createJsonSchemaForDocTypeFieldNonArrayProperty
